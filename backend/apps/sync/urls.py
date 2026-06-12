from django.urls import path

from .views import trigger_sync

app_name = "sync"

urlpatterns = [
    path("run/", trigger_sync, name="run"),
]
