from decimal import Decimal, InvalidOperation
from pathlib import Path

from django.conf import settings
from google.oauth2.credentials import Credentials
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
    Load Google OAuth credentials from the local/production token file.
    """

    token_file = getattr(
        settings,
        "GOOGLE_OAUTH_TOKEN_FILE",
        None,
    )

    if not token_file:
        token_file = Path(settings.BASE_DIR) / "oauth-token.json"

    token_file = Path(token_file)

    if not token_file.exists():
        raise RuntimeError(
            f"Google OAuth token file was not found: {token_file}"
        )

    credentials = Credentials.from_authorized_user_file(
        str(token_file),
        SCOPES,
    )

    if not credentials:
        raise RuntimeError(
            "Google OAuth credentials could not be loaded."
        )

    if not credentials.refresh_token:
        raise RuntimeError(
            "Google OAuth credentials do not contain a refresh token."
        )

    return credentials


def get_sheet_values():
    """
    Read all catalogue rows from the Products sheet.
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


def parse_boolean(value):
    """
    Convert common spreadsheet boolean values to Python booleans.
    """

    if isinstance(value, bool):
        return value

    if value is None:
        return False

    value = str(value).strip().lower()

    return value in {
        "true",
        "1",
        "yes",
        "y",
    }


def parse_integer(value, default=0):
    """
    Safely convert a spreadsheet value to an integer.
    """

    if value is None or str(value).strip() == "":
        return default

    try:
        return int(float(str(value).strip()))
    except (ValueError, TypeError):
        return default


def parse_decimal(value):
    """
    Safely convert a spreadsheet price to Decimal.
    """

    if value is None or str(value).strip() == "":
        return None

    try:
        return Decimal(str(value).strip())
    except (InvalidOperation, ValueError, TypeError):
        return None


def get_value(row, index, default=""):
    """
    Safely retrieve a column value from a spreadsheet row.
    """

    if index >= len(row):
        return default

    value = row[index]

    if value is None:
        return default

    return str(value).strip()


def normalize_header(header):
    """
    Normalize a spreadsheet header for reliable matching.

    This allows harmless formatting differences such as:

        Feature1
        Feature 1

    to be treated as the same column.
    """

    return (
        str(header)
        .strip()
        .lower()
        .replace(" ", "")
        .replace("_", "")
        .replace("-", "")
    )


def normalize_product(row, header_map):
    """
    Convert one Google Sheets row into the API product structure.
    """

    def value(column, default=""):
        normalized_column = normalize_header(column)
        index = header_map.get(normalized_column)

        if index is None:
            return default

        return get_value(
            row,
            index,
            default,
        )

    product = {
        "id": parse_integer(
            value("ID"),
            default=0,
        ),

        "name": value("Product Name"),

        "category": value("Category"),

        "subcategory": value("Subcategory"),

        "brand": value("Brand"),

        "sku": value("SKU"),

        "slug": value("Slug"),

        "unit": value("Unit"),

        "price": parse_decimal(
            value("Price")
        ),

        "compare_price": parse_decimal(
            value("Compare Price")
        ),

        "featured": parse_boolean(
            value("Featured")
        ),

        "new_arrival": parse_boolean(
            value("New Arrival")
        ),

        "active": parse_boolean(
            value("Active")
        ),

        "stock": parse_integer(
            value("Stock"),
            default=0,
        ),

        "images": [
            image
            for image in [
                value("Image 1"),
                value("Image 2"),
                value("Image 3"),
            ]
            if image
        ],

        "description": value("Description"),

        "features": [
            feature
            for feature in [
                value("Feature 1"),
                value("Feature 2"),
                value("Feature 3"),
                value("Feature 4"),
            ]
            if feature
        ],
    }

    return product


def get_products():
    """
    Read, normalize, and return active products from Google Sheets.
    """

    rows = get_sheet_values()

    if not rows:
        return []

    headers = [
        str(header).strip()
        for header in rows[0]
    ]

    header_map = {
        normalize_header(header): index
        for index, header in enumerate(headers)
    }

    missing_headers = [
        header
        for header in EXPECTED_HEADERS
        if normalize_header(header) not in header_map
    ]

    if missing_headers:
        raise RuntimeError(
            "Google Sheets catalogue is missing expected columns: "
            + ", ".join(missing_headers)
        )

    products = []

    for row in rows[1:]:
        product = normalize_product(
            row,
            header_map,
        )

        if not product["id"]:
            continue

        if not product["name"]:
            continue

        if not product["active"]:
            continue

        products.append(product)

    return products