from django.contrib import admin

from .admin_views import dashboard_view
from .models import PageView


@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    # The sidebar entry "Dashboard" (driven by Meta.verbose_name_plural)
    # routes to the analytics dashboard view rather than the raw row list.
    def changelist_view(self, request, extra_context=None):
        return dashboard_view(request)
