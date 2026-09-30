from pathlib import Path

import pytest
from django.contrib.auth.models import Permission
from django.urls import reverse

from apps.properties.models import Property


@pytest.fixture
def private_archive(db, settings, tmp_path):
    settings.PROPERTY_ARCHIVE_PRIVATE = True
    settings.MEDIA_ROOT = str(tmp_path / "media")
    property_obj = Property.objects.create(
        gestionale_id="ARCHIVE", titolo="Private original", in_vetrina=True,
        descrizione="An original description with an owner's name", visualizzazioni=12,
    )
    root = Path(settings.MEDIA_ROOT)
    for name, content in [
        ("properties/ARCHIVE/photo.png", b"original photo"),
        ("properties/ARCHIVE/floor-plan.png", b"original floor plan"),
        ("blog/article.png", b"public blog image"),
        ("reviews/avatar.png", b"public review image"),
    ]:
        path = root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)
    return property_obj


def sign_in(client, django_user_model, role):
    if role == "anonymous":
        return
    user = django_user_model.objects.create_user(
        username=role,
        is_staff=role in {"staff-without-permission", "staff", "superuser"},
        is_superuser=role == "superuser",
    )
    if role in {"staff", "nonstaff-with-permission"}:
        user.user_permissions.add(Permission.objects.get(codename="view_property"))
    client.force_login(user)


@pytest.mark.django_db
@pytest.mark.parametrize("role", ["anonymous", "nonstaff-with-permission", "staff-without-permission", "staff", "superuser"])
@pytest.mark.parametrize("endpoint", ["list", "detail", "featured", "photo", "floor-plan"])
def test_original_property_data_and_media_require_authorized_staff(private_archive, client, django_user_model, role, endpoint):
    sign_in(client, django_user_model, role)
    if endpoint in {"photo", "floor-plan"}:
        url = f"/media/properties/ARCHIVE/{endpoint}.png"
    else:
        url = reverse(f"properties:{endpoint}", kwargs={"pk": private_archive.pk} if endpoint == "detail" else None)
    response = client.get(url)
    authorized = role in {"staff", "superuser"}
    assert response.status_code == (200 if authorized else 403)
    assert "private" in response["Cache-Control"]
    assert "no-store" in response["Cache-Control"]
    assert {"Cookie", "Authorization"}.issubset(set(response["Vary"].split(", ")))
    if not authorized:
        assert b"Private original" not in response.content
        assert b"original photo" not in response.content
        assert b"original floor plan" not in response.content
    if authorized and endpoint in {"photo", "floor-plan"}:
        assert b"original" in b"".join(response.streaming_content)


@pytest.mark.django_db
@pytest.mark.parametrize("role", ["anonymous", "staff", "superuser"])
def test_archive_view_counter_is_disabled_even_for_staff(private_archive, client, django_user_model, role):
    sign_in(client, django_user_model, role)
    response = client.post(reverse("properties:view-increment", kwargs={"pk": private_archive.pk}))
    assert response.status_code == 410
    private_archive.refresh_from_db()
    assert private_archive.visualizzazioni == 12


@pytest.mark.django_db
@pytest.mark.parametrize("path", ["blog/article.png", "reviews/avatar.png"])
def test_nonproperty_media_remains_public(private_archive, client, path):
    response = client.get(f"/media/{path}")
    assert response.status_code == 200
    assert b"public" in b"".join(response.streaming_content)


@pytest.mark.django_db
def test_media_path_aliases_cannot_bypass_archive_permissions(private_archive, settings, client):
    root = Path(settings.MEDIA_ROOT)
    (root / "blog" / "alias.png").symlink_to(root / "properties" / "ARCHIVE" / "photo.png")
    assert client.get("/media/blog/alias.png").status_code == 403
    assert client.get("/media/blog/../properties/ARCHIVE/photo.png").status_code == 403
    (root / "properties" / "alias.png").symlink_to(root / "blog" / "article.png")
    assert client.get("/media/properties/alias.png").status_code == 403
    outside = root.parent / "outside.png"
    outside.write_bytes(b"outside media root")
    (root / "blog" / "outside.png").symlink_to(outside)
    assert client.get("/media/blog/outside.png").status_code == 404


@pytest.mark.django_db
def test_public_legacy_behavior_is_preserved_before_cutover(private_archive, settings, client):
    settings.PROPERTY_ARCHIVE_PRIVATE = False
    assert client.get(reverse("properties:detail", kwargs={"pk": private_archive.pk})).status_code == 200
    media = client.get("/media/properties/ARCHIVE/photo.png")
    assert media.status_code == 200
    assert b"".join(media.streaming_content) == b"original photo"
    assert client.post(reverse("properties:view-increment", kwargs={"pk": private_archive.pk})).status_code == 200
    private_archive.refresh_from_db()
    assert private_archive.visualizzazioni == 13
