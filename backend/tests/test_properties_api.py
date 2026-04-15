import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.properties.models import Property


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def property_obj(db):
    return Property.objects.create(
        gestionale_id='TEST001',
        titolo='Appartamento Milano',
        comune='Milano',
        tipologia='appartamento',
        contratto='vendita',
        prezzo=250000,
        mq=80,
        locali=3,
        in_vetrina=True,
        flag_storico=False,
    )


@pytest.mark.django_db
def test_property_list_returns_200(client, property_obj):
    url = reverse('properties:list')
    response = client.get(url)
    assert response.status_code == 200


@pytest.mark.django_db
def test_property_list_contains_property(client, property_obj):
    url = reverse('properties:list')
    response = client.get(url)
    assert response.data['count'] == 1
    assert response.data['results'][0]['gestionale_id'] == 'TEST001'


@pytest.mark.django_db
def test_property_list_excludes_storico(client, db):
    Property.objects.create(
        gestionale_id='STORICO01',
        titolo='Vecchio immobile',
        comune='Milano',
        flag_storico=True,
    )
    url = reverse('properties:list')
    response = client.get(url)
    assert response.data['count'] == 0


@pytest.mark.django_db
def test_property_list_filter_by_tipologia(client, property_obj):
    url = reverse('properties:list')
    response = client.get(url, {'tipologia': 'appartamento'})
    assert response.data['count'] == 1
    response2 = client.get(url, {'tipologia': 'villa'})
    assert response2.data['count'] == 0


@pytest.mark.django_db
def test_property_list_filter_by_prezzo_max(client, property_obj):
    url = reverse('properties:list')
    response = client.get(url, {'prezzo_max': 300000})
    assert response.data['count'] == 1
    response2 = client.get(url, {'prezzo_max': 200000})
    assert response2.data['count'] == 0


@pytest.mark.django_db
def test_property_detail_returns_200(client, property_obj):
    url = reverse('properties:detail', kwargs={'pk': property_obj.pk})
    response = client.get(url)
    assert response.status_code == 200
    assert response.data['gestionale_id'] == 'TEST001'


@pytest.mark.django_db
def test_property_featured_returns_only_vetrina(client, property_obj, db):
    Property.objects.create(
        gestionale_id='NOT_FEATURED',
        titolo='Non in vetrina',
        comune='Milano',
        in_vetrina=False,
        flag_storico=False,
    )
    url = reverse('properties:featured')
    response = client.get(url)
    assert response.status_code == 200
    assert response.data['count'] == 1
    assert response.data['results'][0]['gestionale_id'] == 'TEST001'
