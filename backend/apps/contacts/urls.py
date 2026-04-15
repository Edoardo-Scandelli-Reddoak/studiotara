from django.urls import path
from .views import ContactRequestView, ValuationRequestView

app_name = 'contacts'

urlpatterns = [
    path('contact/', ContactRequestView.as_view(), name='contact'),
    path('valuation/', ValuationRequestView.as_view(), name='valuation'),
]
