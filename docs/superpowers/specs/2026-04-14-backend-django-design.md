# Design — Backend Django Studiotara.it
**Data:** 2026-04-14

---

## Obiettivo

Backend Django per Studiotara.it, agenzia immobiliare nell'hinterland sud-ovest di Milano. Espone API REST consumate dal frontend Next.js, gestisce la sincronizzazione automatica degli immobili via feed XML, e include admin django-unfold per la gestione del blog.

---

## Stack

- Python 3.12 + Django 5.x
- Django REST Framework — API REST
- django-unfold — admin UI moderna
- django-cors-headers — CORS per Next.js
- PostgreSQL (Railway managed)
- Railway Volume — storage immagini persistente
- Email: configurabile via env var (differita)

---

## Struttura directory

```
backend/
├── manage.py
├── requirements.txt
├── .env.example
├── Dockerfile
├── entrypoint.sh
├── config/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── properties/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── blog/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── contacts/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   └── sync/
│       ├── management/
│       │   └── commands/
│       │       └── sync_properties.py
│       └── apps.py
└── media/
    └── properties/   # Montato su Railway Volume
```

---

## Modelli dati

### `Property` (app: properties)

| Campo | Tipo | Note |
|-------|------|------|
| gestionale_id | CharField(unique) | ID dal feed XML |
| codice_agenzia | CharField | |
| titolo | CharField | |
| descrizione | TextField | |
| abstract | TextField | Descrizione breve |
| prezzo | DecimalField | |
| mq | IntegerField | |
| tipologia | CharField | es. "appartamento", "villa" |
| categoria_id | IntegerField | ID numerico feed |
| contratto | CharField | "vendita" / "affitto" |
| indirizzo | CharField | |
| comune | CharField | |
| provincia | CharField | |
| zona | CharField | |
| latitudine | DecimalField(null) | |
| longitudine | DecimalField(null) | |
| codice_istat | CharField | |
| bagni | IntegerField(null) | |
| camere | IntegerField(null) | |
| locali | IntegerField(null) | |
| piano | CharField | |
| ascensore | BooleanField | |
| garage | BooleanField | |
| riscaldamento | CharField | |
| classe_energetica | CharField | |
| in_vetrina | BooleanField | Per homepage/caroselli |
| in_carosello | BooleanField | |
| flag_storico | BooleanField | Se True: non pubblicare |
| data_creazione | DateTimeField(auto) | |
| data_aggiornamento | DateTimeField(auto) | |
| ultimo_sync | DateTimeField | |

### `PropertyImage` (app: properties)

| Campo | Tipo | Note |
|-------|------|------|
| property | FK → Property | cascade delete |
| filename | CharField | Nome file originale (dedup) |
| file | ImageField | media/properties/<gestionale_id>/ |
| is_planimetria | BooleanField | |
| ordine | IntegerField | |

### `Article` (app: blog)

| Campo | Tipo | Note |
|-------|------|------|
| titolo | CharField | |
| slug | SlugField(unique) | Auto-generato |
| contenuto | TextField | |
| excerpt | TextField | |
| immagine | ImageField(null) | |
| pubblicato | BooleanField | |
| data_pubblicazione | DateTimeField | |
| data_creazione | DateTimeField(auto) | |

### `ContactRequest` (app: contacts)

| Campo | Tipo |
|-------|------|
| nome | CharField |
| email | EmailField |
| telefono | CharField |
| messaggio | TextField |
| data_invio | DateTimeField(auto) |

### `ValuationRequest` (app: contacts)

| Campo | Tipo | Note |
|-------|------|------|
| nome | CharField | |
| email | EmailField | |
| telefono | CharField | |
| indirizzo_immobile | CharField | |
| comune | CharField | |
| tipologia | CharField | |
| mq | IntegerField(null) | |
| note | TextField | |
| data_invio | DateTimeField(auto) | |

---

## API Endpoints

Tutti sotto prefisso `/api/`. CORS aperto per il frontend Next.js.

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/properties/` | Lista immobili (filtri: tipologia, comune, contratto, prezzo_min, prezzo_max, mq_min, mq_max, locali) |
| GET | `/api/properties/<id>/` | Dettaglio immobile |
| GET | `/api/properties/featured/` | Immobili con in_vetrina=True |
| GET | `/api/blog/articles/` | Lista articoli pubblicati |
| GET | `/api/blog/articles/<slug>/` | Dettaglio articolo |
| POST | `/api/contacts/contact/` | Salva ContactRequest |
| POST | `/api/contacts/valuation/` | Salva ValuationRequest |

Le immagini sono servite da Django via `/media/properties/<id>/<filename>`.

---

## Sync script

Management command: `python manage.py sync_properties`

Flusso:
1. Verifica fascia oraria 21:00–07:00 (bypass con `--force`)
2. Download `.tar.gz` da `GESTIONALE_FEED_URL`
3. Estrazione e parsing XML
4. Upsert immobili: insert nuovi, update modificati
5. Delete immobili con `flag_storico=1` o non più nel feed
6. Download immagini nuove: skip se `filename` già presente su disco

Cron su Railway: schedulato per girare una volta a notte (es. 02:00).

---

## Admin (django-unfold)

- Blog → Article: CRUD completo
- Properties → Property: sola lettura (gestita via gestionale)
- Properties → PropertyImage: sola lettura
- Contacts → ContactRequest: sola lettura
- Contacts → ValuationRequest: sola lettura

---

## Primo avvio — admin di test

`entrypoint.sh` esegue in sequenza:
1. `python manage.py migrate`
2. `python manage.py create_default_admin`
3. `gunicorn config.wsgi`

Il comando `create_default_admin` crea il superuser `admin` / `studiotara2024!` solo se non esiste, e stampa le credenziali nel terminale. Idempotente.

---

## Variabili d'ambiente

```env
SECRET_KEY=
DEBUG=False
ALLOWED_HOSTS=
DATABASE_URL=
GESTIONALE_FEED_URL=
MEDIA_ROOT=/app/media
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
DEFAULT_FROM_EMAIL=info@studiotara.it
AGENCY_EMAIL=info@studiotara.it
CORS_ALLOWED_ORIGINS=
```
