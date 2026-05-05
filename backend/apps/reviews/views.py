from rest_framework.generics import ListAPIView
from .models import GoogleReview
from .serializers import GoogleReviewSerializer


class GoogleReviewListView(ListAPIView):
    """Recensioni Google 4-5 stelle, ordinate per data (più recenti prima)."""
    serializer_class = GoogleReviewSerializer
    pagination_class = None

    def get_queryset(self):
        return GoogleReview.objects.filter(rating__gte=4).order_by('-time')
