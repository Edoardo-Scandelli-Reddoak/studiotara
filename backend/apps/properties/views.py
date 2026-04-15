from rest_framework import generics
from .models import Property
from .serializers import PropertyListSerializer, PropertyDetailSerializer


class PropertyListView(generics.ListAPIView):
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


class PropertyDetailView(generics.RetrieveAPIView):
    queryset = Property.objects.filter(flag_storico=False).prefetch_related('images')
    serializer_class = PropertyDetailSerializer


class PropertyFeaturedView(generics.ListAPIView):
    queryset = (
        Property.objects
        .filter(flag_storico=False, in_vetrina=True)
        .prefetch_related('images')
    )
    serializer_class = PropertyListSerializer
