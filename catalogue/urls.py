from django.urls import path

from .views import products, download_catalogue, pdf_diagnostic


urlpatterns = [
    path("products/", products, name="products"),
    path("download/", download_catalogue, name="download_catalogue"),
    path("pdf-diagnostic/", pdf_diagnostic, name="pdf_diagnostic"),
]