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

    fieldsets = (
        (None, {
            'fields': ('titolo', 'slug', 'pubblicato', 'data_pubblicazione'),
        }),
        ('Immagini', {
            'fields': ('immagine_card', 'immagine'),
            'description': (
                'Carica due immagini distinte: la <strong>card</strong> (miniatura '
                'mostrata nella lista del blog) e la <strong>copertina</strong> '
                '(banner della pagina articolo). Se la card è vuota, viene usata '
                'la copertina anche nella lista.'
            ),
        }),
        ('Contenuto', {
            'fields': ('contenuto',),
            'description': (
                'Usa la barra strumenti per formattare paragrafi, grassetto, '
                'titoli, elenchi e link. Premi Invio per andare a capo: '
                'crea un nuovo paragrafo automaticamente.'
            ),
        }),
    )
