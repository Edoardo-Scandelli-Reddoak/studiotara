from datetime import datetime

from django import forms
from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline

from .models import Property, PropertyImage


# Mirror of CATEGORIA_MAP in apps/sync/management/commands/sync_properties.py
# Used so manually-created properties get a consistent categoria_id that the
# residential/commercial frontend filter can rely on.
TIPOLOGIA_CHOICES = [
    ("appartamento", "Appartamento"),
    ("monolocale", "Monolocale"),
    ("bilocale", "Bilocale"),
    ("trilocale", "Trilocale"),
    ("quadrilocale", "Quadrilocale"),
    ("multilocale", "Multilocale"),
    ("villa", "Villa"),
    ("villetta", "Villetta"),
    ("attico", "Attico"),
    ("casale", "Casale"),
    ("rustico", "Rustico"),
    ("negozio", "Negozio"),
    ("ufficio", "Ufficio"),
    ("capannone", "Capannone"),
    ("box/garage", "Box/Garage"),
    ("terreno", "Terreno"),
]

TIPOLOGIA_TO_CATEGORIA_ID = {
    "appartamento": 1, "villa": 2, "villetta": 3, "attico": 4,
    "box/garage": 5, "negozio": 6, "ufficio": 7, "capannone": 8,
    "terreno": 9, "rustico": 10, "monolocale": 12, "bilocale": 13,
    "trilocale": 14, "quadrilocale": 15, "multilocale": 16, "casale": 20,
}


class PropertyAdminForm(forms.ModelForm):
    tipologia = forms.ChoiceField(
        choices=TIPOLOGIA_CHOICES,
        required=True,
        label="Tipologia",
    )

    class Meta:
        model = Property
        # All fields handled via fieldsets in the ModelAdmin
        fields = "__all__"


class _PropertyImageForm(forms.ModelForm):
    """Auto-fills filename from the uploaded file and the is_planimetria flag."""

    _is_planimetria_value = False

    class Meta:
        model = PropertyImage
        fields = ["file", "ordine"]

    def save(self, commit=True):
        obj = super().save(commit=False)
        obj.is_planimetria = self._is_planimetria_value
        if obj.file and not obj.filename:
            obj.filename = obj.file.name.split("/")[-1][:255]
        if commit:
            obj.save()
        return obj


class PropertyPhotoForm(_PropertyImageForm):
    _is_planimetria_value = False


class PropertyPlanimetriaForm(_PropertyImageForm):
    _is_planimetria_value = True


class PropertyPhotoInline(TabularInline):
    model = PropertyImage
    form = PropertyPhotoForm
    fields = ["file", "ordine"]
    extra = 1
    verbose_name = "Foto"
    verbose_name_plural = "Foto immobile"

    def get_queryset(self, request):
        return super().get_queryset(request).filter(is_planimetria=False)


class PropertyPlanimetriaInline(TabularInline):
    model = PropertyImage
    form = PropertyPlanimetriaForm
    fields = ["file", "ordine"]
    extra = 1
    verbose_name = "Planimetria"
    verbose_name_plural = "Planimetria"

    def get_queryset(self, request):
        return super().get_queryset(request).filter(is_planimetria=True)


# Fields the admin user fills in when creating a property manually.
ADD_FIELDSETS = (
    ("Informazioni principali", {
        "fields": ("titolo", "tipologia", "contratto", "prezzo", "mq",
                   "abstract", "descrizione"),
    }),
    ("Localizzazione", {
        "fields": ("indirizzo", "comune", "provincia", "zona"),
        "description": "L'indirizzo viene passato a Google Maps direttamente sul "
                       "sito (geocoding lato client, nessuna API key necessaria).",
    }),
    ("Caratteristiche", {
        "fields": ("locali", "camere", "bagni", "piano",
                   "ascensore", "garage", "riscaldamento", "classe_energetica"),
    }),
    ("Video YouTube", {
        "fields": ("video_url",),
        "description": "Opzionale. Incolla l'URL embed del video YouTube.",
    }),
)


@admin.register(Property)
class PropertyAdmin(ModelAdmin):
    form = PropertyAdminForm
    # The model still carries `in_vetrina` and `in_carosello` for future use,
    # but the public site does not surface them anywhere — hide them in admin.
    exclude = ["in_vetrina", "in_carosello"]
    list_display = [
        "titolo", "comune", "tipologia", "contratto",
        "prezzo", "mq", "flag_storico",
    ]
    list_filter = ["tipologia", "contratto", "flag_storico", "provincia"]
    search_fields = ["titolo", "comune", "codice_agenzia", "gestionale_id"]

    # Read-only fields when viewing an existing record (especially gestionale-synced).
    # For new records (add), we don't restrict any field — see get_readonly_fields.
    _READONLY_WHEN_SYNCED = [
        "gestionale_id", "codice_agenzia", "titolo", "descrizione", "abstract",
        "prezzo", "mq", "tipologia", "categoria_id", "contratto",
        "indirizzo", "comune", "provincia", "zona", "latitudine", "longitudine",
        "codice_istat", "bagni", "camere", "locali", "piano",
        "ascensore", "garage", "riscaldamento", "classe_energetica",
        "data_creazione", "data_aggiornamento", "ultimo_sync", "visualizzazioni",
    ]

    def get_inlines(self, request, obj):
        return [PropertyPhotoInline, PropertyPlanimetriaInline]

    def get_fieldsets(self, request, obj=None):
        if obj is None:
            # Creazione manuale: form pulito senza ID gestionale, categoria_id,
            # lat/lng, ecc.
            return ADD_FIELDSETS
        # Visualizzazione record esistente: mostra tutto in un fieldset piatto.
        return super().get_fieldsets(request, obj)

    def get_readonly_fields(self, request, obj=None):
        if obj is None:
            # Creating a new property — everything editable.
            return []
        if obj.ultimo_sync:
            # Imported from the gestionale feed — lock most fields, allow editing
            # only the visibility/storico flags.
            return self._READONLY_WHEN_SYNCED
        # Manually-created property — allow editing everything except auto fields.
        return ["gestionale_id", "categoria_id", "latitudine", "longitudine",
                "data_creazione", "data_aggiornamento", "ultimo_sync", "visualizzazioni"]

    def has_add_permission(self, request):
        return True

    def has_change_permission(self, request, obj=None):
        return True

    def has_delete_permission(self, request, obj=None):
        # Only allow deleting properties NOT coming from the gestionale feed.
        if obj is None:
            return True
        return obj.ultimo_sync is None

    def save_model(self, request, obj, form, change):
        # Auto-generate a unique gestionale_id for manually-created records.
        if not obj.gestionale_id:
            obj.gestionale_id = f"MANUAL-{datetime.now().strftime('%Y%m%d%H%M%S')}"

        # Keep categoria_id consistent with tipologia so the residential filter
        # on the frontend classifies correctly.
        if obj.tipologia and not obj.categoria_id:
            cat = TIPOLOGIA_TO_CATEGORIA_ID.get(obj.tipologia.lower())
            if cat is not None:
                obj.categoria_id = cat

        # Latitude/longitude are intentionally left as-is: the public site
        # falls back to the address as the Google Maps embed query string when
        # they are null, so we don't need a server-side geocoding step.

        super().save_model(request, obj, form, change)
