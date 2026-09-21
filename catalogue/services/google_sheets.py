from decimal import Decimal, InvalidOperation

from django.conf import settings
from google.auth import default
from googleapiclient.discovery import build


SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
]


EXPECTED_HEADERS = [
    "ID",
    "Product Name",
    "Category",
    "Subcategory",
    "Brand",
    "SKU",
    "Slug",
    "Unit",
    "Price",
    "Compare Price",
    "Featured",
    "New Arrival",
    "Active",
    "Stock",
    "Image 1",
    "Image 2",
    "Image 3",
    "Description",
    "Feature 1",
    "Feature 2",
    "Feature 3",
    "Feature 4",
]


def get_google_credentials():
    """
    Use Google Application Default Credentials (ADC).

    Local development:
        Uses the credentials configured by:
        gcloud auth application-default login

    Production:
        Can use the platform's configured Google credentials.
    """

    credentials, project_id = default(
        scopes=SCOPES
    )

    return credentials


def get_sheet_values():
    """
    Read the complete Products worksheet from Google Sheets.
    """

    credentials = get_google_credentials()

    service = build(
        "sheets",
        "v4",
        credentials=credentials,
    )

    spreadsheet_id = settings.GOOGLE_SHEET_ID

    if not spreadsheet_id:
        raise RuntimeError(
            "GOOGLE_SHEET_ID is not configured."
        )

    result = (
        service.spreadsheets()
        .values()
        .get(
            spreadsheetId=spreadsheet_id,
            range="Products",
        )
        .execute()
    )

    return result.get("values", [])


def normalize_text(value):
    """
    Convert a spreadsheet value into clean text.
    """

    if value is None:
        return ""

    return str(value).strip()


def normalize_nullable_text(value):
    """
    Return cleaned text or None when the value is empty.
    """

    value = normalize_text(value)

    return value if value else None


def normalize_boolean(value, default=False):
    """
    Convert common Google Sheets boolean representations
    into Python booleans.
    """

    if isinstance(value, bool):
        return value

    value = normalize_text(value).lower()

    if value in {"true", "yes", "1", "on"}:
        return True

    if value in {"false", "no", "0", "off", ""}:
        return False

    return default


def normalize_integer(value, default=0):
    """
    Convert a spreadsheet value into an integer.
    """

    value = normalize_text(value)

    if not value:
        return default

    try:
        return int(float(value))
    except (ValueError, TypeError):
        return default


def normalize_decimal(value, default=None):
    """
    Convert a spreadsheet value into a decimal number.
    """

    value = normalize_text(value)

    if not value:
        return default

    try:
        return float(Decimal(value))
    except (InvalidOperation, ValueError, TypeError):
        return default


def get_cell(row, index):
    """
    Safely retrieve a cell from a row.

    Google Sheets omits trailing empty cells, so we
    must never assume every row contains 22 values.
    """

    if index >= len(row):
        return ""

    return row[index]


def normalize_product(row):
    """
    Convert one raw Google Sheets row into the public
    Django catalogue Product contract.
    """

    return {
        "id": normalize_text(get_cell(row, 0)),
        "name": normalize_text(get_cell(row, 1)),
        "category": normalize_text(get_cell(row, 2)),
        "subcategory": normalize_nullable_text(get_cell(row, 3)),
        "brand": normalize_nullable_text(get_cell(row, 4)),
        "sku": normalize_text(get_cell(row, 5)),
        "slug": normalize_text(get_cell(row, 6)),
        "unit": normalize_text(get_cell(row, 7)) or "each",

        "price": normalize_decimal(
            get_cell(row, 8)
        ),

        "compare_price": normalize_decimal(
            get_cell(row, 9)
        ),

        "featured": normalize_boolean(
            get_cell(row, 10)
        ),

        "new_arrival": normalize_boolean(
            get_cell(row, 11)
        ),

        "active": normalize_boolean(
            get_cell(row, 12),
            default=True,
        ),

        "stock": normalize_integer(
            get_cell(row, 13)
        ),

        "images": [
            image
            for image in [
                normalize_nullable_text(get_cell(row, 14)),
                normalize_nullable_text(get_cell(row, 15)),
                normalize_nullable_text(get_cell(row, 16)),
            ]
            if image
        ],

        "description": normalize_text(
            get_cell(row, 17)
        ),

        "features": [
            feature
            for feature in [
                normalize_nullable_text(get_cell(row, 18)),
                normalize_nullable_text(get_cell(row, 19)),
                normalize_nullable_text(get_cell(row, 20)),
                normalize_nullable_text(get_cell(row, 21)),
            ]
            if feature
        ],
    }


def get_products():
    """
    Read and normalize active products from Google Sheets.
    """

    values = get_sheet_values()

    if not values:
        return []

    headers = values[0]

    if headers != EXPECTED_HEADERS:
        raise RuntimeError(
            "Google Sheets Products header does not match "
            "the expected 22-column catalogue schema."
        )

    products = []

    for row in values[1:]:
        product = normalize_product(row)

        # Completely empty rows are ignored.
        if not product["id"] and not product["name"]:
            continue

        # Inactive products are kept in Sheets but hidden
        # from the public catalogue.
        if not product["active"]:
            continue

        products.append(product)

    return products