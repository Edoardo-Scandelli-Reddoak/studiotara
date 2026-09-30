import hashlib
import json
from decimal import Decimal
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
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient

from apps.properties.admin import PropertyAdmin, PropertyPhotoInline, PropertyPlanimetriaInline
from apps.properties.models import Property, PropertyImage
from apps.sync.management.commands.sync_properties import Command as SyncCommand


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


@pytest.mark.django_db(transaction=True)
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


@pytest.mark.django_db(transaction=True)
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


@pytest.mark.django_db(transaction=True)
def test_export_preserves_every_property_field_including_zero_and_null(properties, tmp_path):
    active, archived = properties
    expected = {
        "gestionale_id": "source-1", "codice_agenzia": "AL0001R",
        "titolo": "Appartamento", "descrizione": "Descrizione", "abstract": "Testo breve",
        "prezzo": "0.00", "mq": 0, "tipologia": "appartamento", "categoria_id": 1,
        "contratto": "vendita", "indirizzo": "Via Prova", "comune": "Milano",
        "provincia": "MI", "zona": "Centro", "latitudine": "0.0000000",
        "longitudine": None, "codice_istat": "015146", "bagni": 0, "camere": None,
        "locali": 4, "piano": "0", "ascensore": True, "garage": False,
        "riscaldamento": "Autonomo", "classe_energetica": "A4",
        "video_url": "https://www.youtube.com/embed/example", "visualizzazioni": 0,
        "in_vetrina": True, "in_carosello": True, "flag_storico": False,
    }
    sync_at = timezone.now().replace(microsecond=0)
    Property.objects.filter(pk=active.pk).update(**expected, ultimo_sync=sync_at)
    destination = tmp_path / "all-fields"
    call_command("export_dashboard", output=str(destination))
    manifest = json.loads((destination / "manifest.json").read_text())
    fields = manifest["properties"][0]["fields"]
    assert fields.keys() == {
        field.name for field in Property._meta.concrete_fields if not field.primary_key
    }
    for key, value in expected.items():
        if key == "latitudine":
            assert Decimal(fields[key]) == Decimal(value)
        else:
            assert fields[key] == value, key
    assert fields["ultimo_sync"] == sync_at.isoformat().replace("+00:00", "Z")
    assert fields["data_creazione"] and fields["data_aggiornamento"]
    archived_fields = manifest["properties"][1]["fields"]
    assert archived_fields["flag_storico"] is True
    assert archived_fields["prezzo"] is None
    assert archived_fields["ultimo_sync"] is None
    assert manifest["properties"][1]["images"] == []
    for media in manifest["properties"][0]["images"]:
        assert media["fields"].keys() == {"file", "filename", "is_planimetria", "ordine"}
        original = PropertyImage.objects.get(pk=media["id"])
        assert media["fields"]["file"] == original.file.name
        assert media["fields"]["filename"] == original.filename
    # Original media and source snapshots must not be world-readable by default.
    assert destination.stat().st_mode & 0o077 == 0


@pytest.mark.django_db(transaction=True)
@pytest.mark.parametrize("damage", ["empty", "not-an-image", "png-checksum", "truncated-jpeg"])
def test_corrupt_media_cannot_produce_a_complete_export(properties, tmp_path, damage):
    image = PropertyImage.objects.first()
    source = Path(image.file.path)
    if damage == "empty":
        content = b""
    elif damage == "not-an-image":
        content = b"this is not an image"
    elif damage == "png-checksum":
        content = bytearray(source.read_bytes())
        content[content.index(b"IDAT") + 5] ^= 1
    else:
        buffer = BytesIO()
        Image.new("RGB", (10, 10), "white").save(buffer, format="JPEG")
        content = buffer.getvalue()[:-2]
    source.write_bytes(content)
    if damage in {"png-checksum", "truncated-jpeg"}:
        # A valid header was enough to pass the old exporter.
        with Image.open(source) as header_only:
            assert header_only.format
    destination = tmp_path / "corrupt"
    with pytest.raises(CommandError, match="incompleto"):
        call_command("export_dashboard", output=str(destination))
    manifest = json.loads((destination / "manifest.json").read_text())
    assert manifest["complete"] is False
    assert len(manifest["errors"]) == 1
    assert manifest["errors"][0]["image_id"] == image.pk
    record = next(record for record in manifest["properties"][0]["images"] if record["id"] == image.pk)
    assert "error" in record
    assert "sha256" not in record


@pytest.mark.django_db(transaction=True)
def test_export_rejects_media_symlinks_outside_media_root(properties, tmp_path):
    image = PropertyImage.objects.first()
    source = Path(image.file.path)
    outside = tmp_path / "private-source.png"
    outside.write_bytes(source.read_bytes())
    source.unlink()
    source.symlink_to(outside)
    destination = tmp_path / "outside-media"
    with pytest.raises(CommandError, match="incompleto"):
        call_command("export_dashboard", output=str(destination))
    manifest = json.loads((destination / "manifest.json").read_text())
    assert manifest["complete"] is False
    assert manifest["errors"][0]["image_id"] == image.pk


