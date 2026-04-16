import os
import tarfile
import tempfile
import requests
from xml.etree import ElementTree as ET
import zoneinfo
from decouple import config as env_config

from django.core.management.base import BaseCommand
from django.conf import settings
from django.utils import timezone

from apps.properties.models import Property, PropertyImage

# Mappa categorie_id → nome tipologia leggibile
# Fonte: https://gestionaleimmobiliare.it/export/help/specifiche_attributi.php
CATEGORIA_MAP = {
    '1': 'appartamento',
    '2': 'villa',
    '3': 'villetta',
    '4': 'attico',
    '5': 'box/garage',
    '6': 'negozio',
    '7': 'ufficio',
    '8': 'capannone',
    '9': 'terreno',
    '10': 'rustico',
    '11': 'appartamento',
    '12': 'monolocale',
    '13': 'bilocale',
    '14': 'trilocale',
    '15': 'quadrilocale',
    '16': 'multilocale',
    '17': 'ufficio',
    '18': 'villa',
    '19': 'villetta',
    '20': 'casale',
}

# Mappa ID 55 (info_inserite) → stringa classe energetica
# Fonte: https://gestionaleimmobiliare.it/export/help/specifiche_attributi.php
CLASSE_ENERGETICA_MAP = {
    0: '',     # in fase di definizione
    1: 'A+',
    2: 'A',
    3: 'B',
    4: 'C',
    5: 'D',
    6: 'E',
    7: 'F',
    8: 'G',
    9: '',     # non soggetto a classificazione
    10: 'A4',
    11: 'A3',
    12: 'A2',
    13: 'A1',
}


