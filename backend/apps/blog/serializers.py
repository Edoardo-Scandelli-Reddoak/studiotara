from rest_framework import serializers
from .models import Article


def _absolute_image_url(request, image_field):
    if image_field and request:
        return request.build_absolute_uri(image_field.url)
    return None


class ArticleListSerializer(serializers.ModelSerializer):
    immagine_url = serializers.SerializerMethodField()
    immagine_card_url = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            'id', 'titolo', 'slug', 'excerpt',
            'immagine_url', 'immagine_card_url',
            'data_pubblicazione',
        ]

    def get_immagine_url(self, obj):
        return _absolute_image_url(self.context.get('request'), obj.immagine)

    def get_immagine_card_url(self, obj):
        return _absolute_image_url(self.context.get('request'), obj.immagine_card)


class ArticleDetailSerializer(serializers.ModelSerializer):
    immagine_url = serializers.SerializerMethodField()
    immagine_card_url = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            'id', 'titolo', 'slug', 'contenuto', 'excerpt',
            'immagine_url', 'immagine_card_url',
            'data_pubblicazione',
        ]

    def get_immagine_url(self, obj):
        return _absolute_image_url(self.context.get('request'), obj.immagine)

    def get_immagine_card_url(self, obj):
        return _absolute_image_url(self.context.get('request'), obj.immagine_card)