@pytest.mark.django_db
def test_admin_write_permissions_still_require_django_permissions(settings, django_user_model):
    settings.PROPERTY_ADMIN_READ_ONLY = False
    user = django_user_model.objects.create_user(username="no-permissions", is_staff=True)
    request = RequestFactory().get("/admin/properties/property/")
    request.user = user
    model_admin = PropertyAdmin(Property, site)
    assert not model_admin.has_add_permission(request)
    assert not model_admin.has_change_permission(request)
    assert not model_admin.has_delete_permission(request)
    for inline_class in (PropertyPhotoInline, PropertyPlanimetriaInline):
        inline = inline_class(Property, site)
        assert not inline.has_add_permission(request, None)
        assert not inline.has_change_permission(request)
        assert not inline.has_delete_permission(request)


@pytest.mark.django_db
def test_authorized_admin_remains_writable_before_cutover(settings, admin_user):
    settings.PROPERTY_ADMIN_READ_ONLY = False
    request = RequestFactory().get("/admin/properties/property/")
    request.user = admin_user
    model_admin = PropertyAdmin(Property, site)
    assert model_admin.has_add_permission(request)
    assert model_admin.has_change_permission(request)
    assert model_admin.has_delete_permission(request)
    for inline_class in (PropertyPhotoInline, PropertyPlanimetriaInline):
        inline = inline_class(Property, site)
        assert inline.has_add_permission(request, None)
        assert inline.has_change_permission(request)
        assert inline.has_delete_permission(request)


@pytest.mark.django_db
def test_read_only_archive_remains_viewable_without_media_edit_controls(properties, settings, admin_client):
    settings.PROPERTY_ADMIN_READ_ONLY = True
    settings.STORAGES = {
        "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
        "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
    }
    active, _ = properties
    response = admin_client.get(reverse("admin:properties_property_change", args=[active.pk]))
    assert response.status_code == 200
    assert response.context["has_view_permission"] is True
    assert response.context["has_change_permission"] is False
    request = response.wsgi_request
    for inline_class in (PropertyPhotoInline, PropertyPlanimetriaInline):
        inline = inline_class(Property, site)
        assert not inline.has_add_permission(request, active)
        assert not inline.has_change_permission(request, active)
        assert not inline.has_delete_permission(request, active)
    for formset in response.context["inline_admin_formsets"]:
        assert not formset.has_add_permission
        assert not formset.has_change_permission
        assert not formset.has_delete_permission


@pytest.mark.django_db
@pytest.mark.parametrize("operation", ["add", "change", "delete", "inline-add", "inline-change", "inline-delete", "bulk-delete"])
def test_cutover_rejects_property_and_inline_http_writes(properties, settings, admin_client, operation):
    settings.PROPERTY_ADMIN_READ_ONLY = True
    settings.STORAGES = {
        "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
        "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
    }
    active, _ = properties
    before_properties = list(Property.objects.order_by("pk").values())
    before_images = list(PropertyImage.objects.order_by("pk").values())
    image = active.images.first()
    media_before = Path(image.file.path).read_bytes()
    if operation == "add":
        url = reverse("admin:properties_property_add")
        payload = {"titolo": "Unexpected new listing", "tipologia": "appartamento"}
    elif operation == "delete":
        url = reverse("admin:properties_property_delete", args=[active.pk])
        payload = {"post": "yes"}
    elif operation == "bulk-delete":
        url = reverse("admin:properties_property_changelist")
        payload = {"action": "delete_selected", "_selected_action": [active.pk], "post": "yes"}
    else:
        url = reverse("admin:properties_property_change", args=[active.pk])
        payload = {"titolo": "Unexpected edit", "tipologia": "appartamento", "_save": "Save"}
        if operation.startswith("inline-"):
            payload.update({
                "images-TOTAL_FORMS": "1", "images-INITIAL_FORMS": "1",
                "images-0-id": str(image.pk), "images-0-property": str(active.pk),
                "images-0-ordine": "99",
            })
            if operation == "inline-delete":
                payload["images-0-DELETE"] = "on"
            elif operation == "inline-add":
                payload["images-INITIAL_FORMS"] = "0"
                payload.pop("images-0-id")
                payload["images-0-file"] = SimpleUploadedFile("new.png", media_before, content_type="image/png")
    response = admin_client.post(url, payload)
    if operation == "bulk-delete":
        # Django ignores an action that has been removed by permissions.
        assert response.status_code == 200
        assert "delete_selected" not in PropertyAdmin(Property, site).get_actions(response.wsgi_request)
    else:
        assert response.status_code == 403
    assert list(Property.objects.order_by("pk").values()) == before_properties
    assert list(PropertyImage.objects.order_by("pk").values()) == before_images
    assert Path(image.file.path).read_bytes() == media_before


def test_disabled_sync_rejects_direct_processing_without_reading_a_feed(settings):
    settings.PROPERTY_SYNC_ENABLED = False
    with patch("apps.sync.management.commands.sync_properties.ET.parse") as parse:
        with pytest.raises(CommandError, match="disabled"):
            SyncCommand()._process_xml("unused-feed.xml")
        parse.assert_not_called()
