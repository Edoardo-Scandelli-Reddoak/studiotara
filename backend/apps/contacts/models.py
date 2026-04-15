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
