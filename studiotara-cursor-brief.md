# Brief tecnico — Studiotara.it (restyling)
## Per Cursor

---

## Obiettivo

Realizzare il nuovo sito di Studiotara.it, agenzia immobiliare nell'hinterland sud-ovest di Milano. Il sito è un restyling dell'attuale studiotara.it e include un sistema di sincronizzazione automatica degli immobili tramite feed XML fornito dal gestionale GestionaleImmobiliare.it.

Il design di tutte le pagine è già definito su Figma. Cursor deve implementare fedelmente i mockup senza reinterpretare il layout.

---

## Stack tecnologico

- **Frontend:** Next.js — cartella `/frontend`
- **Backend + API:** Django (Python) — cartella `/backend`
- **Admin:** django-unfold
- **Database:** PostgreSQL
- **Sync immobili:** script Django che gira come cron job notturno (tra le 21:00 e le 07:00)
- **Hosting:** Railway — frontend, backend e database tutti sullo stesso progetto Railway
- **Repository:** GitHub — monorepo unico con frontend e backend

---

## Struttura del sito

Il sito è la versione ridesignata di studiotara.it. Le pagine principali sono:

- **Home**
- **Chi siamo**
- **Vendi immobile**
- **Cerco Residenziale**
- **Cerco Commerciale**
- **Blog**
- **Contatti**

Il design di ogni pagina è già disponibile su Figma. Cursor deve collegarsi al file Figma e implementare le pagine rispettando esattamente layout, tipografia, colori e componenti definiti nel mockup.

---

## Sistema di sincronizzazione immobili

### Fonte dati

Gli immobili provengono da **GestionaleImmobiliare.it** tramite un feed XML compresso (`.tar.gz`) scaricabile da un URL privato fornito dall'agenzia.

### Logica di sync

Lo script di sincronizzazione deve:

1. Scaricare il file `.tar.gz` dall'URL del feed
2. Decomprimere ed eseguire il parsing del file XML
3. Confrontare i dati con il database:
   - Inserire gli annunci nuovi
   - Aggiornare quelli modificati
   - Rimuovere quelli non più presenti nel feed o con `flag_storico = 1`
4. Scaricare le immagini nuove sul server — non riscaricarie se già presenti (a parità di nome il file non cambia mai)

### Orario obbligatorio

Il download del feed deve avvenire **esclusivamente tra le 22:00 e le 06:00**. Fuori da questa fascia l'IP viene bloccato dal gestionale.

### URL del feed

L'URL del feed XML da usare è:
`https://pannello.gestionaleimmobiliare.it/export_xml_annunci.html?agenzia_id=7519&filter=sito&public_key=2ca34eb78b550233&latlng=1&abstract=1&finiture=1&agente=1&etichette=1`

Salvarlo come variabile d'ambiente `GESTIONALE_FEED_URL` — non hardcodarlo nel codice.

### Parametri feed da attivare

Aggiungere questi parametri GET all'URL del feed:
- `latlng=1` — latitudine e longitudine
- `abstract=1` — descrizione breve
- `finiture=1` — finiture
- `agente=1` — agente assegnato
- `etichette=1` — etichette

### Struttura dati XML

Ogni annuncio contiene:

- Dati base: id, codice agenzia, prezzo, mq, indirizzo, comune, provincia, zona, codice ISTAT
- Tipologia: `categorie_id` (es. 11 = appartamento, 18 = villa, 17 = ufficio) e `categorie_micro_id`
- Caratteristiche (`info_inserite`): bagni, camere, piano, ascensore, garage, riscaldamento, classe energetica, ecc. — codificate con ID numerici
- Dati numerici (`dati_inseriti`): mq giardino, volumetria, catasto, ecc.
- Immagini: array di URL con flag planimetria
- Flag: vetrina, carosello, vacanza

La documentazione completa degli attributi è disponibile su:
`https://gestionaleimmobiliare.it/export/help/specifiche_attributi.php`

---

## API Django

Il backend Django espone API REST che il frontend Next.js consuma. Le API devono coprire almeno:

- Lista immobili con filtri (tipologia, comune, prezzo min/max, mq min/max, numero locali)
- Dettaglio singolo immobile
- Immobili in vetrina (per homepage e caroselli)
- Ricezione form valutazione (salva la richiesta nel DB e invia email di notifica all'agenzia)
- Lista articoli blog
- Dettaglio articolo blog
- Ricezione form contatto generico (salva nel DB e invia email di notifica all'agenzia)

---

## Note generali

- Il frontend non deve contenere logica di business: tutto passa dalle API Django
- Le immagini degli immobili devono essere servite dal backend, non direttamente dall'URL del gestionale
- Il sito è in italiano
- Non è prevista un'area admin personalizzata: la gestione degli immobili avviene interamente tramite GestionaleImmobiliare.it
- Il blog viene gestito tramite Django admin, che deve utilizzare **django-unfold** come tema (https://unfoldadmin.com). Unfold sostituisce l'interfaccia admin di default con una UI moderna basata su Tailwind CSS, più usabile per il cliente finale

---

## Riferimenti

- Sito attuale da restylinare: studiotara.it
- Documentazione feed XML: `https://gestionaleimmobiliare.it/export/docs/GI_sync_agenzia_v.1.34.pdf`
- Specifiche attributi XML: `https://gestionaleimmobiliare.it/export/help/specifiche_attributi.php`

