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

    # Media
    video_url = models.URLField(blank=True, verbose_name='URL Video (YouTube embed)')

    # Statistiche
    visualizzazioni = models.PositiveIntegerField(default=0, verbose_name='Visualizzazioni')

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
