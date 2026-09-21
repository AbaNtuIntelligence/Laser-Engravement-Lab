from decimal import Decimal
import uuid

from django.db import models
from django.utils import timezone


class Quote(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("reviewing", "Reviewing"),
        ("quoted", "Quoted"),
        ("accepted", "Accepted"),
        ("declined", "Declined"),
        ("cancelled", "Cancelled"),
    ]

    reference = models.CharField(
        max_length=30,
        unique=True,
        editable=False,
    )

    customer_name = models.CharField(max_length=150)
    company = models.CharField(max_length=150, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=50)

    engraving_requirements = models.TextField(blank=True)
    additional_requirements = models.TextField(blank=True)

    estimated_subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.reference:
            date_part = timezone.now().strftime("%Y%m%d")
            random_part = uuid.uuid4().hex[:6].upper()
            self.reference = f"Q-{date_part}-{random_part}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.reference} — {self.customer_name}"


class QuoteItem(models.Model):
    quote = models.ForeignKey(
        Quote,
        on_delete=models.CASCADE,
        related_name="items",
    )

    product_id = models.CharField(max_length=100)
    sku = models.CharField(max_length=100)
    product_name = models.CharField(max_length=255)

    quantity = models.PositiveIntegerField(default=1)

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.product_name} × {self.quantity}"

    @property
    def line_total(self):
        if self.price is None:
            return None

        return self.price * self.quantity