import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.contacts.models import ContactRequest, ValuationRequest


@pytest.fixture
def client():
    return APIClient()


@pytest.mark.django_db
def test_contact_form_saves_to_db(client):
    url = reverse('contacts:contact')
    payload = {
        'nome': 'Mario Rossi',
        'email': 'mario@example.com',
        'telefono': '3331234567',
        'messaggio': 'Vorrei informazioni su un immobile.',
    }
    response = client.post(url, payload, format='json')
    assert response.status_code == 201
    assert ContactRequest.objects.filter(email='mario@example.com').exists()


@pytest.mark.django_db
def test_contact_form_requires_email(client):
    url = reverse('contacts:contact')
    payload = {
        'nome': 'Mario Rossi',
        'messaggio': 'Ciao',
    }
    response = client.post(url, payload, format='json')
    assert response.status_code == 400
    assert 'email' in response.data


@pytest.mark.django_db
def test_valuation_form_saves_to_db(client):
    url = reverse('contacts:valuation')
    payload = {
        'nome': 'Luisa Bianchi',
        'email': 'luisa@example.com',
        'telefono': '3339876543',
        'indirizzo_immobile': 'Via Roma 1',
        'comune': 'Milano',
        'tipologia': 'appartamento',
        'mq': 90,
    }
    response = client.post(url, payload, format='json')
    assert response.status_code == 201
    assert ValuationRequest.objects.filter(email='luisa@example.com').exists()


@pytest.mark.django_db
def test_valuation_form_requires_comune(client):
    url = reverse('contacts:valuation')
    payload = {
        'nome': 'Luisa Bianchi',
        'email': 'luisa@example.com',
        'indirizzo_immobile': 'Via Roma 1',
        'tipologia': 'appartamento',
    }
    response = client.post(url, payload, format='json')
    assert response.status_code == 400
    assert 'comune' in response.data
