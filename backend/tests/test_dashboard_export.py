import hashlib
import json
from io import BytesIO
from pathlib import Path
from unittest.mock import patch

import pytest
from PIL import Image
from django.contrib.admin import site
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import RequestFactory
from rest_framework.test import APIClient

from apps.properties.admin import PropertyAdmin
from apps.properties.models import Property, PropertyImage


@pytest.fixture
def properties(db, settings, tmp_path):
    settings.MEDIA_ROOT = str(tmp_path / "source-media")
    active = Property.objects.create(gestionale_id="source-1", codice_agenzia="AL0001R", titolo="Appartamento", descrizione="Descrizione", contratto="vendita", tipologia="appartamento", comune="Milano", indirizzo="Via Prova", provincia="MI", prezzo="150000.00")
    archived = Property.objects.create(gestionale_id="source-2", titolo="Archivio", flag_storico=True, contratto="affitto")
    buffer = BytesIO()
    Image.new("RGB", (2, 2), "white").save(buffer, format="PNG")
    for order, plan in [(2, False), (1, False), (3, True)]:
        PropertyImage.objects.create(property=active, file=SimpleUploadedFile(f"{order}.png", buffer.getvalue(), content_type="image/png"), filename=f"{order}.png", ordine=order, is_planimetria=plan)
    return active, archived


@pytest.mark.django_db
def test_export_includes_archived_properties_and_verified_ordered_media(properties, tmp_path):
    active, archived = properties
    before = active.data_aggiornamento
    destination = tmp_path / "bundle"
    call_command("export_dashboard", output=str(destination))
    manifest = json.loads((destination / "manifest.json").read_text())
    assert manifest["complete"] is True
    assert manifest["total_properties"] == 2
    assert manifest["total_images"] == 3
    assert manifest["properties"][1]["fields"]["flag_storico"] is True
    exported = manifest["properties"][0]
    assert exported["id"] == active.pk
    assert exported["fields"]["prezzo"] == "150000.00"
    assert [i["fields"]["ordine"] for i in exported["images"]] == [1, 2, 3]
    assert exported["images"][2]["fields"]["is_planimetria"] is True
    for media in exported["images"]:
        content = (destination / media["path"]).read_bytes()
        assert len(content) == media["bytes"]
        assert hashlib.sha256(content).hexdigest() == media["sha256"]
    active.refresh_from_db()
    assert active.data_aggiornamento == before
    assert Property.objects.count() == 2


@pytest.mark.django_db
def test_missing_media_makes_export_explicitly_incomplete(properties, tmp_path):
    image = PropertyImage.objects.first()
    Path(image.file.path).unlink()
    destination = tmp_path / "incomplete"
    with pytest.raises(CommandError, match="incompleto"):
        call_command("export_dashboard", output=str(destination))
    manifest = json.loads((destination / "manifest.json").read_text())
    assert manifest["complete"] is False
    assert len(manifest["errors"]) == 1
    assert manifest["errors"][0]["image_id"] == image.pk


def test_export_never_overwrites_an_existing_directory(tmp_path):
    with pytest.raises(CommandError, match="esiste"):
        call_command("export_dashboard", output=str(tmp_path))


def test_cutover_stops_sync_even_when_forced(settings):
    settings.PROPERTY_SYNC_ENABLED = False
    with patch("apps.sync.views.subprocess.Popen") as spawn:
        assert APIClient().post("/api/sync/run/").status_code == 410
        spawn.assert_not_called()
    with pytest.raises(CommandError, match="disabled"):
        call_command("sync_properties", force=True)


def test_cutover_disables_old_admin_property_writes(settings):
    settings.PROPERTY_ADMIN_READ_ONLY = True
    admin = PropertyAdmin(Property, site)
    request = RequestFactory().get("/admin/properties/property/")
    assert not admin.has_add_permission(request)
    assert not admin.has_change_permission(request)
    assert not admin.has_delete_permission(request)
