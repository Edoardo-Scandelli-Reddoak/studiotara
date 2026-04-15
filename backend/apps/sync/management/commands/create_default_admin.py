from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'Tara2024!'
ADMIN_EMAIL = 'admin@studiotara.it'


class Command(BaseCommand):
    help = 'Crea l\'utente admin di test se non esiste ancora'

    def handle(self, *args, **options):
        if User.objects.filter(username=ADMIN_USERNAME).exists():
            self.stdout.write(f'Utente "{ADMIN_USERNAME}" già esistente — nessuna modifica.')
            return

        User.objects.create_superuser(
            username=ADMIN_USERNAME,
            email=ADMIN_EMAIL,
            password=ADMIN_PASSWORD,
        )

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 50))
        self.stdout.write(self.style.SUCCESS('  UTENTE ADMIN DI TEST CREATO'))
        self.stdout.write(self.style.SUCCESS('=' * 50))
        self.stdout.write(f'  Username : {ADMIN_USERNAME}')
        self.stdout.write(f'  Password : {ADMIN_PASSWORD}')
        self.stdout.write(f'  URL admin: /admin/')
        self.stdout.write(self.style.SUCCESS('=' * 50))
        self.stdout.write('')
