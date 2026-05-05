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
    readonly_fields = [
        'gestionale_id', 'codice_agenzia', 'titolo', 'descrizione', 'abstract',
        'prezzo', 'mq', 'tipologia', 'categoria_id', 'contratto',
        'indirizzo', 'comune', 'provincia', 'zona', 'latitudine', 'longitudine', 'codice_istat',
        'bagni', 'camere', 'locali', 'piano', 'ascensore', 'garage', 'riscaldamento', 'classe_energetica',
        'in_vetrina', 'in_carosello', 'flag_storico',
        'data_creazione', 'data_aggiornamento', 'ultimo_sync',
        'visualizzazioni',
    ]
    inlines = [PropertyImageInline]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return True

    def has_delete_permission(self, request, obj=None):
        return False
