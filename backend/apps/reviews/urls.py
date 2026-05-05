from django.urls import path
from .views import GoogleReviewListView

urlpatterns = [
    path('', GoogleReviewListView.as_view(), name='review-list'),
]
