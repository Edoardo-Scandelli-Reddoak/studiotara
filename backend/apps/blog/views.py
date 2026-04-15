from rest_framework import generics
from .models import Article
from .serializers import ArticleListSerializer, ArticleDetailSerializer


class ArticleListView(generics.ListAPIView):
    queryset = Article.objects.filter(pubblicato=True).order_by('-data_pubblicazione')
    serializer_class = ArticleListSerializer


class ArticleDetailView(generics.RetrieveAPIView):
    queryset = Article.objects.filter(pubblicato=True)
    serializer_class = ArticleDetailSerializer
    lookup_field = 'slug'
