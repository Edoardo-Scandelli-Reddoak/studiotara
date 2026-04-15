from django.urls import path
from .views import PropertyListView, PropertyDetailView, PropertyFeaturedView

app_name = 'properties'

urlpatterns = [
    path('', PropertyListView.as_view(), name='list'),
    path('featured/', PropertyFeaturedView.as_view(), name='featured'),
    path('<int:pk>/', PropertyDetailView.as_view(), name='detail'),
]
