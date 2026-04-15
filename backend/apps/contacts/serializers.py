from rest_framework import serializers
from .models import ContactRequest, ValuationRequest


class ContactRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactRequest
        fields = ['nome', 'email', 'telefono', 'messaggio']


class ValuationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValuationRequest
        fields = ['nome', 'email', 'telefono', 'indirizzo_immobile', 'comune', 'tipologia', 'mq', 'note']
