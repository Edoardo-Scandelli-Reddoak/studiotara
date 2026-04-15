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
