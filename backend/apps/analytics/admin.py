from django.contrib import admin
from django.shortcuts import redirect

from .models import PageView


@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    list_display = ('path', 'timestamp')
    list_filter = ('timestamp',)
    search_fields = ('path',)
    readonly_fields = ('path', 'timestamp')
    date_hierarchy = 'timestamp'

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        # The sidebar entry "Dashboard" points here. Redirect to the real
        # analytics dashboard instead of the raw row-by-row list (still
        # reachable directly via /admin/analytics/pageview/?raw=1 if needed).
        if request.GET.get('raw') != '1':
            return redirect('/admin/analitiche/')
        return super().changelist_view(request, extra_context=extra_context)
