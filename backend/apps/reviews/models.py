from django.db import models


class GoogleReview(models.Model):
    google_review_id = models.CharField(max_length=255, unique=True)
    author_name = models.CharField(max_length=255)
    profile_photo_url = models.URLField(blank=True)
    rating = models.IntegerField()
    text = models.TextField(blank=True)
    time = models.DateTimeField(help_text='Data della recensione')
    language = models.CharField(max_length=10, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Recensione Google'
        verbose_name_plural = 'Recensioni Google'
        ordering = ['-time']

    def __str__(self):
        return f'{self.author_name} — {self.rating}★'
