from io import BytesIO
from pathlib import Path
from datetime import datetime
from xml.sax.saxutils import escape

from PIL import Image as PILImage

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    PageTemplate,
    PageBreak,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

FRONTEND_PUBLIC = BASE_DIR / "frontend" / "public"

IMAGES_DIR = FRONTEND_PUBLIC / "images"

LOGO_PATH = IMAGES_DIR / "logo.webp"


# ============================================================
# PAGE SETTINGS
# ============================================================

PAGE_WIDTH, PAGE_HEIGHT = A4

LEFT_MARGIN = 15 * mm
RIGHT_MARGIN = 15 * mm
TOP_MARGIN = 32 * mm
BOTTOM_MARGIN = 20 * mm

CONTENT_WIDTH = PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN


# ============================================================
# BRAND
# ============================================================

DARK = colors.HexColor("#171717")
INK = colors.HexColor("#242424")
GOLD = colors.HexColor("#A17A3F")
MUTED = colors.HexColor("#777777")
LIGHT = colors.HexColor("#F7F5F1")
LINE = colors.HexColor("#E3E0DA")
WHITE = colors.white


# ============================================================
# STYLES
# ============================================================

styles = getSampleStyleSheet()


COVER_TITLE = ParagraphStyle(
    "CoverTitle",
    parent=styles["Title"],
    fontName="Helvetica-Bold",
    fontSize=30,
    leading=35,
    textColor=DARK,
    alignment=TA_LEFT,
    spaceAfter=8,
)


COVER_TAGLINE = ParagraphStyle(
    "CoverTagline",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=12,
    leading=18,
    textColor=GOLD,
)


COVER_BODY = ParagraphStyle(
    "CoverBody",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=9.5,
    leading=15,
    textColor=MUTED,
)


CATEGORY_STYLE = ParagraphStyle(
    "CategoryStyle",
    parent=styles["Heading1"],
    fontName="Helvetica-Bold",
    fontSize=20,
    leading=24,
    textColor=DARK,
    spaceAfter=5,
)


SUBCATEGORY_STYLE = ParagraphStyle(
    "SubcategoryStyle",
    parent=styles["Heading2"],
    fontName="Helvetica-Bold",
    fontSize=9,
    leading=12,
    textColor=GOLD,
    spaceBefore=4,
    spaceAfter=8,
)


PRODUCT_NAME_STYLE = ParagraphStyle(
    "ProductNameStyle",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=8.5,
    leading=11,
    textColor=DARK,
)


PRODUCT_META_STYLE = ParagraphStyle(
    "ProductMetaStyle",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=6.8,
    leading=9,
    textColor=MUTED,
)


PRODUCT_PRICE_STYLE = ParagraphStyle(
    "ProductPriceStyle",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=8,
    leading=10,
    textColor=DARK,
)


PRODUCT_DESCRIPTION_STYLE = ParagraphStyle(
    "ProductDescriptionStyle",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=6.8,
    leading=9,
    textColor=MUTED,
)


PLACEHOLDER_STYLE = ParagraphStyle(
    "PlaceholderStyle",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=7,
    textColor=MUTED,
    alignment=TA_CENTER,
)


# ============================================================
# TEXT HELPERS
# ============================================================

def safe_text(value):
    if value is None:
        return ""

    return str(value).strip()


def safe_paragraph_text(value):
    """
    Escape catalogue text before putting it into ReportLab
    Paragraphs so characters such as &, < and > do not break
    the PDF.
    """

    return escape(safe_text(value))


def format_price(value):
    if value is None or value == "":
        return "Price on request"

    try:
        return f"R {float(value):,.2f}"
    except (TypeError, ValueError):
        return "Price on request"


# ============================================================
# IMAGE HELPERS
# ============================================================

def resolve_image_path(image_url):
    """
    Convert a frontend image URL into the real local file.

    Example:

        /images/products/gifts/example.webp

    becomes:

        frontend/public/images/products/gifts/example.webp
    """

    if not image_url:
        return None

    image_url = str(image_url).strip()

    if not image_url:
        return None

    # Remove query strings if present.
    image_url = image_url.split("?", 1)[0]

    # Normalise Windows / web separators.
    image_url = image_url.replace("\\", "/")

    # Remove leading slash.
    relative_path = image_url.lstrip("/")

    # If the API ever returns the full frontend path,
    # reduce it to the public-relative portion.
    if relative_path.startswith("frontend/public/"):
        relative_path = relative_path[len("frontend/public/"):]

    candidate = FRONTEND_PUBLIC / relative_path

    if candidate.exists() and candidate.is_file():
        return candidate

    return None


