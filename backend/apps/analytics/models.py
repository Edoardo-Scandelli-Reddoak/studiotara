from django.db import models


class PageView(models.Model):
    """One row per page view from the public site."""

    path = models.CharField(max_length=500, db_index=True, verbose_name='Percorso')
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True, verbose_name='Data e ora')

    class Meta:
        verbose_name = 'Visita pagina'
        verbose_name_plural = 'Dashboard'
        ordering = ['-timestamp']

    def __str__(self):
        return f'{self.path} @ {self.timestamp:%Y-%m-%d %H:%M}'
