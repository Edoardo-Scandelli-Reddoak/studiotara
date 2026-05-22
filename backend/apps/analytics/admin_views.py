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

# Used to normalize property/blog detail paths for the "top pages" table so all
# `/cerco-residenziale/123` URLs aggregate under a single row.
PROPERTY_RES_PATH = re.compile(r'^/cerco-residenziale/(\d+)/?$')
PROPERTY_COM_PATH = re.compile(r'^/cerco-commerciale/(\d+)/?$')
BLOG_PATH = re.compile(r'^/blog/[^/]+/?$')

# Same intent, used to extract the property id from a path so we can join with
# the Property table for the "top properties" table.
PROPERTY_DETAIL_PATH = re.compile(r'^/cerco-(?:residenziale|commerciale)/(\d+)/?$')


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

    # Per-property real view counts derived from PageView entries (path-based).
    # Starts from 0 at deploy time — independent from `Property.visualizzazioni`
    # which still carries the seed numbers shown to visitors on the public site.
    property_path_rows = (
        PageView.objects
        .filter(path__regex=r'^/cerco-(residenziale|commerciale)/\d+/?$')
        .values('path')
        .annotate(c=Count('id'))
    )
    property_view_counts: dict[int, int] = {}
    for row in property_path_rows:
        m = PROPERTY_DETAIL_PATH.match(row['path'])
        if not m:
            continue
        pid = int(m.group(1))
        property_view_counts[pid] = property_view_counts.get(pid, 0) + row['c']

    total_property_views = sum(property_view_counts.values())

    top_ids = sorted(property_view_counts, key=property_view_counts.get, reverse=True)[:10]
    props_by_id = {
        p['id']: p for p in
        Property.objects.filter(id__in=top_ids).values('id', 'titolo', 'tipologia', 'comune')
    }
    top_properties = [
        {**props_by_id[pid], 'visualizzazioni': property_view_counts[pid]}
        for pid in top_ids if pid in props_by_id
    ]

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