def image_to_jpeg_buffer(
    image_path,
    max_width_px=900,
    max_height_px=700,
    quality=82,
):
    """
    Open an image with Pillow, resize it to a sensible
    catalogue resolution, and return a compressed JPEG
    buffer suitable for ReportLab.

    Resizing before encoding keeps large source images
    from consuming excessive Render memory.
    """

    if not image_path:
        return None

    try:
        with PILImage.open(image_path) as source:

            # Convert images with transparency safely
            # onto a white background.
            if source.mode in ("RGBA", "LA") or (
                source.mode == "P"
                and "transparency" in source.info
            ):
                source = source.convert("RGBA")

                background = PILImage.new(
                    "RGB",
                    source.size,
                    "white",
                )

                background.paste(
                    source,
                    mask=source.getchannel("A"),
                )

                image = background

            else:
                image = source.convert("RGB")

            # Resize BEFORE JPEG encoding.
            image.thumbnail(
                (
                    max_width_px,
                    max_height_px,
                ),
                PILImage.Resampling.LANCZOS,
            )

            buffer = BytesIO()

            image.save(
                buffer,
                format="JPEG",
                quality=quality,
                optimize=True,
            )

            buffer.seek(0)

            # Explicitly detach the Pillow image from the
            # source before returning the buffer.
            image.close()

            return buffer

    except Exception as error:

        print(
            f"[PDF] Could not process image "
            f"{image_path}: {error}"
        )

        return None


def create_product_image(image_url):
    """
    Create a product image that fits inside a fixed
    catalogue image area without stretching.

    Source images are resized before being passed to
    ReportLab to reduce memory consumption.
    """

    image_path = resolve_image_path(image_url)

    if not image_path:

        print(
            f"[PDF] Image not found: {image_url}"
        )

        return None

    buffer = image_to_jpeg_buffer(
        image_path,
        max_width_px=900,
        max_height_px=700,
        quality=82,
    )

    if not buffer:
        return None

    try:

        with PILImage.open(buffer) as source:

            original_width, original_height = source.size

        max_width = 76 * mm
        max_height = 60 * mm

        width_ratio = (
            max_width / original_width
        )

        height_ratio = (
            max_height / original_height
        )

        scale = min(
            width_ratio,
            height_ratio,
        )

        final_width = (
            original_width * scale
        )

        final_height = (
            original_height * scale
        )

        buffer.seek(0)

        image = Image(
            buffer,
            width=final_width,
            height=final_height,
        )

        image.hAlign = "CENTER"

        return image

    except Exception as error:

        print(
            f"[PDF] Could not create ReportLab image "
            f"for {image_path}: {error}"
        )

        buffer.close()

        return None


def create_image_area(image_url):
    """
    Create a fixed-size product image area.

    The actual image is centred inside the area and keeps
    its original aspect ratio.
    """

    product_image = create_product_image(
        image_url
    )

    if product_image:

        image_table = Table(
            [[product_image]],
            colWidths=[78 * mm],
            rowHeights=[62 * mm],
        )

        image_table.setStyle(
            TableStyle(
                [
                    (
                        "BACKGROUND",
                        (0, 0),
                        (-1, -1),
                        LIGHT,
                    ),
                    (
                        "BOX",
                        (0, 0),
                        (-1, -1),
                        0.5,
                        LINE,
                    ),
                    (
                        "VALIGN",
                        (0, 0),
                        (-1, -1),
                        "MIDDLE",
                    ),
                    (
                        "ALIGN",
                        (0, 0),
                        (-1, -1),
                        "CENTER",
                    ),
                    (
                        "LEFTPADDING",
                        (0, 0),
                        (-1, -1),
                        1 * mm,
                    ),
                    (
                        "RIGHTPADDING",
                        (0, 0),
                        (-1, -1),
                        1 * mm,
                    ),
                    (
                        "TOPPADDING",
                        (0, 0),
                        (-1, -1),
                        1 * mm,
                    ),
                    (
                        "BOTTOMPADDING",
                        (0, 0),
                        (-1, -1),
                        1 * mm,
                    ),
                ]
            )
        )

        return image_table

    placeholder = Table(
        [
            [
                Paragraph(
                    "PRODUCT IMAGE",
                    PLACEHOLDER_STYLE,
                )
            ]
        ],
        colWidths=[78 * mm],
        rowHeights=[62 * mm],
    )

    placeholder.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, -1),
                    LIGHT,
                ),
                (
                    "BOX",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    LINE,
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
            ]
        )
    )

    return placeholder


