from django.urls import path

from .views import QuoteCreateView, ContactCreateView

urlpatterns = [
    path("quotes/", QuoteCreateView.as_view(), name="quote-create"),
    path("contact/", ContactCreateView.as_view(), name="contact-create"),
]