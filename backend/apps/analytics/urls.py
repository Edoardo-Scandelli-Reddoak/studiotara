from django.urls import path
from .views import track_pageview

app_name = 'analytics'

urlpatterns = [
    path('pageview/', track_pageview, name='pageview'),
]
