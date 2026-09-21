from django.contrib import admin
from django.urls import include, path

from .views import status


urlpatterns = [
    path("admin/", admin.site.urls),

    path(
        "api/status/",
        status,
        name="api_status",
    ),

    path(
        "api/catalogue/",
        include("catalogue.urls"),
    ),

    path(
        "api/orders/",
        include("orders.urls"),
    ),
]