
from decimal import Decimal
import logging

from django.conf import settings
import requests
from django.db import transaction

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Quote, QuoteItem


logger = logging.getLogger(__name__)


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

        if not isinstance(items, list) or not items:
            return Response(
                {
                    "success": False,
                    "error": "At least one quote item is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ---------------------------------------------------------
        # Create quotation and products atomically
        # ---------------------------------------------------------

        with transaction.atomic():

            quote = Quote.objects.create(
                customer_name=customer_name,
                company=company,
                email=email,
                phone=phone,
                engraving_requirements=engraving_requirements,
                additional_requirements=additional_requirements,
            )

            estimated_subtotal = Decimal("0.00")

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
                    except (TypeError, ValueError, ArithmeticError):
                        price = None

                QuoteItem.objects.create(
                    quote=quote,
                    product_id=product_id,
                    sku=sku,
                    product_name=product_name,
                    quantity=quantity,
                    price=price,
                )

                if price is not None:
                    estimated_subtotal += price * quantity

            quote.estimated_subtotal = estimated_subtotal
            quote.save(
                update_fields=["estimated_subtotal", "updated_at"]
            )

        # ---------------------------------------------------------
        # Email notification: Sales primary, Info CC
        # ---------------------------------------------------------

        recipient = getattr(settings, "CONTACT_EMAIL", None)
        cc_recipient = getattr(settings, "QUOTE_CC_EMAIL", "")

        if not recipient:
            logger.error(
                "Quote %s saved but CONTACT_EMAIL is not configured.",
                quote.reference,
            )
        else:
            item_lines = [
                (
                    f"- {item.product_name} | "
                    f"SKU: {item.sku or 'N/A'} | "
                    f"Quantity: {item.quantity}"
                )
                for item in quote.items.all()
            ]

            message = "\n".join([
                f"NEW QUOTATION REQUEST: {quote.reference}",
                "",
                f"Customer: {quote.customer_name}",
                f"Company: {quote.company or 'N/A'}",
                f"Email: {quote.email}",
                f"Phone: {quote.phone}",
                "",
                "PRODUCTS REQUESTED:",
                *item_lines,
                "",
                "ENGRAVING REQUIREMENTS:",
                quote.engraving_requirements or "None",
                "",
                "ADDITIONAL REQUIREMENTS:",
                quote.additional_requirements or "None",
            ])

            try:
                if not settings.RESEND_API_KEY:
                    raise RuntimeError(
                        "RESEND_API_KEY is not configured."
                    )

                payload = {
                    "from": settings.RESEND_FROM_EMAIL,
                    "to": [recipient],
                    "cc": [cc_recipient] if cc_recipient else [],
                    "reply_to": quote.email,
                    "subject": f"New Quote Request - {quote.reference}",
                    "text": message,
                }

                response = requests.post(
                    "https://api.resend.com/emails",
                    headers={
                        "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json=payload,
                    timeout=12,
                )

                response.raise_for_status()

                email_id = response.json().get("id")

                logger.info(
                    "Quote %s notification accepted by Resend. Email ID: %s",
                    quote.reference,
                    email_id,
                )

            except requests.exceptions.RequestException:
                logger.exception(
                    "Quote %s saved but Resend API request failed.",
                    quote.reference,
                )

            except Exception:
                logger.exception(
                    "Quote %s saved but email notification failed.",
                    quote.reference,
                )
        # ---------------------------------------------------------
        # Return quotation confirmation
        # ---------------------------------------------------------

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

class ContactCreateView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        from django.core.validators import validate_email
        from django.core.exceptions import ValidationError

        name = str(request.data.get("name", "")).strip()
        email = str(request.data.get("email", "")).strip()
        phone = str(request.data.get("phone", "")).strip()
        subject = str(request.data.get("subject", "")).strip()
        message = str(request.data.get("message", "")).strip()

        if not name or not email or not message:
            return Response(
                {"success": False, "message": "Name, email and message are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            validate_email(email)
        except ValidationError:
            return Response(
                {"success": False, "message": "Enter a valid email address."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not settings.RESEND_API_KEY:
            logger.error("Contact submission failed: Resend API key missing.")
            return Response(
                {"success": False, "message": "Email service unavailable. Please try again later."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        email_body = "\n".join([
            "NEW CONTACT ENQUIRY - LASER ENGRAVING LAB",
            "",
            f"Name: {name}",
            f"Email: {email}",
            f"Phone: {phone or 'Not provided'}",
            f"Subject: {subject or 'General enquiry'}",
            "",
            "MESSAGE:",
            message,
        ])

        payload = {
            "from": settings.RESEND_FROM_EMAIL,
            "to": [settings.CONTACT_EMAIL],
            "cc": [settings.QUOTE_CC_EMAIL] if settings.QUOTE_CC_EMAIL else [],
            "reply_to": email,
            "subject": f"Contact Enquiry - {subject or 'General Enquiry'}",
            "text": email_body,
        }

        try:
            response = requests.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                    "Content-Type": "application/json",
                },
                json=payload,
                timeout=12,
            )
            response.raise_for_status()

        except requests.exceptions.RequestException:
            logger.exception("Contact enquiry email submission failed.")
            return Response(
                {"success": False, "message": "We could not send your enquiry. Please try again."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(
            {"success": True, "message": "Your enquiry has been sent successfully."},
            status=status.HTTP_200_OK,
        )
