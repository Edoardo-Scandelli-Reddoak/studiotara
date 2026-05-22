import json
import re
from datetime import timedelta

from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Count
from django.db.models.functions import TruncDate
from django.shortcuts import render
from django.utils import timezone

from apps.properties.models import Property
from .models import PageView

# Patterns used to normalize property/blog detail paths so they aggregate as a
# single row in the "Top pagine" table instead of one row per id/slug.
PROPERTY_RES_PATH = re.compile(r'^/cerco-residenziale/[^/]+/?$')
PROPERTY_COM_PATH = re.compile(r'^/cerco-commerciale/[^/]+/?$')
BLOG_PATH = re.compile(r'^/blog/[^/]+/?$')


def _normalize_path(path: str) -> str:
    if PROPERTY_RES_PATH.match(path):
        return '/cerco-residenziale/{id}'
    if PROPERTY_COM_PATH.match(path):
        return '/cerco-commerciale/{id}'
    if BLOG_PATH.match(path):
        return '/blog/{slug}'
    return path


@staff_member_required
def dashboard_view(request):
    now = timezone.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    last_7 = now - timedelta(days=7)
    last_30 = now - timedelta(days=30)

    # KPI cards
    total_views = PageView.objects.count()
    views_today = PageView.objects.filter(timestamp__gte=today_start).count()
    views_7d = PageView.objects.filter(timestamp__gte=last_7).count()
    views_30d = PageView.objects.filter(timestamp__gte=last_30).count()
    total_properties = Property.objects.filter(flag_storico=False).count()
    total_property_views = sum(
        Property.objects.filter(flag_storico=False).values_list('visualizzazioni', flat=True)
    )

    # Top properties (uses cumulative counter on Property model)
    top_properties = list(
        Property.objects
        .filter(flag_storico=False)
        .order_by('-visualizzazioni')
        .values('id', 'titolo', 'tipologia', 'comune', 'visualizzazioni')[:10]
    )

    # Top pages (PageView aggregated, with property/blog detail paths normalized)
    raw_path_counts = (
        PageView.objects
        .values('path')
        .annotate(c=Count('id'))
        .order_by('-c')[:200]  # take a wider slice then re-aggregate after normalization
    )
    aggregated = {}
    for row in raw_path_counts:
        key = _normalize_path(row['path'])
        aggregated[key] = aggregated.get(key, 0) + row['c']
    top_pages = sorted(
        ({'path': k, 'c': v} for k, v in aggregated.items()),
        key=lambda r: -r['c'],
    )[:10]

    # Time series — daily counts for the last 30 days. Fill missing days with 0
    # so the chart line stays continuous.
    series_qs = (
        PageView.objects
        .filter(timestamp__gte=last_30)
        .annotate(day=TruncDate('timestamp'))
        .values('day')
        .annotate(c=Count('id'))
        .order_by('day')
    )
    series_map = {row['day']: row['c'] for row in series_qs}
    chart_labels = []
    chart_values = []
    for i in range(30, -1, -1):
        d = (now - timedelta(days=i)).date()
        chart_labels.append(d.strftime('%d/%m'))
        chart_values.append(series_map.get(d, 0))

    context = {
        'title': 'Analisi del sito',
        'site_header': 'Studiotara',
        'site_title': 'Studiotara Admin',
        'has_permission': True,
        'is_popup': False,
        'is_nav_sidebar_enabled': True,
        'available_apps': [],
        # data
        'total_views': total_views,
        'views_today': views_today,
        'views_7d': views_7d,
        'views_30d': views_30d,
        'total_properties': total_properties,
        'total_property_views': total_property_views,
        'top_properties': top_properties,
        'top_pages': top_pages,
        'chart_labels_json': json.dumps(chart_labels),
        'chart_values_json': json.dumps(chart_values),
    }
    return render(request, 'admin/analytics/dashboard.html', context)
