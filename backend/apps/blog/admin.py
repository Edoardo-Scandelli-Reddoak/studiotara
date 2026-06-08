from django import forms
from django.contrib import admin
from tinymce.widgets import TinyMCE
from unfold.admin import ModelAdmin

from .models import Article


class ArticleAdminForm(forms.ModelForm):
    """Forces the TinyMCE widget on `contenuto`.

    django-unfold's ModelAdmin overrides the widget for every TextField with
    its own WYSIWYG, which beats both django-tinymce's HTMLField default and
    the model-level widget. Declaring the widget on the ModelForm wins.
    """

    class Meta:
        model = Article
        fields = "__all__"
        widgets = {
            "contenuto": TinyMCE(),
        }


@admin.register(Article)
class ArticleAdmin(ModelAdmin):
    form = ArticleAdminForm
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
