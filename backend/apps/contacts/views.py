from rest_framework import generics, status
from rest_framework.response import Response
from .models import ContactRequest, ValuationRequest
from .serializers import ContactRequestSerializer, ValuationRequestSerializer


class ContactRequestView(generics.CreateAPIView):
    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Email differita: verrà inviata quando EMAIL_HOST sarà configurato
        return Response(
            {'message': 'Richiesta inviata con successo.'},
            status=status.HTTP_201_CREATED,
        )


class ValuationRequestView(generics.CreateAPIView):
    queryset = ValuationRequest.objects.all()
    serializer_class = ValuationRequestSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Email differita: verrà inviata quando EMAIL_HOST sarà configurato
        return Response(
            {'message': 'Richiesta di valutazione inviata con successo.'},
            status=status.HTTP_201_CREATED,
        )
