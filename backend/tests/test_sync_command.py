import pytest
from unittest.mock import patch
from io import StringIO
from django.core.management import call_command


@pytest.mark.django_db
def test_sync_blocked_during_day():
    """Il sync rispetta la fascia oraria italiana, indipendente dal fuso host."""
    out = StringIO()
    with patch('apps.sync.management.commands.sync_properties.timezone.now') as mock_now:
        from datetime import datetime as real_datetime, timezone
        mock_now.return_value = real_datetime(2024, 1, 15, 12, 0, 0, tzinfo=timezone.utc)  # 12:00 → bloccato
        call_command('sync_properties', stdout=out)
    output = out.getvalue().lower()
    assert 'non consentito' in output or 'orario' in output


@pytest.mark.django_db
def test_sync_allowed_with_force_flag(monkeypatch):
    """Con --force il controllo orario viene bypassato e si tenta il download."""
    import requests as real_requests
    monkeypatch.setenv('GESTIONALE_FEED_URL', 'http://fake-feed.example.com/feed.tar.gz')
    out = StringIO()
    with patch('apps.sync.management.commands.sync_properties.requests.get') as mock_get:
        mock_get.side_effect = real_requests.RequestException('No feed in test')
        call_command('sync_properties', force=True, stdout=out)
    assert mock_get.called


@pytest.fixture
def bootstrap_environment(monkeypatch, settings):
    settings.PROPERTY_ARCHIVE_PRIVATE = False
    for name in ("DEFAULT_ADMIN_USERNAME", "DEFAULT_ADMIN_PASSWORD", "DEFAULT_ADMIN_EMAIL"):
        monkeypatch.delenv(name, raising=False)


@pytest.mark.django_db
@pytest.mark.parametrize("username,password", [(None, None), ("operator", None), (None, "test-only-secret"), ("operator", "   ")])
def test_admin_bootstrap_requires_both_credentials(bootstrap_environment, monkeypatch, django_user_model, username, password):
    if username is not None:
        monkeypatch.setenv("DEFAULT_ADMIN_USERNAME", username)
    if password is not None:
        monkeypatch.setenv("DEFAULT_ADMIN_PASSWORD", password)
    out = StringIO()
    call_command("create_default_admin", stdout=out)
    assert not django_user_model.objects.exists()
    assert "non configurate" in out.getvalue()


@pytest.mark.django_db
def test_admin_bootstrap_creates_configured_user_without_logging_secret(bootstrap_environment, monkeypatch, django_user_model):
    monkeypatch.setenv("DEFAULT_ADMIN_USERNAME", "operator")
    monkeypatch.setenv("DEFAULT_ADMIN_PASSWORD", "test-only-secret")
    monkeypatch.setenv("DEFAULT_ADMIN_EMAIL", "operator@example.test")
    out = StringIO()
    call_command("create_default_admin", stdout=out)
    user = django_user_model.objects.get(username="operator")
    assert user.is_superuser and user.is_staff
    assert user.email == "operator@example.test"
    assert user.check_password("test-only-secret")
    assert "test-only-secret" not in out.getvalue()


@pytest.mark.django_db
def test_admin_bootstrap_never_rotates_or_elevates_existing_user(bootstrap_environment, monkeypatch, django_user_model):
    existing = django_user_model.objects.create_user(username="operator", password="original-test-secret")
    monkeypatch.setenv("DEFAULT_ADMIN_USERNAME", "operator")
    monkeypatch.setenv("DEFAULT_ADMIN_PASSWORD", "replacement-test-secret")
    out = StringIO()
    call_command('create_default_admin', stdout=out)
    call_command('create_default_admin', stdout=out)
    assert django_user_model.objects.count() == 1
    existing.refresh_from_db()
    assert existing.check_password("original-test-secret")
    assert not existing.is_staff and not existing.is_superuser
    assert "replacement-test-secret" not in out.getvalue()


@pytest.mark.django_db
def test_admin_bootstrap_is_disabled_for_private_archive(bootstrap_environment, settings, monkeypatch, django_user_model):
    settings.PROPERTY_ARCHIVE_PRIVATE = True
    monkeypatch.setenv("DEFAULT_ADMIN_USERNAME", "operator")
    monkeypatch.setenv("DEFAULT_ADMIN_PASSWORD", "test-only-secret")
    out = StringIO()
    call_command("create_default_admin", stdout=out)
    assert not django_user_model.objects.exists()
    assert "disabilitato" in out.getvalue()
