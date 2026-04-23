from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/properties/', include('apps.properties.urls')),
    path('api/blog/', include('apps.blog.urls')),
    path('api/contacts/', include('apps.contacts.urls')),
]

# Serve media files (whitenoise handles only static, not media)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
