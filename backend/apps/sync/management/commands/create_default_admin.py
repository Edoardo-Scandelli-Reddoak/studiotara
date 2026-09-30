import os

from django.conf import settings
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = "Crea un admin solo con credenziali bootstrap esplicitamente configurate."

    def handle(self, *args, **options):
        if settings.PROPERTY_ARCHIVE_PRIVATE:
            self.stdout.write("Bootstrap admin disabilitato per l'archivio privato.")
            return

        username = os.environ.get("DEFAULT_ADMIN_USERNAME", "").strip()
        password = os.environ.get("DEFAULT_ADMIN_PASSWORD", "")
        if not username or not password.strip():
            self.stdout.write("Credenziali bootstrap admin non configurate — nessuna modifica.")
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write("Utente bootstrap già esistente — nessuna modifica.")
            return

        User.objects.create_superuser(
            username=username,
            email=os.environ.get("DEFAULT_ADMIN_EMAIL", "").strip(),
            password=password,
        )
        self.stdout.write(self.style.SUCCESS("Utente bootstrap admin creato."))
