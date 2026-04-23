from django.db import models
from django.utils.text import slugify


class Article(models.Model):
    titolo = models.CharField(max_length=255, verbose_name='Titolo')
    slug = models.SlugField(max_length=255, unique=True, blank=True, verbose_name='Slug URL')
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
