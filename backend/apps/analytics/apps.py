from django.apps import AppConfig


class AnalyticsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.analytics'
    verbose_name = 'Analisi'

    def ready(self):
        # Register a custom admin URL for the dashboard view. We patch the
        # default admin site's get_urls so that /admin/analitiche/ renders our
        # dashboard, while leaving the standard admin URLs intact.
        from django.contrib import admin
        from django.urls import path
        from .admin_views import dashboard_view

        original_get_urls = admin.site.get_urls

        def get_urls():
            return [
                path(
                    'analitiche/',
                    admin.site.admin_view(dashboard_view),
                    name='analytics_dashboard',
                ),
            ] + original_get_urls()

        admin.site.get_urls = get_urls
