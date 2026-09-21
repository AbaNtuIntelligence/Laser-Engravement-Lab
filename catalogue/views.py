from django.http import HttpResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .services.google_sheets import get_products
from .pdf_generator import build_catalogue_pdf


def parse_boolean_filter(value):
    """
    Convert a query-string boolean into a Python boolean.

    Returns:
        True / False when valid
        None when no valid filter was supplied
    """

    if value is None:
        return None

    value = value.strip().lower()

    if value in {"true", "1", "yes"}:
        return True

    if value in {"false", "0", "no"}:
        return False

    return None


@api_view(["GET"])
def products(request):

    try:
        products = get_products()

        category = request.query_params.get("category")
        subcategory = request.query_params.get("subcategory")

        featured = parse_boolean_filter(
            request.query_params.get("featured")
        )

        new_arrival = parse_boolean_filter(
            request.query_params.get("new_arrival")
        )

        search = request.query_params.get("search")

        if category:
            category = category.strip().lower()

            products = [
                product
                for product in products
                if product["category"].strip().lower() == category
            ]

        if subcategory:
            subcategory = subcategory.strip().lower()

            products = [
                product
                for product in products
                if (
                    product["subcategory"]
                    and product["subcategory"].strip().lower()
                    == subcategory
                )
            ]

        if featured is not None:

            products = [
                product
                for product in products
                if product["featured"] == featured
            ]

        if new_arrival is not None:

            products = [
                product
                for product in products
                if product["new_arrival"] == new_arrival
            ]

        if search:

            search = search.strip().lower()

            products = [
                product
                for product in products
                if (
                    search in product["name"].lower()
                    or search in product["category"].lower()
                    or search in product["sku"].lower()
                    or (
                        product["description"]
                        and search in product["description"].lower()
                    )
                )
            ]

        return Response({
            "success": True,
            "count": len(products),
            "products": products,
        })

    except Exception as error:

        return Response(
            {
                "success": False,
                "error": str(error),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def download_catalogue(request):

    try:

        products = get_products()

        pdf_buffer = build_catalogue_pdf(products)

        response = HttpResponse(
            pdf_buffer.getvalue(),
            content_type="application/pdf",
        )

        response["Content-Disposition"] = (
            'inline; filename="laser-engraving-catalogue.pdf"'
        )

        return response

    except Exception as error:

        return Response(
            {
                "success": False,
                "error": str(error),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )