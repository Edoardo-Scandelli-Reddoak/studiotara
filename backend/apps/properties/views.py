import posixpath
from pathlib import Path

from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from django.db.models import F
from django.http import Http404, HttpResponseForbidden
from django.utils.cache import add_never_cache_headers, patch_vary_headers
from django.views.static import serve
from .models import Property
from .permissions import PropertyArchiveAccess, can_view_property_archive
from .serializers import PropertyListSerializer, PropertyDetailSerializer


def private_archive_response(response):
    add_never_cache_headers(response)
    patch_vary_headers(response, ("Cookie", "Authorization"))
    return response


class PropertyArchiveMixin:
    permission_classes = [PropertyArchiveAccess]

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        if settings.PROPERTY_ARCHIVE_PRIVATE:
            private_archive_response(response)
        return response


def serve_media(request, path):
    # Resolve before classifying: ../ segments or symlinks through a public
    # media directory must not bypass protection for original property files.
    media_root = Path(settings.MEDIA_ROOT).resolve()
    try:
        relative = (media_root / path).resolve().relative_to(media_root)
    except (ValueError, OSError, RuntimeError):
        raise Http404
    requested_parts = Path(posixpath.normpath(path)).parts
    private = settings.PROPERTY_ARCHIVE_PRIVATE and (
        requested_parts[:1] == ("properties",) or relative.parts[:1] == ("properties",)
    )
    if private and not can_view_property_archive(request.user):
        return private_archive_response(HttpResponseForbidden())
    response = serve(request, relative.as_posix(), document_root=str(media_root))
    return private_archive_response(response) if private else response


class PropertyListView(PropertyArchiveMixin, generics.ListAPIView):
    serializer_class = PropertyListSerializer

    def get_queryset(self):
        qs = Property.objects.filter(flag_storico=False).prefetch_related('images')

        tipologia = self.request.query_params.get('tipologia')
        comune = self.request.query_params.get('comune')
        contratto = self.request.query_params.get('contratto')
        prezzo_min = self.request.query_params.get('prezzo_min')
        prezzo_max = self.request.query_params.get('prezzo_max')
        mq_min = self.request.query_params.get('mq_min')
        mq_max = self.request.query_params.get('mq_max')
        locali = self.request.query_params.get('locali')

        if tipologia:
            qs = qs.filter(tipologia__icontains=tipologia)
        if comune:
            qs = qs.filter(comune__icontains=comune)
        if contratto:
            qs = qs.filter(contratto=contratto)
        if prezzo_min:
            qs = qs.filter(prezzo__gte=prezzo_min)
        if prezzo_max:
            qs = qs.filter(prezzo__lte=prezzo_max)
        if mq_min:
            qs = qs.filter(mq__gte=mq_min)
        if mq_max:
            qs = qs.filter(mq__lte=mq_max)
        if locali:
            qs = qs.filter(locali=locali)

        return qs


class PropertyDetailView(PropertyArchiveMixin, generics.RetrieveAPIView):
    queryset = Property.objects.filter(flag_storico=False).prefetch_related('images')
    serializer_class = PropertyDetailSerializer


@api_view(['POST'])
def property_view_increment(request, pk):
    if settings.PROPERTY_ARCHIVE_PRIVATE:
        return private_archive_response(Response({"error": "property archive is read only"}, status=status.HTTP_410_GONE))
    try:
        Property.objects.filter(pk=pk, flag_storico=False).update(visualizzazioni=F('visualizzazioni') + 1)
        views = Property.objects.filter(pk=pk).values_list('visualizzazioni', flat=True).first()
        return Response({'visualizzazioni': views})
    except Property.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


class PropertyFeaturedView(PropertyArchiveMixin, generics.ListAPIView):
    queryset = (
        Property.objects
        .filter(flag_storico=False, in_vetrina=True)
        .prefetch_related('images')
    )
    serializer_class = PropertyListSerializer
