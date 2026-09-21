from rest_framework import serializers

from .models import Quote, QuoteItem


class QuoteItemSerializer(serializers.ModelSerializer):
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = QuoteItem
        fields = [
            "product_id",
            "sku",
            "product_name",
            "quantity",
            "price",
            "line_total",
        ]
        read_only_fields = [
            "price",
            "line_total",
        ]

    def get_line_total(self, obj):
        if obj.price is None:
            return None

        return obj.line_total


class QuoteSerializer(serializers.ModelSerializer):
    items = QuoteItemSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Quote
        fields = [
            "id",
            "reference",
            "customer_name",
            "company",
            "email",
            "phone",
            "engraving_requirements",
            "additional_requirements",
            "estimated_subtotal",
            "status",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "reference",
            "estimated_subtotal",
            "status",
            "items",
            "created_at",
            "updated_at",
        ]