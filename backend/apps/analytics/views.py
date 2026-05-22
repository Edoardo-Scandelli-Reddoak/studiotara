from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import PageView


@api_view(['POST'])
def track_pageview(request):
    """Public endpoint called by the frontend on every route change.

    Body: {"path": "/some/path"}.
    No auth, no rate limiting — kept intentionally lightweight.
    """
    path = (request.data.get('path') or '').strip()
    if not path or len(path) > 500:
        return Response({'error': 'invalid path'}, status=status.HTTP_400_BAD_REQUEST)

    PageView.objects.create(path=path)
    return Response(status=status.HTTP_204_NO_CONTENT)
