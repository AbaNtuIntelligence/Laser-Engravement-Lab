from decimal import Decimal

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Quote, QuoteItem


class QuoteCreateView(APIView):

    def post(self, request):
        data = request.data

        customer_name = str(data.get("customer_name", "")).strip()
        company = str(data.get("company", "")).strip()
        email = str(data.get("email", "")).strip()
        phone = str(data.get("phone", "")).strip()

        engraving_requirements = str(
            data.get("engraving_requirements", "")
        ).strip()

        additional_requirements = str(
            data.get("additional_requirements", "")
        ).strip()

        items = data.get("items", [])

        # ---------------------------------------------------------
        # Basic validation
        # ---------------------------------------------------------

        if not customer_name:
            return Response(
                {"success": False, "error": "Customer name is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not email:
            return Response(
                {"success": False, "error": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not phone:
            return Response(
                {"success": False, "error": "Phone number is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not items or not isinstance(items, list):
            return Response(
                {
                    "success": False,
                    "error": "At least one quote item is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ---------------------------------------------------------
        # Create quote
        # ---------------------------------------------------------

        quote = Quote.objects.create(
            customer_name=customer_name,
            company=company,
            email=email,
            phone=phone,
            engraving_requirements=engraving_requirements,
            additional_requirements=additional_requirements,
        )

        estimated_subtotal = Decimal("0.00")

        # ---------------------------------------------------------
        # Create quote items
        # ---------------------------------------------------------

        for item in items:
            product = item.get("product", {})

            product_id = str(product.get("id", "")).strip()
            product_name = str(product.get("name", "")).strip()
            sku = str(product.get("sku", "")).strip()

            quantity = item.get("quantity", 1)

            try:
                quantity = int(quantity)
            except (TypeError, ValueError):
                quantity = 1

            if quantity < 1:
                quantity = 1

            price_value = product.get("price")

            price = None

            if price_value not in (None, ""):
                try:
                    price = Decimal(str(price_value))
                except Exception:
                    price = None

            quote_item = QuoteItem.objects.create(
                quote=quote,
                product_id=product_id,
                sku=sku,
                product_name=product_name,
                quantity=quantity,
                price=price,
            )

            if price is not None:
                estimated_subtotal += price * quantity

        # ---------------------------------------------------------
        # Save calculated subtotal
        # ---------------------------------------------------------

        quote.estimated_subtotal = estimated_subtotal
        quote.save(update_fields=["estimated_subtotal", "updated_at"])

        return Response(
            {
                "success": True,
                "message": "Quote request submitted successfully.",
                "quote": {
                    "id": quote.id,
                    "reference": quote.reference,
                    "status": quote.status,
                    "estimated_subtotal": str(
                        quote.estimated_subtotal
                    ),
                },
            },
            status=status.HTTP_201_CREATED,
        )