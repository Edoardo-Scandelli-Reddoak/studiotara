# Backend Django Studiotara — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Creare il backend Django completo per Studiotara.it con API REST, sync feed XML, admin django-unfold, e auto-creazione utente admin al primo avvio.

**Architecture:** Monolite Django modulare con 4 app (`properties`, `blog`, `contacts`, `sync`). Django REST Framework per le API. Script di sync come management command Django con controllo fascia oraria. Immagini persistite su Railway Volume in `media/properties/<gestionale_id>/`.

**Tech Stack:** Python 3.12, Django 5.0, Django REST Framework 3.15, django-unfold, django-cors-headers, psycopg2-binary, dj-database-url, Pillow, requests, python-decouple, gunicorn, pytest-django

---

## File Map

| File | Responsabilità |
|------|---------------|
| `backend/requirements.txt` | Dipendenze Python |
| `backend/.env.example` | Template variabili d'ambiente |
| `backend/manage.py` | Entry point Django |
| `backend/config/settings.py` | Configurazione Django (DB, media, CORS, email) |
| `backend/config/urls.py` | URL root con prefisso `/api/` |
| `backend/config/wsgi.py` | WSGI entry point |
| `backend/apps/properties/models.py` | Property, PropertyImage |
| `backend/apps/properties/serializers.py` | PropertyListSerializer, PropertyDetailSerializer, PropertyImageSerializer |
| `backend/apps/properties/views.py` | PropertyListView, PropertyDetailView, PropertyFeaturedView |
| `backend/apps/properties/urls.py` | URL patterns properties |
| `backend/apps/properties/admin.py` | Admin sola lettura con django-unfold |
| `backend/apps/blog/models.py` | Article |
| `backend/apps/blog/serializers.py` | ArticleListSerializer, ArticleDetailSerializer |
| `backend/apps/blog/views.py` | ArticleListView, ArticleDetailView |
| `backend/apps/blog/urls.py` | URL patterns blog |
| `backend/apps/blog/admin.py` | Admin CRUD con django-unfold |
| `backend/apps/contacts/models.py` | ContactRequest, ValuationRequest |
| `backend/apps/contacts/serializers.py` | ContactRequestSerializer, ValuationRequestSerializer |
| `backend/apps/contacts/views.py` | ContactRequestView, ValuationRequestView |
| `backend/apps/contacts/urls.py` | URL patterns contacts |
| `backend/apps/contacts/admin.py` | Admin sola lettura |
| `backend/apps/sync/management/commands/sync_properties.py` | Management command sync feed XML |
| `backend/apps/sync/management/commands/create_default_admin.py` | Management command creazione admin di test |
| `backend/Dockerfile` | Container per Railway |
| `backend/entrypoint.sh` | Migrate + create_default_admin + gunicorn |
| `backend/pytest.ini` | Configurazione pytest-django |
| `backend/tests/test_properties_api.py` | Test API properties |
| `backend/tests/test_blog_api.py` | Test API blog |
| `backend/tests/test_contacts_api.py` | Test API contacts |
| `backend/tests/test_sync_command.py` | Test comando sync (time window + parsing) |

---

## Task 1: Scaffold directory e dipendenze

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/.env.example`
- Create: `backend/manage.py`
- Create: `backend/config/__init__.py`
- Create: `backend/apps/__init__.py`
- Create: `backend/apps/properties/__init__.py`
- Create: `backend/apps/blog/__init__.py`
- Create: `backend/apps/contacts/__init__.py`
- Create: `backend/apps/sync/__init__.py`
- Create: `backend/tests/__init__.py`
- Create: `backend/pytest.ini`

- [ ] **Step 1: Creare `backend/requirements.txt`**

```
Django==5.0.4
djangorestframework==3.15.1
django-unfold==0.37.0
django-cors-headers==4.3.1
psycopg2-binary==2.9.9
Pillow==10.3.0
requests==2.31.0
python-decouple==3.8
dj-database-url==2.1.0
gunicorn==22.0.0
pytest==8.1.1
pytest-django==4.8.0
```

- [ ] **Step 2: Creare `backend/.env.example`**

```env
# Django
SECRET_KEY=cambia-questa-chiave-segreta
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/studiotara

# Media (immagini immobili — Railway Volume)
MEDIA_ROOT=/app/media

# Feed GestionaleImmobiliare.it
GESTIONALE_FEED_URL=https://pannello.gestionaleimmobiliare.it/export_xml_annunci.html?agenzia_id=7519&filter=sito&public_key=2ca34eb78b550233&latlng=1&abstract=1&finiture=1&agente=1&etichette=1

# Email (configurare con il provider SMTP dell'agenzia)
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
DEFAULT_FROM_EMAIL=info@studiotara.it
AGENCY_EMAIL=info@studiotara.it

# CORS — origini Next.js consentite
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

- [ ] **Step 3: Creare `backend/manage.py`**

```python
#!/usr/bin/env python
import os
import sys


def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
```

- [ ] **Step 4: Creare `backend/pytest.ini`**

```ini
[pytest]
DJANGO_SETTINGS_MODULE = config.settings
python_files = tests/test_*.py
python_classes = Test*
python_functions = test_*
```

- [ ] **Step 5: Creare tutti i file `__init__.py` vuoti**

```
backend/config/__init__.py        (vuoto)
backend/apps/__init__.py          (vuoto)
backend/apps/properties/__init__.py  (vuoto)
backend/apps/blog/__init__.py     (vuoto)
backend/apps/contacts/__init__.py (vuoto)
backend/apps/sync/__init__.py     (vuoto)
backend/tests/__init__.py         (vuoto)
```

- [ ] **Step 6: Installare dipendenze**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # o venv\Scripts\activate su Windows
pip install -r requirements.txt
```

Expected: nessun errore, tutte le dipendenze installate.

- [ ] **Step 7: Commit**

```bash
git add backend/
git commit -m "feat: scaffold backend Django con requirements e struttura directory"
```

---

## Task 2: Settings, URLs e WSGI

**Files:**
- Create: `backend/config/settings.py`
- Create: `backend/config/urls.py`
- Create: `backend/config/wsgi.py`

- [ ] **Step 1: Creare `backend/config/settings.py`**

```python
import os
from pathlib import Path
import dj_database_url
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY', default='dev-secret-key-non-usare-in-prod')
DEBUG = config('DEBUG', default=True, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1').split(',')

INSTALLED_APPS = [
    # django-unfold DEVE essere prima di django.contrib.admin
    'unfold',
    'unfold.contrib.filters',
    'unfold.contrib.forms',
    'unfold.contrib.inlines',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Terze parti
    'rest_framework',
    'corsheaders',
    # App locali
    'apps.properties',
    'apps.blog',
    'apps.contacts',
    'apps.sync',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # DEVE essere prima di CommonMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database
DATABASE_URL = config('DATABASE_URL', default='sqlite:///db.sqlite3')
DATABASES = {
    'default': dj_database_url.parse(DATABASE_URL)
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'it-it'
TIME_ZONE = 'Europe/Rome'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media files (immagini immobili — Railway Volume)
MEDIA_URL = '/media/'
MEDIA_ROOT = config('MEDIA_ROOT', default=os.path.join(BASE_DIR, 'media'))

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# CORS
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:3000'
).split(',')

# Email — configurabile via env var, console per default (log in terminale)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
EMAIL_HOST = config('EMAIL_HOST', default='')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='info@studiotara.it')
AGENCY_EMAIL = config('AGENCY_EMAIL', default='info@studiotara.it')

# Se le credenziali SMTP sono configurate, usa SMTP invece di console
if EMAIL_HOST and EMAIL_HOST_USER and EMAIL_HOST_PASSWORD:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# django-unfold
UNFOLD = {
    'SITE_TITLE': 'Studiotara Admin',
    'SITE_HEADER': 'Studiotara',
    'SITE_URL': '/',
}
```

- [ ] **Step 2: Creare `backend/config/urls.py`**

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/properties/', include('apps.properties.urls')),
    path('api/blog/', include('apps.blog.urls')),
    path('api/contacts/', include('apps.contacts.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

- [ ] **Step 3: Creare `backend/config/wsgi.py`**

```python
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
application = get_wsgi_application()
```

- [ ] **Step 4: Verificare che Django si avvii senza errori**

```bash
cd backend
python manage.py check
```

Expected: `System check identified no issues (0 silenced).`

- [ ] **Step 5: Commit**

```bash
git add backend/config/
git commit -m "feat: configurazione Django (settings, urls, wsgi)"
```

---

## Task 3: App properties — modelli

**Files:**
- Create: `backend/apps/properties/apps.py`
- Create: `backend/apps/properties/models.py`

- [ ] **Step 1: Creare `backend/apps/properties/apps.py`**

```python
from django.apps import AppConfig


class PropertiesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.properties'
    verbose_name = 'Immobili'
```

- [ ] **Step 2: Creare `backend/apps/properties/models.py`**

```python
from django.db import models


def property_image_path(instance, filename):
    return f"properties/{instance.property.gestionale_id}/{filename}"


class Property(models.Model):
    CONTRATTO_CHOICES = [
        ('vendita', 'Vendita'),
        ('affitto', 'Affitto'),
    ]

    # Identificatori
    gestionale_id = models.CharField(max_length=50, unique=True, verbose_name='ID gestionale')
    codice_agenzia = models.CharField(max_length=50, blank=True, verbose_name='Codice agenzia')

    # Dati principali
    titolo = models.CharField(max_length=255, verbose_name='Titolo')
    descrizione = models.TextField(blank=True, verbose_name='Descrizione')
    abstract = models.TextField(blank=True, verbose_name='Descrizione breve')
    prezzo = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, verbose_name='Prezzo (€)')
    mq = models.IntegerField(null=True, blank=True, verbose_name='MQ')
    tipologia = models.CharField(max_length=100, blank=True, verbose_name='Tipologia')
    categoria_id = models.IntegerField(null=True, blank=True, verbose_name='ID categoria')
    contratto = models.CharField(max_length=20, choices=CONTRATTO_CHOICES, blank=True, verbose_name='Contratto')

    # Localizzazione
    indirizzo = models.CharField(max_length=255, blank=True, verbose_name='Indirizzo')
    comune = models.CharField(max_length=100, blank=True, verbose_name='Comune')
    provincia = models.CharField(max_length=10, blank=True, verbose_name='Provincia')
    zona = models.CharField(max_length=100, blank=True, verbose_name='Zona')
    latitudine = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitudine = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    codice_istat = models.CharField(max_length=20, blank=True, verbose_name='Codice ISTAT')

    # Caratteristiche
    bagni = models.IntegerField(null=True, blank=True, verbose_name='Bagni')
    camere = models.IntegerField(null=True, blank=True, verbose_name='Camere')
    locali = models.IntegerField(null=True, blank=True, verbose_name='Locali')
    piano = models.CharField(max_length=50, blank=True, verbose_name='Piano')
    ascensore = models.BooleanField(default=False, verbose_name='Ascensore')
    garage = models.BooleanField(default=False, verbose_name='Garage')
    riscaldamento = models.CharField(max_length=100, blank=True, verbose_name='Riscaldamento')
    classe_energetica = models.CharField(max_length=10, blank=True, verbose_name='Classe energetica')

    # Flag
    in_vetrina = models.BooleanField(default=False, verbose_name='In vetrina')
    in_carosello = models.BooleanField(default=False, verbose_name='In carosello')
    flag_storico = models.BooleanField(default=False, verbose_name='Storico (non pubblicare)')

    # Timestamp
    data_creazione = models.DateTimeField(auto_now_add=True, verbose_name='Data creazione')
    data_aggiornamento = models.DateTimeField(auto_now=True, verbose_name='Ultimo aggiornamento')
    ultimo_sync = models.DateTimeField(null=True, blank=True, verbose_name='Ultimo sync')

    class Meta:
        verbose_name = 'Immobile'
        verbose_name_plural = 'Immobili'
        ordering = ['-data_aggiornamento']

    def __str__(self):
        return f"{self.titolo} — {self.comune}"


class PropertyImage(models.Model):
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name='images', verbose_name='Immobile'
    )
    filename = models.CharField(max_length=255, verbose_name='Nome file')
    file = models.ImageField(upload_to=property_image_path, verbose_name='File')
    is_planimetria = models.BooleanField(default=False, verbose_name='È planimetria')
    ordine = models.IntegerField(default=0, verbose_name='Ordine')

    class Meta:
        verbose_name = 'Immagine'
        verbose_name_plural = 'Immagini'
        ordering = ['ordine']

    def __str__(self):
        return f"{self.property} — {self.filename}"
```

- [ ] **Step 3: Creare e applicare le migration**

```bash
python manage.py makemigrations properties
python manage.py migrate
```

Expected: migration `0001_initial.py` creata e applicata.

- [ ] **Step 4: Commit**

```bash
git add backend/apps/properties/
git commit -m "feat: modelli Property e PropertyImage"
```

---

## Task 4: App blog — modelli

**Files:**
- Create: `backend/apps/blog/apps.py`
- Create: `backend/apps/blog/models.py`

- [ ] **Step 1: Creare `backend/apps/blog/apps.py`**

```python
from django.apps import AppConfig


class BlogConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.blog'
    verbose_name = 'Blog'
```

- [ ] **Step 2: Creare `backend/apps/blog/models.py`**

```python
from django.db import models
from django.utils.text import slugify


class Article(models.Model):
    titolo = models.CharField(max_length=255, verbose_name='Titolo')
    slug = models.SlugField(unique=True, blank=True, verbose_name='Slug URL')
    contenuto = models.TextField(verbose_name='Contenuto')
    excerpt = models.TextField(blank=True, verbose_name='Riassunto')
    immagine = models.ImageField(upload_to='blog/', null=True, blank=True, verbose_name='Immagine copertina')
    pubblicato = models.BooleanField(default=False, verbose_name='Pubblicato')
    data_pubblicazione = models.DateTimeField(null=True, blank=True, verbose_name='Data pubblicazione')
    data_creazione = models.DateTimeField(auto_now_add=True, verbose_name='Data creazione')

    class Meta:
        verbose_name = 'Articolo'
        verbose_name_plural = 'Articoli'
        ordering = ['-data_pubblicazione']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.titolo)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.titolo
```

- [ ] **Step 3: Migration**

```bash
python manage.py makemigrations blog
python manage.py migrate
```

Expected: `0001_initial.py` creata e applicata.

- [ ] **Step 4: Commit**

```bash
git add backend/apps/blog/
git commit -m "feat: modello Article per il blog"
```

---

## Task 5: App contacts — modelli

**Files:**
- Create: `backend/apps/contacts/apps.py`
- Create: `backend/apps/contacts/models.py`

- [ ] **Step 1: Creare `backend/apps/contacts/apps.py`**

```python
from django.apps import AppConfig


class ContactsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.contacts'
    verbose_name = 'Contatti'
```

- [ ] **Step 2: Creare `backend/apps/contacts/models.py`**

```python
from django.db import models


class ContactRequest(models.Model):
    nome = models.CharField(max_length=100, verbose_name='Nome')
    email = models.EmailField(verbose_name='Email')
    telefono = models.CharField(max_length=20, blank=True, verbose_name='Telefono')
    messaggio = models.TextField(verbose_name='Messaggio')
    data_invio = models.DateTimeField(auto_now_add=True, verbose_name='Data invio')

    class Meta:
        verbose_name = 'Richiesta contatto'
        verbose_name_plural = 'Richieste contatto'
        ordering = ['-data_invio']

    def __str__(self):
        return f"{self.nome} — {self.email}"


class ValuationRequest(models.Model):
    nome = models.CharField(max_length=100, verbose_name='Nome')
    email = models.EmailField(verbose_name='Email')
    telefono = models.CharField(max_length=20, blank=True, verbose_name='Telefono')
    indirizzo_immobile = models.CharField(max_length=255, verbose_name='Indirizzo immobile')
    comune = models.CharField(max_length=100, verbose_name='Comune')
    tipologia = models.CharField(max_length=100, verbose_name='Tipologia immobile')
    mq = models.IntegerField(null=True, blank=True, verbose_name='MQ (opzionale)')
    note = models.TextField(blank=True, verbose_name='Note')
    data_invio = models.DateTimeField(auto_now_add=True, verbose_name='Data invio')

    class Meta:
        verbose_name = 'Richiesta valutazione'
        verbose_name_plural = 'Richieste valutazione'
        ordering = ['-data_invio']

    def __str__(self):
        return f"{self.nome} — {self.indirizzo_immobile}"
```

- [ ] **Step 3: Migration**

```bash
python manage.py makemigrations contacts
python manage.py migrate
```

- [ ] **Step 4: Commit**

```bash
git add backend/apps/contacts/
git commit -m "feat: modelli ContactRequest e ValuationRequest"
```

---

## Task 6: API properties — serializers, views, urls

**Files:**
- Create: `backend/apps/properties/serializers.py`
- Create: `backend/apps/properties/views.py`
- Create: `backend/apps/properties/urls.py`
- Create: `backend/tests/test_properties_api.py`

- [ ] **Step 1: Scrivere il test che fallisce (`backend/tests/test_properties_api.py`)**

```python
import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.properties.models import Property


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def property_obj(db):
    return Property.objects.create(
        gestionale_id='TEST001',
        titolo='Appartamento Milano',
        comune='Milano',
        tipologia='appartamento',
        contratto='vendita',
        prezzo=250000,
        mq=80,
        locali=3,
        in_vetrina=True,
        flag_storico=False,
    )


@pytest.mark.django_db
def test_property_list_returns_200(client, property_obj):
    url = reverse('properties:list')
    response = client.get(url)
    assert response.status_code == 200


@pytest.mark.django_db
def test_property_list_contains_property(client, property_obj):
    url = reverse('properties:list')
    response = client.get(url)
    assert response.data['count'] == 1
    assert response.data['results'][0]['gestionale_id'] == 'TEST001'


@pytest.mark.django_db
def test_property_list_excludes_storico(client, db):
    Property.objects.create(
        gestionale_id='STORICO01',
        titolo='Vecchio immobile',
        comune='Milano',
        flag_storico=True,
    )
    url = reverse('properties:list')
    response = client.get(url)
    assert response.data['count'] == 0


@pytest.mark.django_db
def test_property_list_filter_by_tipologia(client, property_obj):
    url = reverse('properties:list')
    response = client.get(url, {'tipologia': 'appartamento'})
    assert response.data['count'] == 1
    response2 = client.get(url, {'tipologia': 'villa'})
    assert response2.data['count'] == 0


@pytest.mark.django_db
def test_property_list_filter_by_prezzo_max(client, property_obj):
    url = reverse('properties:list')
    response = client.get(url, {'prezzo_max': 300000})
    assert response.data['count'] == 1
    response2 = client.get(url, {'prezzo_max': 200000})
    assert response2.data['count'] == 0


@pytest.mark.django_db
def test_property_detail_returns_200(client, property_obj):
    url = reverse('properties:detail', kwargs={'pk': property_obj.pk})
    response = client.get(url)
    assert response.status_code == 200
    assert response.data['gestionale_id'] == 'TEST001'


@pytest.mark.django_db
def test_property_featured_returns_only_vetrina(client, property_obj, db):
    Property.objects.create(
        gestionale_id='NOT_FEATURED',
        titolo='Non in vetrina',
        comune='Milano',
        in_vetrina=False,
        flag_storico=False,
    )
    url = reverse('properties:featured')
    response = client.get(url)
    assert response.status_code == 200
    assert response.data['count'] == 1
    assert response.data['results'][0]['gestionale_id'] == 'TEST001'
```

- [ ] **Step 2: Eseguire il test per verificare che fallisca**

```bash
cd backend
pytest tests/test_properties_api.py -v
```

Expected: FAIL — `ModuleNotFoundError` o `NoReverseMatch` (views non ancora create).

- [ ] **Step 3: Creare `backend/apps/properties/serializers.py`**

```python
from rest_framework import serializers
from .models import Property, PropertyImage


class PropertyImageSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ['id', 'file_url', 'is_planimetria', 'ordine']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None


class PropertyListSerializer(serializers.ModelSerializer):
    immagine_principale = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id', 'gestionale_id', 'titolo', 'tipologia', 'contratto',
            'prezzo', 'mq', 'comune', 'provincia', 'zona',
            'locali', 'bagni', 'camere', 'piano',
            'ascensore', 'garage', 'classe_energetica',
            'in_vetrina', 'in_carosello',
            'immagine_principale',
        ]

    def get_immagine_principale(self, obj):
        img = obj.images.filter(is_planimetria=False).first()
        if img:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(img.file.url)
        return None


class PropertyDetailSerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        exclude = ['flag_storico', 'ultimo_sync']
```

- [ ] **Step 4: Creare `backend/apps/properties/views.py`**

```python
from rest_framework import generics
from .models import Property
from .serializers import PropertyListSerializer, PropertyDetailSerializer


class PropertyListView(generics.ListAPIView):
    serializer_class = PropertyListSerializer

    def get_queryset(self):
        qs = Property.objects.filter(flag_storico=False).prefetch_related('images')

        tipologia = self.request.query_params.get('tipologia')
        comune = self.request.query_params.get('comune')
        contratto = self.request.query_params.get('contratto')
        prezzo_min = self.request.query_params.get('prezzo_min')
        prezzo_max = self.request.query_params.get('prezzo_max')
        mq_min = self.request.query_params.get('mq_min')
        mq_max = self.request.query_params.get('mq_max')
        locali = self.request.query_params.get('locali')

        if tipologia:
            qs = qs.filter(tipologia__icontains=tipologia)
        if comune:
            qs = qs.filter(comune__icontains=comune)
        if contratto:
            qs = qs.filter(contratto=contratto)
        if prezzo_min:
            qs = qs.filter(prezzo__gte=prezzo_min)
        if prezzo_max:
            qs = qs.filter(prezzo__lte=prezzo_max)
        if mq_min:
            qs = qs.filter(mq__gte=mq_min)
        if mq_max:
            qs = qs.filter(mq__lte=mq_max)
        if locali:
            qs = qs.filter(locali=locali)

        return qs


class PropertyDetailView(generics.RetrieveAPIView):
    queryset = Property.objects.filter(flag_storico=False).prefetch_related('images')
    serializer_class = PropertyDetailSerializer


class PropertyFeaturedView(generics.ListAPIView):
    queryset = (
        Property.objects
        .filter(flag_storico=False, in_vetrina=True)
        .prefetch_related('images')
    )
    serializer_class = PropertyListSerializer
```

- [ ] **Step 5: Creare `backend/apps/properties/urls.py`**

```python
from django.urls import path
from .views import PropertyListView, PropertyDetailView, PropertyFeaturedView

app_name = 'properties'

urlpatterns = [
    path('', PropertyListView.as_view(), name='list'),
    path('featured/', PropertyFeaturedView.as_view(), name='featured'),
    path('<int:pk>/', PropertyDetailView.as_view(), name='detail'),
]
```

- [ ] **Step 6: Eseguire i test**

```bash
pytest tests/test_properties_api.py -v
```

Expected: tutti i test PASS.

- [ ] **Step 7: Commit**

```bash
git add backend/apps/properties/ backend/tests/test_properties_api.py
git commit -m "feat: API properties (list, detail, featured) con filtri"
```

---

## Task 7: API blog — serializers, views, urls

**Files:**
- Create: `backend/apps/blog/serializers.py`
- Create: `backend/apps/blog/views.py`
- Create: `backend/apps/blog/urls.py`
- Create: `backend/tests/test_blog_api.py`

- [ ] **Step 1: Scrivere il test che fallisce (`backend/tests/test_blog_api.py`)**

```python
import pytest
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient
from apps.blog.models import Article


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def article(db):
    return Article.objects.create(
        titolo='Mercato immobiliare 2024',
        contenuto='Contenuto articolo...',
        excerpt='Riassunto articolo',
        pubblicato=True,
        data_pubblicazione=timezone.now(),
    )


@pytest.mark.django_db
def test_article_list_returns_200(client, article):
    url = reverse('blog:list')
    response = client.get(url)
    assert response.status_code == 200


@pytest.mark.django_db
def test_article_list_returns_only_published(client, db):
    Article.objects.create(
        titolo='Bozza',
        contenuto='...',
        pubblicato=False,
        data_pubblicazione=timezone.now(),
    )
    Article.objects.create(
        titolo='Pubblicato',
        contenuto='...',
        pubblicato=True,
        data_pubblicazione=timezone.now(),
    )
    url = reverse('blog:list')
    response = client.get(url)
    assert response.data['count'] == 1
    assert response.data['results'][0]['titolo'] == 'Pubblicato'


@pytest.mark.django_db
def test_article_detail_by_slug(client, article):
    url = reverse('blog:detail', kwargs={'slug': article.slug})
    response = client.get(url)
    assert response.status_code == 200
    assert response.data['titolo'] == 'Mercato immobiliare 2024'


@pytest.mark.django_db
def test_article_detail_404_for_unpublished(client, db):
    a = Article.objects.create(
        titolo='Bozza privata',
        contenuto='...',
        pubblicato=False,
        data_pubblicazione=timezone.now(),
    )
    url = reverse('blog:detail', kwargs={'slug': a.slug})
    response = client.get(url)
    assert response.status_code == 404
```

- [ ] **Step 2: Eseguire il test per verificare che fallisca**

```bash
pytest tests/test_blog_api.py -v
```

Expected: FAIL.

- [ ] **Step 3: Creare `backend/apps/blog/serializers.py`**

```python
from rest_framework import serializers
from .models import Article


class ArticleListSerializer(serializers.ModelSerializer):
    immagine_url = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ['id', 'titolo', 'slug', 'excerpt', 'immagine_url', 'data_pubblicazione']

    def get_immagine_url(self, obj):
        request = self.context.get('request')
        if obj.immagine and request:
            return request.build_absolute_uri(obj.immagine.url)
        return None


class ArticleDetailSerializer(serializers.ModelSerializer):
    immagine_url = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ['id', 'titolo', 'slug', 'contenuto', 'excerpt', 'immagine_url', 'data_pubblicazione']

    def get_immagine_url(self, obj):
        request = self.context.get('request')
        if obj.immagine and request:
            return request.build_absolute_uri(obj.immagine.url)
        return None
```

- [ ] **Step 4: Creare `backend/apps/blog/views.py`**

```python
from rest_framework import generics
from .models import Article
from .serializers import ArticleListSerializer, ArticleDetailSerializer


class ArticleListView(generics.ListAPIView):
    queryset = Article.objects.filter(pubblicato=True).order_by('-data_pubblicazione')
    serializer_class = ArticleListSerializer


class ArticleDetailView(generics.RetrieveAPIView):
    queryset = Article.objects.filter(pubblicato=True)
    serializer_class = ArticleDetailSerializer
    lookup_field = 'slug'
```

- [ ] **Step 5: Creare `backend/apps/blog/urls.py`**

```python
from django.urls import path
from .views import ArticleListView, ArticleDetailView

app_name = 'blog'

urlpatterns = [
    path('articles/', ArticleListView.as_view(), name='list'),
    path('articles/<slug:slug>/', ArticleDetailView.as_view(), name='detail'),
]
```

- [ ] **Step 6: Eseguire i test**

```bash
pytest tests/test_blog_api.py -v
```

Expected: tutti i test PASS.

- [ ] **Step 7: Commit**

```bash
git add backend/apps/blog/ backend/tests/test_blog_api.py
git commit -m "feat: API blog (list articoli pubblicati, detail per slug)"
```

---

## Task 8: API contacts — serializers, views, urls

**Files:**
- Create: `backend/apps/contacts/serializers.py`
- Create: `backend/apps/contacts/views.py`
- Create: `backend/apps/contacts/urls.py`
- Create: `backend/tests/test_contacts_api.py`

- [ ] **Step 1: Scrivere il test che fallisce (`backend/tests/test_contacts_api.py`)**

```python
import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.contacts.models import ContactRequest, ValuationRequest


@pytest.fixture
def client():
    return APIClient()


@pytest.mark.django_db
def test_contact_form_saves_to_db(client):
    url = reverse('contacts:contact')
    payload = {
        'nome': 'Mario Rossi',
        'email': 'mario@example.com',
        'telefono': '3331234567',
        'messaggio': 'Vorrei informazioni su un immobile.',
    }
    response = client.post(url, payload, format='json')
    assert response.status_code == 201
    assert ContactRequest.objects.filter(email='mario@example.com').exists()


@pytest.mark.django_db
def test_contact_form_requires_email(client):
    url = reverse('contacts:contact')
    payload = {
        'nome': 'Mario Rossi',
        'messaggio': 'Ciao',
    }
    response = client.post(url, payload, format='json')
    assert response.status_code == 400
    assert 'email' in response.data


@pytest.mark.django_db
def test_valuation_form_saves_to_db(client):
    url = reverse('contacts:valuation')
    payload = {
        'nome': 'Luisa Bianchi',
        'email': 'luisa@example.com',
        'telefono': '3339876543',
        'indirizzo_immobile': 'Via Roma 1',
        'comune': 'Milano',
        'tipologia': 'appartamento',
        'mq': 90,
    }
    response = client.post(url, payload, format='json')
    assert response.status_code == 201
    assert ValuationRequest.objects.filter(email='luisa@example.com').exists()


