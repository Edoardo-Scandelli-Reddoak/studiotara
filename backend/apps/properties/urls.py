from django.urls import path
from .views import PropertyListView, PropertyDetailView, PropertyFeaturedView, property_view_increment

app_name = 'properties'

urlpatterns = [
    path('', PropertyListView.as_view(), name='list'),
    path('featured/', PropertyFeaturedView.as_view(), name='featured'),
    path('<int:pk>/', PropertyDetailView.as_view(), name='detail'),
    path('<int:pk>/view/', property_view_increment, name='view-increment'),
]