# ============================================================
# HEADER / FOOTER
# ============================================================

def draw_header_footer(canvas_obj, document):
    canvas_obj.saveState()

    # --------------------------------------------------------
    # Header
    # --------------------------------------------------------

    header_y = PAGE_HEIGHT - TOP_MARGIN + 7 * mm

    canvas_obj.setStrokeColor(LINE)
    canvas_obj.setLineWidth(0.5)

    canvas_obj.line(
        LEFT_MARGIN,
        PAGE_HEIGHT - TOP_MARGIN + 1 * mm,
        PAGE_WIDTH - RIGHT_MARGIN,
        PAGE_HEIGHT - TOP_MARGIN + 1 * mm,
    )

    # --------------------------------------------------------
    # Logo
    # --------------------------------------------------------

    if LOGO_PATH.exists():

        logo_buffer = image_to_png_buffer(LOGO_PATH)

        if logo_buffer:

            try:

                logo_reader = ImageReader(logo_buffer)

                canvas_obj.drawImage(
                    logo_reader,
                    LEFT_MARGIN,
                    header_y - 13 * mm,
                    width=27 * mm,
                    height=15 * mm,
                    preserveAspectRatio=True,
                    anchor="sw",
                    mask="auto",
                )

            except Exception as error:

                print(
                    f"[PDF] Header logo error: {error}"
                )

def image_to_png_buffer(image_path):
    """
    Backwards-compatible image helper used by the
    existing header and cover code.

    Despite the historical name, this now returns
    an optimized JPEG buffer.
    """

    return image_to_jpeg_buffer(
        image_path,
        max_width_px=1200,
        max_height_px=900,
        quality=85,
    )


    # --------------------------------------------------------
    # Brand
    # --------------------------------------------------------

    canvas_obj.setFillColor(DARK)

    canvas_obj.setFont(
        "Helvetica-Bold",
        9,
    )

    canvas_obj.drawString(
        LEFT_MARGIN + 32 * mm,
        header_y - 5 * mm,
        "LASER ENGRAVING STORE",
    )

    canvas_obj.setFillColor(GOLD)

    canvas_obj.setFont(
        "Helvetica",
        6.5,
    )

    canvas_obj.drawString(
        LEFT_MARGIN + 32 * mm,
        header_y - 9 * mm,
        "Custom products. Built to be remembered.",
    )

    # --------------------------------------------------------
    # Catalogue label
    # --------------------------------------------------------

    canvas_obj.setFillColor(MUTED)

    canvas_obj.setFont(
        "Helvetica-Bold",
        6,
    )

    canvas_obj.drawRightString(
        PAGE_WIDTH - RIGHT_MARGIN,
        header_y - 7 * mm,
        "PRODUCT CATALOGUE",
    )

    # --------------------------------------------------------
    # Footer
    # --------------------------------------------------------

    canvas_obj.setStrokeColor(LINE)

    canvas_obj.line(
        LEFT_MARGIN,
        14 * mm,
        PAGE_WIDTH - RIGHT_MARGIN,
        14 * mm,
    )

    canvas_obj.setFillColor(MUTED)

    canvas_obj.setFont(
        "Helvetica",
        6,
    )

    canvas_obj.drawString(
        LEFT_MARGIN,
        8 * mm,
        "Laser Engraving Store",
    )

    canvas_obj.drawCentredString(
        PAGE_WIDTH / 2,
        8 * mm,
        "118 High Street, Turffontein, Johannesburg, Gauteng 2190",
    )

    canvas_obj.drawRightString(
        PAGE_WIDTH - RIGHT_MARGIN,
        8 * mm,
        f"Page {document.page}",
    )

    canvas_obj.restoreState()


# ============================================================
# PRODUCT CARD
# ============================================================

