from django.urls import path
from .views import ArticleListView, ArticleDetailView

app_name = 'blog'

urlpatterns = [
    path('articles/', ArticleListView.as_view(), name='list'),
    path('articles/<slug:slug>/', ArticleDetailView.as_view(), name='detail'),
]
