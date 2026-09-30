from django.conf import settings
from rest_framework.permissions import BasePermission


def can_view_property_archive(user):
    return (
        user.is_authenticated
        and user.is_active
        and user.is_staff
        and user.has_perm("properties.view_property")
    )


class PropertyArchiveAccess(BasePermission):
    """Keep the legacy public API available until the dashboard cutover."""

    def has_permission(self, request, view):
        return not settings.PROPERTY_ARCHIVE_PRIVATE or can_view_property_archive(request.user)
