from rest_framework import serializers
from .models import Property, PropertyImage


class PropertyImageSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ['id', 'file_url', 'is_planimetria', 'ordine']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None


class PropertyListSerializer(serializers.ModelSerializer):
    immagine_principale = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id', 'gestionale_id', 'titolo', 'tipologia', 'contratto',
            'prezzo', 'mq', 'comune', 'provincia', 'zona',
            'locali', 'bagni', 'camere', 'piano',
            'ascensore', 'garage', 'classe_energetica',
            'in_vetrina', 'in_carosello', 'visualizzazioni',
            'immagine_principale',
        ]

    def get_immagine_principale(self, obj):
        img = obj.images.filter(is_planimetria=False).first()
        if img:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(img.file.url)
        return None


class PropertyDetailSerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        exclude = ['flag_storico', 'ultimo_sync']
