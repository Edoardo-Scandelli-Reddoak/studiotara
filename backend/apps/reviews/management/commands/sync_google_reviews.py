"""
Sincronizza le recensioni Google di Studio Tara usando la Places API (New).
Usa: python manage.py sync_google_reviews
"""
import hashlib
from datetime import datetime, timezone

import requests
from django.conf import settings
from django.core.management.base import BaseCommand

from apps.reviews.models import GoogleReview

# Place ID di Studio Tara (Buccinasco)
PLACE_ID = getattr(settings, 'GOOGLE_PLACE_ID', 'ChIJq6qqKJDBhkcRGxNlFl_DyQE')


class Command(BaseCommand):
    help = 'Sincronizza le recensioni Google da Places API (New)'

    def handle(self, *args, **options):
        api_key = getattr(settings, 'GOOGLE_PLACES_API_KEY', '') or ''
        if not api_key:
            self.stderr.write(self.style.ERROR(
                'GOOGLE_PLACES_API_KEY non configurata. '
                'Imposta la variabile d\'ambiente GOOGLE_PLACES_API_KEY.'
            ))
            return

        self.stdout.write(f'Recupero recensioni per Place ID: {PLACE_ID}')

        url = f'https://places.googleapis.com/v1/places/{PLACE_ID}'
        headers = {
            'X-Goog-Api-Key': api_key,
            'X-Goog-FieldMask': 'reviews',
        }

        resp = requests.get(url, headers=headers, timeout=15)
        if resp.status_code != 200:
            self.stderr.write(self.style.ERROR(
                f'Errore API Google: {resp.status_code} — {resp.text[:300]}'
            ))
            return

        data = resp.json()
        reviews = data.get('reviews', [])
        self.stdout.write(f'Trovate {len(reviews)} recensioni dalla API')

        created = 0
        for r in reviews:
            rating = r.get('rating', 0)
            text = ''
            if r.get('text') and r['text'].get('text'):
                text = r['text']['text']
            author = r.get('authorAttribution', {})
            author_name = author.get('displayName', 'Anonimo')
            photo_url = author.get('photoUri', '')
            publish_time = r.get('publishTime', '')
            language = ''
            if r.get('text') and r['text'].get('languageCode'):
                language = r['text']['languageCode']

            # Crea un ID stabile dalla recensione
            review_id = hashlib.sha256(
                f'{author_name}:{publish_time}:{rating}'.encode()
            ).hexdigest()[:64]

            # Parse publish time (ISO 8601)
            try:
                dt = datetime.fromisoformat(publish_time.replace('Z', '+00:00'))
            except (ValueError, AttributeError):
                dt = datetime.now(timezone.utc)

            _, was_created = GoogleReview.objects.update_or_create(
                google_review_id=review_id,
                defaults={
                    'author_name': author_name,
                    'profile_photo_url': photo_url,
                    'rating': rating,
                    'text': text,
                    'time': dt,
                    'language': language,
                },
            )
            if was_created:
                created += 1

        total = GoogleReview.objects.count()
        self.stdout.write(self.style.SUCCESS(
            f'Sync completato: {created} nuove, {total} totali in database'
        ))
