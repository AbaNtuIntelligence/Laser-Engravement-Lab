from django.urls import path

from .views import products, download_catalogue


urlpatterns = [
    path(
        "products/",
        products,
        name="products",
    ),

    path(
        "download/",
        download_catalogue,
        name="download_catalogue",
    ),
]