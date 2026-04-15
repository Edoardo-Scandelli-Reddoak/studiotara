import pytest
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient
from apps.blog.models import Article


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def article(db):
    return Article.objects.create(
        titolo='Mercato immobiliare 2024',
        contenuto='Contenuto articolo...',
        excerpt='Riassunto articolo',
        pubblicato=True,
        data_pubblicazione=timezone.now(),
    )


@pytest.mark.django_db
def test_article_list_returns_200(client, article):
    url = reverse('blog:list')
    response = client.get(url)
    assert response.status_code == 200


@pytest.mark.django_db
def test_article_list_returns_only_published(client, db):
    Article.objects.create(
        titolo='Bozza',
        contenuto='...',
        pubblicato=False,
        data_pubblicazione=timezone.now(),
    )
    Article.objects.create(
        titolo='Pubblicato',
        contenuto='...',
        pubblicato=True,
        data_pubblicazione=timezone.now(),
    )
    url = reverse('blog:list')
    response = client.get(url)
    assert response.data['count'] == 1
    assert response.data['results'][0]['titolo'] == 'Pubblicato'


@pytest.mark.django_db
def test_article_detail_by_slug(client, article):
    url = reverse('blog:detail', kwargs={'slug': article.slug})
    response = client.get(url)
    assert response.status_code == 200
    assert response.data['titolo'] == 'Mercato immobiliare 2024'


@pytest.mark.django_db
def test_article_detail_404_for_unpublished(client, db):
    a = Article.objects.create(
        titolo='Bozza privata',
        contenuto='...',
        pubblicato=False,
        data_pubblicazione=timezone.now(),
    )
    url = reverse('blog:detail', kwargs={'slug': a.slug})
    response = client.get(url)
    assert response.status_code == 404