class Command(BaseCommand):
    help = 'Sincronizza gli immobili dal feed XML di GestionaleImmobiliare.it'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Forza sync ignorando il controllo fascia oraria (22:00–06:00)',
        )

    def handle(self, *args, **options):
        if not options['force']:
            italy_tz = zoneinfo.ZoneInfo('Europe/Rome')
            hour = timezone.now().astimezone(italy_tz).hour
            if 6 <= hour < 22:
                self.stdout.write(
                    self.style.WARNING(
                        f'Sync non eseguito: orario non consentito ({hour:02d}:00). '
                        'Il feed è disponibile solo tra le 22:00 e le 06:00. '
                        'Usa --force per bypassare in sviluppo.'
                    )
                )
                return

        feed_url = env_config('GESTIONALE_FEED_URL', default='')
        if not feed_url:
            self.stderr.write(self.style.ERROR(
                'GESTIONALE_FEED_URL non impostato. Configura la variabile d\'ambiente.'
            ))
            return

        self.stdout.write('Scaricando il feed XML...')

        try:
            response = requests.get(feed_url, timeout=120)
            response.raise_for_status()
        except requests.RequestException as e:
            self.stderr.write(self.style.ERROR(f'Errore download feed: {e}'))
            return

        with tempfile.TemporaryDirectory() as tmpdir:
            archive_path = os.path.join(tmpdir, 'feed.tar.gz')
            with open(archive_path, 'wb') as f:
                f.write(response.content)

            try:
                with tarfile.open(archive_path, 'r:gz') as tar:
                    tar.extractall(tmpdir)
            except tarfile.TarError as e:
                self.stderr.write(self.style.ERROR(f'Errore decompressione archivio: {e}'))
                return

            xml_file = None
            for fname in os.listdir(tmpdir):
                if fname.endswith('.xml'):
                    xml_file = os.path.join(tmpdir, fname)
                    break

            if not xml_file:
                self.stderr.write(self.style.ERROR('Nessun file XML trovato nell\'archivio.'))
                return

            self.stdout.write('Parsing XML e aggiornamento database...')
            self._process_xml(xml_file)

    def _process_xml(self, xml_file):
        try:
            tree = ET.parse(xml_file)
            root = tree.getroot()
        except ET.ParseError as e:
            self.stderr.write(self.style.ERROR(f'Errore parsing XML: {e}'))
            return

        feed_ids = set()
        created_count = 0
        updated_count = 0

        # Struttura reale feed: <dataset><annuncio><info>...</info><file_allegati>...</file_allegati></annuncio>
        annunci = root.findall('annuncio')

        for annuncio in annunci:
            info = annuncio.find('info')
            if info is None:
                continue

            gestionale_id = (info.findtext('id') or '').strip()
            if not gestionale_id:
                continue

            feed_ids.add(gestionale_id)

            # deleted=1 equivale a flag_storico
            flag_storico = (info.findtext('deleted') or '0').strip() == '1'
            if flag_storico:
                Property.objects.filter(gestionale_id=gestionale_id).update(flag_storico=True)
                continue

            data = self._parse_annuncio(info, annuncio)
            data['ultimo_sync'] = timezone.now()

            obj, created = Property.objects.update_or_create(
                gestionale_id=gestionale_id,
                defaults=data,
            )

            if created:
                created_count += 1
            else:
                updated_count += 1

            self._sync_images(obj, annuncio)

        # Marcare come storici gli immobili non più presenti nel feed
        removed_count = (
            Property.objects
            .exclude(gestionale_id__in=feed_ids)
            .exclude(flag_storico=True)
            .update(flag_storico=True)
        )

        self.stdout.write(
            self.style.SUCCESS(
                f'Sync completato — Nuovi: {created_count}, '
                f'Aggiornati: {updated_count}, '
                f'Rimossi: {removed_count}'
            )
        )

    def _parse_annuncio(self, info, annuncio):
        """Riceve i nodi <info> e <annuncio> e restituisce il dict per il modello."""
        categoria_id = (info.findtext('categorie_id') or '').strip()
        tipologia = CATEGORIA_MAP.get(categoria_id, categoria_id or '')

        seo_title = (info.findtext('seo_title') or '').strip()

        # Parsing info_inserite (figlio di <annuncio>, non di <info>)
        ii = self._parse_ii(annuncio)

        # Contratto: usa info_inserite ID 9 (vendita) / ID 10 (affitto) come fonte primaria
        # Il seo_title usa forme come "Affittasi" che non contengono "affitto" → inaffidabile
        if self._ii_int(ii, 10) == 1:
            contratto = 'affitto'
        elif self._ii_int(ii, 9) == 1:
            contratto = 'vendita'
        else:
            # Fallback sul titolo (copre anche "affittasi", "affittansi", ecc.)
            contratto = 'affitto' if 'affit' in seo_title.lower() else 'vendita'

        titolo = seo_title if seo_title else (
            f"{tipologia.capitalize()} a {(info.findtext('comune') or '').strip()}".strip()
        )

        # ID 1 = bagni, ID 2 = camere, ID 4 = soggiorno
        bagni = self._ii_positive_int(ii, 1)
        camere = self._ii_positive_int(ii, 2)
        soggiorno = self._ii_positive_int(ii, 4) or 0
        locali_val = (camere or 0) + soggiorno
        locali = locali_val if locali_val > 0 else None

        # ID 5 = garage, ID 13 = ascensore
        garage = self._ii_int(ii, 5) == 1
        ascensore = self._ii_int(ii, 13) == 1

        # ID 33 = piano numero (-2 = non indicato, 0 = piano terra)
        piano_num = self._ii_int(ii, 33)
        piano = str(piano_num) if piano_num is not None and piano_num >= 0 else ''

        # ID 16 = riscaldamento autonomo
        riscaldamento = 'Autonomo' if self._ii_int(ii, 16) == 1 else ''

        # ID 55 = classe energetica
        classe_en_raw = self._ii_int(ii, 55)
        classe_energetica = CLASSE_ENERGETICA_MAP.get(classe_en_raw, '') if classe_en_raw is not None else ''

        return {
            'codice_agenzia': (info.findtext('agency_code') or '').strip(),
            'titolo': titolo,
            'descrizione': (info.findtext('description') or '').strip(),
            'abstract': (info.findtext('abstract') or '').strip(),
            'prezzo': self._to_decimal(info.findtext('price')),
            'mq': self._to_int(info.findtext('mq')),
            'tipologia': tipologia,
            'categoria_id': self._to_int(categoria_id),
            'contratto': contratto,
            'indirizzo': (info.findtext('indirizzo') or '').strip(),
            'comune': (info.findtext('comune') or '').strip(),
            'provincia': (info.findtext('provincia') or '').strip(),
            'zona': (info.findtext('zona') or '').strip(),
            'latitudine': self._to_decimal(info.findtext('latitude')),
            'longitudine': self._to_decimal(info.findtext('longitude')),
            'codice_istat': (info.findtext('comune_istat') or '').strip(),
            'in_vetrina': (info.findtext('flag_vetrina') or '0') == '1',
            'in_carosello': (info.findtext('flag_carosello') or '0') == '1',
            'flag_storico': False,
            'bagni': bagni,
            'camere': camere,
            'locali': locali,
            'piano': piano,
            'ascensore': ascensore,
            'garage': garage,
            'riscaldamento': riscaldamento,
            'classe_energetica': classe_energetica,
        }

    def _parse_ii(self, annuncio):
        """Ritorna dict {int_id: str_value} da <info_inserite> (figlio di <annuncio>)."""
        ii_node = annuncio.find('info_inserite')
        if ii_node is None:
            return {}
        result = {}
        for node in ii_node.findall('info'):
            nid = node.findtext('id')
            val = node.findtext('valore_assegnato')
            if nid:
                try:
                    result[int(nid)] = val
                except ValueError:
                    pass
        return result

    def _ii_int(self, ii, id_):
        """Ritorna int da info_inserite per l'ID dato, o None se assente."""
        val = ii.get(id_)
        if val is None:
            return None
        try:
            return int(val)
        except (ValueError, TypeError):
            return None

    def _ii_positive_int(self, ii, id_):
        """Ritorna int > 0 da info_inserite, o None se 0 / -1 / -2 / assente."""
        v = self._ii_int(ii, id_)
        return v if v is not None and v > 0 else None

    def _to_int(self, value):
        try:
            return int(str(value).strip()) if value and str(value).strip() else None
        except (ValueError, TypeError):
            return None

    def _to_decimal(self, value):
        try:
            return float(str(value).strip()) if value and str(value).strip() else None
        except (ValueError, TypeError):
            return None

    def _sync_images(self, property_obj, annuncio):
        media_root = settings.MEDIA_ROOT
        prop_dir = os.path.join(media_root, 'properties', str(property_obj.gestionale_id))
        os.makedirs(prop_dir, exist_ok=True)

        existing_filenames = set(
            property_obj.images.values_list('filename', flat=True)
        )

        # Struttura reale: <file_allegati><allegato planimetria="0"><file_path>URL</file_path></allegato>
        allegati = annuncio.findall('.//file_allegati/allegato')

        ordine = 0
        for allegato in allegati:
            url = (allegato.findtext('file_path') or '').strip()
            if not url:
                continue

            filename = os.path.basename(url.split('?')[0])
            if not filename:
                continue

            is_planimetria = allegato.get('planimetria', '0') == '1'

            if filename in existing_filenames:
                ordine += 1
                continue

            try:
                img_response = requests.get(url, timeout=30)
                img_response.raise_for_status()
            except requests.RequestException:
                self.stderr.write(f'  Impossibile scaricare immagine: {url}')
                continue

            file_path = os.path.join(prop_dir, filename)
            with open(file_path, 'wb') as f:
                f.write(img_response.content)

            relative_path = os.path.join(
                'properties', str(property_obj.gestionale_id), filename
            )

            PropertyImage.objects.create(
                property=property_obj,
                filename=filename,
                file=relative_path,
                is_planimetria=is_planimetria,
                ordine=ordine,
            )
            ordine += 1