def build_product_card(product):

    name = safe_text(product.get("name"))
    category = safe_text(product.get("category"))
    subcategory = safe_text(product.get("subcategory"))
    sku = safe_text(product.get("sku"))
    description = safe_text(product.get("description"))

    price = format_price(
        product.get("price")
    )

    images = product.get("images") or []

    first_image = None

    if images:
        first_image = images[0]

    image_area = create_image_area(
        first_image
    )

    content = [
        image_area,
        Spacer(1, 3 * mm),
        Paragraph(
            safe_paragraph_text(
                name or "Unnamed Product"
            ),
            PRODUCT_NAME_STYLE,
        ),
        Spacer(1, 1 * mm),
    ]

    meta = []

    if category:
        meta.append(
            safe_paragraph_text(category)
        )

    if subcategory:
        meta.append(
            safe_paragraph_text(subcategory)
        )

    if meta:

        content.extend(
            [
                Paragraph(
                    " • ".join(meta),
                    PRODUCT_META_STYLE,
                ),
                Spacer(1, 1 * mm),
            ]
        )

    if sku:

        content.extend(
            [
                Paragraph(
                    f"SKU: {safe_paragraph_text(sku)}",
                    PRODUCT_META_STYLE,
                ),
                Spacer(1, 1 * mm),
            ]
        )

    content.append(
        Paragraph(
            safe_paragraph_text(price),
            PRODUCT_PRICE_STYLE,
        )
    )

    if description:

        content.extend(
            [
                Spacer(1, 1 * mm),
                Paragraph(
                    safe_paragraph_text(description),
                    PRODUCT_DESCRIPTION_STYLE,
                ),
            ]
        )

    card = Table(
        [[content]],
        colWidths=[82 * mm],
    )

    card.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, -1),
                    WHITE,
                ),
                (
                    "BOX",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    LINE,
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    2 * mm,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    2 * mm,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    2 * mm,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    3 * mm,
                ),
            ]
        )
    )

    return card


# ============================================================
# GROUP PRODUCTS
# ============================================================

def group_products(products):

    grouped = {}

    for product in products:

        category = (
            safe_text(product.get("category"))
            or "Other"
        )

        subcategory = (
            safe_text(product.get("subcategory"))
            or "General"
        )

        grouped.setdefault(
            category,
            {}
        )

        grouped[category].setdefault(
            subcategory,
            []
        )

        grouped[category][subcategory].append(
            product
        )

    preferred_order = [
        "Corporate",
        "Custom",
        "Gifts",
        "Home",
        "Jewellery",
    ]

    ordered = {}

    for category in preferred_order:

        if category in grouped:
            ordered[category] = grouped[category]

    for category in sorted(grouped):

        if category not in ordered:
            ordered[category] = grouped[category]

    return ordered


# ============================================================
# COVER PAGE
# ============================================================

def build_cover(story, product_count):

    story.append(
        Spacer(
            1,
            18 * mm,
        )
    )

    # --------------------------------------------------------
    # Large logo
    # --------------------------------------------------------

    if LOGO_PATH.exists():

        logo_buffer = image_to_png_buffer(
            LOGO_PATH
        )

        if logo_buffer:

            logo = Image(
                logo_buffer,
                width=55 * mm,
                height=30 * mm,
            )

            logo.hAlign = "LEFT"

            story.append(logo)

    story.append(
        Spacer(
            1,
            14 * mm,
        )
    )

    # --------------------------------------------------------
    # Company name
    # --------------------------------------------------------

    story.append(
        Paragraph(
            "LASER ENGRAVING STORE",
            COVER_TITLE,
        )
    )

    story.append(
        Paragraph(
            "Custom products. Built to be remembered.",
            COVER_TAGLINE,
        )
    )

    story.append(
        Spacer(
            1,
            12 * mm,
        )
    )

    story.append(
        Paragraph(
            "PRODUCT CATALOGUE",
            ParagraphStyle(
                "CatalogueHeading",
                parent=COVER_TITLE,
                fontSize=17,
                leading=21,
                textColor=GOLD,
                spaceAfter=8,
            ),
        )
    )

    story.append(
        Paragraph(
            "Personalised gifts, engraved products, "
            "corporate pieces and custom designs.",
            COVER_BODY,
        )
    )

    story.append(
        Spacer(
            1,
            15 * mm,
        )
    )

    # --------------------------------------------------------
    # Company information box
    # --------------------------------------------------------

    contact_content = [
        Paragraph(
            "<b>OUR ADDRESS</b>",
            PRODUCT_NAME_STYLE,
        ),
        Spacer(1, 2 * mm),
        Paragraph(
            "118 High Street<br/>"
            "Turffontein<br/>"
            "Johannesburg<br/>"
            "Gauteng 2190",
            COVER_BODY,
        ),
    ]

    contact_details = [
        Paragraph(
            "<b>CONTACT</b>",
            PRODUCT_NAME_STYLE,
        ),
        Spacer(1, 2 * mm),
        Paragraph(
            "Tel: 011 681 0465<br/>"
            "WhatsApp: 071 629 9701",
            COVER_BODY,
        ),
    ]

    catalogue_info = [
        Paragraph(
            "<b>CATALOGUE</b>",
            PRODUCT_NAME_STYLE,
        ),
        Spacer(1, 2 * mm),
        Paragraph(
            f"{product_count} products<br/>"
            "Quote-based ordering",
            COVER_BODY,
        ),
    ]

    info_table = Table(
        [
            [
                contact_content,
                contact_details,
                catalogue_info,
            ]
        ],
        colWidths=[
            58 * mm,
            58 * mm,
            58 * mm,
        ],
    )

    info_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, -1),
                    LIGHT,
                ),
                (
                    "BOX",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    LINE,
                ),
                (
                    "INNERGRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    LINE,
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "TOP",
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    5 * mm,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    5 * mm,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    5 * mm,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    5 * mm,
                ),
            ]
        )
    )

    story.append(info_table)

    story.append(
        Spacer(
            1,
            16 * mm,
        )
    )

    generated = datetime.now().strftime(
        "%d %B %Y"
    )

    story.append(
        Paragraph(
            f"Catalogue generated {generated}",
            PRODUCT_META_STYLE,
        )
    )

    story.append(
        Spacer(
            1,
            5 * mm,
        )
    )

    story.append(
        Paragraph(
            "All products are supplied on a quotation basis. "
            "Personalisation, engraving, quantities and final "
            "pricing are confirmed when your quotation is prepared.",
            COVER_BODY,
        )
    )


