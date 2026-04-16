from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Article


@admin.register(Article)
class ArticleAdmin(ModelAdmin):
    list_display = ['titolo', 'pubblicato', 'data_pubblicazione', 'data_creazione']
    list_filter = ['pubblicato']
    search_fields = ['titolo', 'contenuto']
    exclude = ['excerpt']
    prepopulated_fields = {'slug': ('titolo',)}
    list_editable = ['pubblicato']
    date_hierarchy = 'data_pubblicazione'
