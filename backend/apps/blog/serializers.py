from rest_framework import serializers
from .models import Article


class ArticleListSerializer(serializers.ModelSerializer):
    immagine_url = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ['id', 'titolo', 'slug', 'excerpt', 'immagine_url', 'data_pubblicazione']

    def get_immagine_url(self, obj):
        request = self.context.get('request')
        if obj.immagine and request:
            return request.build_absolute_uri(obj.immagine.url)
        return None


class ArticleDetailSerializer(serializers.ModelSerializer):
    immagine_url = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ['id', 'titolo', 'slug', 'contenuto', 'excerpt', 'immagine_url', 'data_pubblicazione']

    def get_immagine_url(self, obj):
        request = self.context.get('request')
        if obj.immagine and request:
            return request.build_absolute_uri(obj.immagine.url)
        return None
