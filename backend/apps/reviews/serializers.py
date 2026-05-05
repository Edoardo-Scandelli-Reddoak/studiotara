from rest_framework import serializers
from .models import GoogleReview


class GoogleReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoogleReview
        fields = ['id', 'author_name', 'profile_photo_url', 'rating', 'text', 'time']
