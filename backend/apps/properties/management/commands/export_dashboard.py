"""Export every property and its original media for the new dashboard.

Run against the production backend only after pausing property edits and sync.
The source database/media are read only. Never use the filtered public API as
an all-properties export: it intentionally hides historic records.
"""
import hashlib
import json
from pathlib import Path

from django.conf import settings
from django.core import serializers
from django.core.management.base import BaseCommand, CommandError
from django.db import connection, transaction
from django.utils import timezone
from PIL import Image

from apps.properties.models import Property, PropertyImage


class Command(BaseCommand):
    help = "Esporta tutti gli immobili (inclusi storici) e media con checksum SHA-256."

    def add_arguments(self, parser):
        parser.add_argument("--output", required=True, help="Nuova directory di destinazione")

    def handle(self, *args, **options):
        output = Path(options["output"]).resolve()
        if output.exists():
            raise CommandError("La destinazione esiste già: usa una nuova directory.")
        output.mkdir(parents=True)
        with transaction.atomic():
            if connection.vendor == "postgresql":
                with connection.cursor() as cursor:
                    cursor.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY")
            properties = json.loads(serializers.serialize("json", Property.objects.order_by("pk")))
            images = list(PropertyImage.objects.select_related("property").order_by("property_id", "ordine", "pk"))
        by_property = {p["pk"]: {"id": p["pk"], "fields": p["fields"], "images": []} for p in properties}
        errors = []
        media_root = Path(settings.MEDIA_ROOT).resolve()
        for image in images:
            record = {
                "id": image.pk,
                "fields": {"file": image.file.name, "filename": image.filename,
                           "is_planimetria": image.is_planimetria, "ordine": image.ordine},
            }
            try:
                source = (media_root / image.file.name).resolve()
                if not source.is_relative_to(media_root) or not source.is_file():
                    raise ValueError("File mancante o percorso media non valido")
                with Image.open(source) as original:
                    content_type = Image.MIME.get(original.format)
                extension = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif"}.get(content_type)
                if not extension:
                    raise ValueError("Formato immagine non supportato")
                relative = Path("media") / str(image.property_id) / f"{image.pk}{extension}"
                target = output / relative
                target.parent.mkdir(parents=True, exist_ok=True)
                digest = hashlib.sha256()
                size = 0
                with source.open("rb") as src, target.open("wb") as dst:
                    for chunk in iter(lambda: src.read(1024 * 1024), b""):
                        digest.update(chunk)
                        dst.write(chunk)
                        size += len(chunk)
                if not size:
                    raise ValueError("File vuoto")
                record.update(path=relative.as_posix(), content_type=content_type, bytes=size, sha256=digest.hexdigest())
            except (OSError, ValueError) as error:
                record["error"] = str(error)
                errors.append({"property_id": image.property_id, "image_id": image.pk, "error": str(error)})
            by_property[image.property_id]["images"].append(record)
        manifest = {
            "schema_version": 1, "source": "studiotara-django", "complete": not errors,
            "exported_at": timezone.now().isoformat(), "total_properties": len(properties),
            "total_images": len(images), "properties": list(by_property.values()), "errors": errors,
        }
        (output / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
        if errors:
            raise CommandError(f"Export incompleto: {len(errors)} media non leggibili. Consulta manifest.json; il nuovo dashboard rifiuterà questo export.")
        self.stdout.write(self.style.SUCCESS(f"Esportati {len(properties)} immobili e {len(images)} media in {output}."))
