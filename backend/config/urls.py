from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/properties/', include('apps.properties.urls')),
    path('api/blog/', include('apps.blog.urls')),
    path('api/contacts/', include('apps.contacts.urls')),
    path('api/reviews/', include('apps.reviews.urls')),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]
