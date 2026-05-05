from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import GoogleReview


@admin.register(GoogleReview)
class GoogleReviewAdmin(ModelAdmin):
    list_display = ['author_name', 'rating', 'time', 'language']
    list_filter = ['rating', 'language']
    search_fields = ['author_name', 'text']
    readonly_fields = ['google_review_id', 'created_at']
    ordering = ['-time']
