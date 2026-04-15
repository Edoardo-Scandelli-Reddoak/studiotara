import pytest
from unittest.mock import patch
from io import StringIO
from django.core.management import call_command


@pytest.mark.django_db
def test_sync_blocked_during_day():
    """Sync deve essere bloccato tra le 07:00 e le 21:00."""
    out = StringIO()
    with patch('apps.sync.management.commands.sync_properties.datetime') as mock_dt:
        from datetime import datetime as real_datetime
        mock_dt.now.return_value = real_datetime(2024, 1, 15, 12, 0, 0)  # 12:00 → bloccato
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


@pytest.mark.django_db
def test_create_default_admin_creates_user():
    from django.contrib.auth import get_user_model
    User = get_user_model()
    assert not User.objects.filter(username='admin').exists()
    out = StringIO()
    call_command('create_default_admin', stdout=out)
    assert User.objects.filter(username='admin').exists()
    assert 'Tara2024!' in out.getvalue()


@pytest.mark.django_db
def test_create_default_admin_idempotent():
    from django.contrib.auth import get_user_model
    User = get_user_model()
    out = StringIO()
    call_command('create_default_admin', stdout=out)
    call_command('create_default_admin', stdout=out)
    assert User.objects.filter(username='admin').count() == 1