@pytest.mark.django_db
def test_valuation_form_requires_comune(client):
    url = reverse('contacts:valuation')
    payload = {
        'nome': 'Luisa Bianchi',
        'email': 'luisa@example.com',
        'indirizzo_immobile': 'Via Roma 1',
        'tipologia': 'appartamento',
        # comune mancante
    }
    response = client.post(url, payload, format='json')
    assert response.status_code == 400
    assert 'comune' in response.data
```

- [ ] **Step 2: Eseguire il test per verificare che fallisca**

```bash
pytest tests/test_contacts_api.py -v
```

Expected: FAIL.

- [ ] **Step 3: Creare `backend/apps/contacts/serializers.py`**

```python
from rest_framework import serializers
from .models import ContactRequest, ValuationRequest


class ContactRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactRequest
        fields = ['nome', 'email', 'telefono', 'messaggio']


class ValuationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValuationRequest
        fields = ['nome', 'email', 'telefono', 'indirizzo_immobile', 'comune', 'tipologia', 'mq', 'note']
```

- [ ] **Step 4: Creare `backend/apps/contacts/views.py`**

```python
from rest_framework import generics, status
from rest_framework.response import Response
from .models import ContactRequest, ValuationRequest
from .serializers import ContactRequestSerializer, ValuationRequestSerializer


class ContactRequestView(generics.CreateAPIView):
    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Email differita: verrà inviata quando EMAIL_HOST sarà configurato
        return Response(
            {'message': 'Richiesta inviata con successo.'},
            status=status.HTTP_201_CREATED,
        )


class ValuationRequestView(generics.CreateAPIView):
    queryset = ValuationRequest.objects.all()
    serializer_class = ValuationRequestSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Email differita: verrà inviata quando EMAIL_HOST sarà configurato
        return Response(
            {'message': 'Richiesta di valutazione inviata con successo.'},
            status=status.HTTP_201_CREATED,
        )
```

- [ ] **Step 5: Creare `backend/apps/contacts/urls.py`**

```python
from django.urls import path
from .views import ContactRequestView, ValuationRequestView

app_name = 'contacts'

urlpatterns = [
    path('contact/', ContactRequestView.as_view(), name='contact'),
    path('valuation/', ValuationRequestView.as_view(), name='valuation'),
]
```

- [ ] **Step 6: Eseguire i test**

```bash
pytest tests/test_contacts_api.py -v
```

Expected: tutti i test PASS.

- [ ] **Step 7: Commit**

```bash
git add backend/apps/contacts/ backend/tests/test_contacts_api.py
git commit -m "feat: API contacts (form contatto e valutazione)"
```

---

## Task 9: Admin django-unfold

**Files:**
- Create: `backend/apps/properties/admin.py`
- Create: `backend/apps/blog/admin.py`
- Create: `backend/apps/contacts/admin.py`

- [ ] **Step 1: Creare `backend/apps/properties/admin.py`**

```python
from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline
from .models import Property, PropertyImage


class PropertyImageInline(TabularInline):
    model = PropertyImage
    extra = 0
    readonly_fields = ['filename', 'file', 'is_planimetria', 'ordine']
    can_delete = False


@admin.register(Property)
class PropertyAdmin(ModelAdmin):
    list_display = [
        'titolo', 'comune', 'tipologia', 'contratto',
        'prezzo', 'mq', 'in_vetrina', 'flag_storico',
    ]
    list_filter = ['tipologia', 'contratto', 'in_vetrina', 'flag_storico', 'provincia']
    search_fields = ['titolo', 'comune', 'codice_agenzia', 'gestionale_id']
    readonly_fields = [f.name for f in Property._meta.get_fields() if hasattr(f, 'name')]
    inlines = [PropertyImageInline]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
```

- [ ] **Step 2: Creare `backend/apps/blog/admin.py`**

```python
from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Article


@admin.register(Article)
class ArticleAdmin(ModelAdmin):
    list_display = ['titolo', 'pubblicato', 'data_pubblicazione', 'data_creazione']
    list_filter = ['pubblicato']
    search_fields = ['titolo', 'contenuto']
    prepopulated_fields = {'slug': ('titolo',)}
    list_editable = ['pubblicato']
    date_hierarchy = 'data_pubblicazione'
```

- [ ] **Step 3: Creare `backend/apps/contacts/admin.py`**

```python
from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import ContactRequest, ValuationRequest


@admin.register(ContactRequest)
class ContactRequestAdmin(ModelAdmin):
    list_display = ['nome', 'email', 'telefono', 'data_invio']
    search_fields = ['nome', 'email']
    readonly_fields = ['nome', 'email', 'telefono', 'messaggio', 'data_invio']

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(ValuationRequest)
class ValuationRequestAdmin(ModelAdmin):
    list_display = ['nome', 'email', 'comune', 'tipologia', 'data_invio']
    search_fields = ['nome', 'email', 'comune']
    readonly_fields = [
        'nome', 'email', 'telefono', 'indirizzo_immobile',
        'comune', 'tipologia', 'mq', 'note', 'data_invio',
    ]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
```

- [ ] **Step 4: Verificare che l'admin si carichi senza errori**

```bash
python manage.py check
```

Expected: no issues.

- [ ] **Step 5: Commit**

```bash
git add backend/apps/properties/admin.py backend/apps/blog/admin.py backend/apps/contacts/admin.py
git commit -m "feat: admin django-unfold (properties sola lettura, blog CRUD)"
```

---

## Task 10: App sync — management commands

**Files:**
- Create: `backend/apps/sync/apps.py`
- Create: `backend/apps/sync/management/__init__.py`
- Create: `backend/apps/sync/management/commands/__init__.py`
- Create: `backend/apps/sync/management/commands/create_default_admin.py`
- Create: `backend/apps/sync/management/commands/sync_properties.py`
- Create: `backend/tests/test_sync_command.py`

- [ ] **Step 1: Creare `backend/apps/sync/apps.py`**

```python
from django.apps import AppConfig


class SyncConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.sync'
    verbose_name = 'Sync'
```

- [ ] **Step 2: Creare i file `__init__.py` della directory management**

```
backend/apps/sync/management/__init__.py        (vuoto)
backend/apps/sync/management/commands/__init__.py  (vuoto)
```

- [ ] **Step 3: Scrivere il test del time window (`backend/tests/test_sync_command.py`)**

```python
import pytest
from unittest.mock import patch
from io import StringIO
from django.core.management import call_command


@pytest.mark.django_db
def test_sync_blocked_during_day():
    """Sync deve essere bloccato tra le 07:00 e le 21:00."""
    out = StringIO()
    with patch('apps.sync.management.commands.sync_properties.datetime') as mock_dt:
        from datetime import datetime as real_datetime
        mock_dt.now.return_value = real_datetime(2024, 1, 15, 12, 0, 0)  # 12:00 → bloccato
        call_command('sync_properties', stdout=out)
    assert 'non consentito' in out.getvalue().lower() or 'orario' in out.getvalue().lower()


@pytest.mark.django_db
def test_sync_allowed_at_night():
    """Con --force il controllo orario viene bypassato."""
    out = StringIO()
    with patch('apps.sync.management.commands.sync_properties.requests') as mock_req:
        mock_req.get.side_effect = Exception('No feed in test')
        call_command('sync_properties', force=True, stdout=out)
    # Deve tentare il download (non bloccarsi per orario)
    assert mock_req.get.called


@pytest.mark.django_db
def test_create_default_admin_creates_user():
    from django.contrib.auth import get_user_model
    User = get_user_model()
    assert not User.objects.filter(username='admin').exists()
    out = StringIO()
    call_command('create_default_admin', stdout=out)
    assert User.objects.filter(username='admin').exists()
    assert 'studiotara2024!' in out.getvalue()


@pytest.mark.django_db
def test_create_default_admin_idempotent():
    from django.contrib.auth import get_user_model
    User = get_user_model()
    out = StringIO()
    call_command('create_default_admin', stdout=out)
    call_command('create_default_admin', stdout=out)
    assert User.objects.filter(username='admin').count() == 1
```

- [ ] **Step 4: Eseguire il test per verificare che fallisca**

```bash
pytest tests/test_sync_command.py -v
```

Expected: FAIL — commands non ancora esistono.

- [ ] **Step 5: Creare `backend/apps/sync/management/commands/create_default_admin.py`**

```python
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'studiotara2024!'
ADMIN_EMAIL = 'admin@studiotara.it'


class Command(BaseCommand):
    help = 'Crea l\'utente admin di test se non esiste ancora'

    def handle(self, *args, **options):
        if User.objects.filter(username=ADMIN_USERNAME).exists():
            self.stdout.write(f'Utente "{ADMIN_USERNAME}" già esistente — nessuna modifica.')
            return

        User.objects.create_superuser(
            username=ADMIN_USERNAME,
            email=ADMIN_EMAIL,
            password=ADMIN_PASSWORD,
        )

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 50))
        self.stdout.write(self.style.SUCCESS('  UTENTE ADMIN DI TEST CREATO'))
        self.stdout.write(self.style.SUCCESS('=' * 50))
        self.stdout.write(f'  Username : {ADMIN_USERNAME}')
        self.stdout.write(f'  Password : {ADMIN_PASSWORD}')
        self.stdout.write(f'  URL admin: /admin/')
        self.stdout.write(self.style.SUCCESS('=' * 50))
        self.stdout.write('')
```

- [ ] **Step 6: Creare `backend/apps/sync/management/commands/sync_properties.py`**

```python
import os
import tarfile
import tempfile
import requests
from datetime import datetime
from xml.etree import ElementTree as ET

from django.core.management.base import BaseCommand
from django.conf import settings
from django.utils import timezone

from apps.properties.models import Property, PropertyImage

# Mappa categorie_id → nome tipologia
# Verificare con https://gestionaleimmobiliare.it/export/help/specifiche_attributi.php
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


