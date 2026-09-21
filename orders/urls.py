from django.urls import path

from .views import QuoteCreateView


urlpatterns = [
    path("quotes/", QuoteCreateView.as_view(), name="quote-create"),
]