# ============================================================
# MAIN PDF GENERATOR
# ============================================================

def build_catalogue_pdf(products):

    buffer = BytesIO()

    document = BaseDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=LEFT_MARGIN,
        rightMargin=RIGHT_MARGIN,
        topMargin=TOP_MARGIN,
        bottomMargin=BOTTOM_MARGIN,
        title="Laser Engraving Store Product Catalogue",
        author="Laser Engraving Store",
    )

    frame = Frame(
        LEFT_MARGIN,
        BOTTOM_MARGIN,
        CONTENT_WIDTH,
        PAGE_HEIGHT - TOP_MARGIN - BOTTOM_MARGIN,
        id="catalogue-frame",
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )

    document.addPageTemplates(
        [
            PageTemplate(
                id="catalogue",
                frames=[frame],
                onPage=draw_header_footer,
            )
        ]
    )

    story = []

    # --------------------------------------------------------
    # COVER
    # --------------------------------------------------------

    build_cover(
        story,
        len(products),
    )

    story.append(
        PageBreak()
    )

    # --------------------------------------------------------
    # PRODUCTS
    # --------------------------------------------------------

    grouped = group_products(products)

    for category, subcategories in grouped.items():

        story.append(
            Paragraph(
                safe_paragraph_text(
                    category.upper()
                ),
                CATEGORY_STYLE,
            )
        )

        for subcategory, category_products in subcategories.items():

            story.append(
                Paragraph(
                    safe_paragraph_text(
                        subcategory.upper()
                    ),
                    SUBCATEGORY_STYLE,
                )
            )

            cards = [
                build_product_card(product)
                for product in category_products
            ]

            for index in range(
                0,
                len(cards),
                2,
            ):

                first_card = cards[index]

                second_card = (
                    cards[index + 1]
                    if index + 1 < len(cards)
                    else ""
                )

                product_row = Table(
                    [
                        [
                            first_card,
                            second_card,
                        ]
                    ],
                    colWidths=[
                        86 * mm,
                        86 * mm,
                    ],
                )

                product_row.setStyle(
                    TableStyle(
                        [
                            (
                                "VALIGN",
                                (0, 0),
                                (-1, -1),
                                "TOP",
                            ),
                            (
                                "LEFTPADDING",
                                (0, 0),
                                (-1, -1),
                                0,
                            ),
                            (
                                "RIGHTPADDING",
                                (0, 0),
                                (-1, -1),
                                2 * mm,
                            ),
                            (
                                "TOPPADDING",
                                (0, 0),
                                (-1, -1),
                                0,
                            ),
                            (
                                "BOTTOMPADDING",
                                (0, 0),
                                (-1, -1),
                                5 * mm,
                            ),
                        ]
                    )
                )

                story.append(
                    product_row
                )

    # --------------------------------------------------------
    # BUILD
    # --------------------------------------------------------

    document.build(story)

    buffer.seek(0)

    return buffer