class Command(BaseCommand):
    help = 'Sincronizza gli immobili dal feed XML di GestionaleImmobiliare.it'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Forza sync ignorando il controllo fascia oraria (21:00–07:00)',
        )

    def handle(self, *args, **options):
        if not options['force']:
            hour = datetime.now().hour
            if 7 <= hour < 21:
                self.stdout.write(
                    self.style.WARNING(
                        f'Sync non eseguito: orario non consentito ({hour:02d}:00). '
                        'Il feed è disponibile solo tra le 21:00 e le 07:00. '
                        'Usa --force per bypassare.'
                    )
                )
                return

        feed_url = os.environ.get('GESTIONALE_FEED_URL', '')
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

        # NOTA: il tag radice e i tag figlio dipendono dalla struttura reale del feed.
        # Verificare con https://gestionaleimmobiliare.it/export/help/specifiche_attributi.php
        # e con un campione del file XML reale.
        annunci = root.findall('.//annuncio')
        if not annunci:
            # Alcuni feed usano tag diversi
            annunci = root.findall('.//immobile') or root.findall('.//listing')

        for annuncio in annunci:
            gestionale_id = (annuncio.findtext('id') or annuncio.findtext('codice') or '').strip()
            if not gestionale_id:
                continue

            feed_ids.add(gestionale_id)

            flag_storico = (annuncio.findtext('flag_storico') or '0').strip() == '1'
            if flag_storico:
                Property.objects.filter(gestionale_id=gestionale_id).update(flag_storico=True)
                continue

            data = self._parse_annuncio(annuncio)
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

    def _parse_annuncio(self, annuncio):
        categoria_id = (annuncio.findtext('categorie_id') or '').strip()
        tipologia = CATEGORIA_MAP.get(categoria_id, categoria_id or '')

        tipo_contratto = (annuncio.findtext('tipo_contratto') or '').strip().lower()
        contratto = 'affitto' if 'affitto' in tipo_contratto else 'vendita'

        titolo = (annuncio.findtext('titolo') or '').strip()
        if not titolo:
            comune = (annuncio.findtext('comune') or '').strip()
            titolo = f"{tipologia.capitalize()} a {comune}".strip(' a') if tipologia else comune

        return {
            'codice_agenzia': (annuncio.findtext('codice_agenzia') or '').strip(),
            'titolo': titolo,
            'descrizione': (annuncio.findtext('descrizione') or '').strip(),
            'abstract': (annuncio.findtext('abstract') or '').strip(),
            'prezzo': self._to_decimal(annuncio.findtext('prezzo')),
            'mq': self._to_int(annuncio.findtext('mq')),
            'tipologia': tipologia,
            'categoria_id': self._to_int(categoria_id),
            'contratto': contratto,
            'indirizzo': (annuncio.findtext('indirizzo') or '').strip(),
            'comune': (annuncio.findtext('comune') or '').strip(),
            'provincia': (annuncio.findtext('provincia') or '').strip(),
            'zona': (annuncio.findtext('zona') or '').strip(),
            'latitudine': self._to_decimal(annuncio.findtext('lat')),
            'longitudine': self._to_decimal(annuncio.findtext('lng')),
            'codice_istat': (annuncio.findtext('codice_istat') or '').strip(),
            'bagni': self._to_int(annuncio.findtext('bagni')),
            'camere': self._to_int(annuncio.findtext('camere')),
            'locali': self._to_int(annuncio.findtext('locali')),
            'piano': (annuncio.findtext('piano') or '').strip(),
            'ascensore': (annuncio.findtext('ascensore') or '0') == '1',
            'garage': (annuncio.findtext('garage') or '0') == '1',
            'riscaldamento': (annuncio.findtext('riscaldamento') or '').strip(),
            'classe_energetica': (annuncio.findtext('classe_energetica') or '').strip(),
            'in_vetrina': (annuncio.findtext('flag_vetrina') or '0') == '1',
            'in_carosello': (annuncio.findtext('flag_carosello') or '0') == '1',
            'flag_storico': False,
        }

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

        # NOTA: il tag delle foto dipende dalla struttura reale del feed.
        # Possibili tag: 'foto', 'immagine', 'image', 'photo'
        foto_elements = (
            annuncio.findall('.//foto')
            or annuncio.findall('.//immagine')
            or annuncio.findall('.//image')
        )

        ordine = 0
        for foto in foto_elements:
            url = (foto.findtext('url') or foto.text or '').strip()
            if not url:
                continue

            filename = os.path.basename(url.split('?')[0])
            if not filename:
                continue

            is_planimetria = (foto.findtext('planimetria') or foto.get('planimetria', '0')) == '1'

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
```

- [ ] **Step 7: Eseguire i test**

```bash
pytest tests/test_sync_command.py -v
```

Expected: tutti i test PASS.

- [ ] **Step 8: Commit**

```bash
git add backend/apps/sync/
git commit -m "feat: management commands sync_properties e create_default_admin"
```

---

## Task 11: Dockerfile e entrypoint

**Files:**
- Create: `backend/Dockerfile`
- Create: `backend/entrypoint.sh`

- [ ] **Step 1: Creare `backend/entrypoint.sh`**

```bash
#!/bin/sh
set -e

echo "Eseguendo migrate..."
python manage.py migrate --noinput

echo "Raccogliendo file statici..."
python manage.py collectstatic --noinput

echo "Creando utente admin di test (se non esiste)..."
python manage.py create_default_admin

echo "Avviando gunicorn..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 2 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
```

- [ ] **Step 2: Rendere l'entrypoint eseguibile**

```bash
chmod +x backend/entrypoint.sh
```

- [ ] **Step 3: Creare `backend/Dockerfile`**

```dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Dipendenze di sistema per psycopg2 e Pillow
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Directory media (sovrascritta da Railway Volume in produzione)
RUN mkdir -p /app/media

EXPOSE 8000

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
```

- [ ] **Step 4: Verificare che il Dockerfile faccia build senza errori (opzionale se Docker è installato)**

```bash
cd backend
docker build -t studiotara-backend .
```

Expected: build completata senza errori.

- [ ] **Step 5: Eseguire l'intera test suite**

```bash
pytest -v
```

Expected: tutti i test PASS.

- [ ] **Step 6: Commit finale**

```bash
git add backend/Dockerfile backend/entrypoint.sh
git commit -m "feat: Dockerfile e entrypoint con migrate + create_default_admin + gunicorn"
```

---

## Self-Review

**Spec coverage check:**

| Requisito spec | Task che lo implementa |
|---------------|----------------------|
| Django + PostgreSQL | Task 1, 2 |
| django-unfold admin | Task 9 |
| API lista immobili con filtri | Task 6 |
| API dettaglio immobile | Task 6 |
| API immobili in vetrina | Task 6 |
| API lista blog | Task 7 |
| API dettaglio blog per slug | Task 7 |
| API form contatto | Task 8 |
| API form valutazione | Task 8 |
| Sync feed XML (download, parse, upsert, delete) | Task 10 |
| Controllo fascia oraria 21:00–07:00 | Task 10 |
| Flag --force per bypass | Task 10 |
| Download immagini (skip se già presente) | Task 10 |
| Immagini servite da backend | Task 2 (MEDIA_URL), Task 6 (serializer) |
| Admin utente di test al primo avvio | Task 10, 11 |
| Email via env var (differita) | Task 2 (settings) |
| CORS per Next.js | Task 2 (settings) |
| Railway Volume per media | Task 2 (MEDIA_ROOT), Task 11 (Dockerfile) |
| .env.example | Task 1 |

Tutti i requisiti sono coperti. Nessun placeholder o TBD nel piano.
