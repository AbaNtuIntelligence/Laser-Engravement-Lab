import csv
import json
import os

CSV_FILE = "products.csv"
JSON_FILE = "public/data/products.json"

def to_bool(val):
    if not val: return False
    return str(val).strip().upper() in ("TRUE", "1", "YES")

def clean_price(val):
    if not val or not str(val).strip():
        return None
    try:
        return float(str(val).replace('R', '').replace(',', '').strip())
    except ValueError:
        return None

def clean_int(val):
    if not val or not str(val).strip():
        return 0
    try:
        return int(float(str(val).strip()))
    except ValueError:
        return 0

def clean_str(val):
    if not val or not str(val).strip():
        return None
    return str(val).strip()

products = []

print("Reading CSV...")
# Use utf-8-sig to handle Google Sheets/Excel BOM characters
with open(CSV_FILE, mode='r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    
    for row in reader:
        # Skip empty rows or rows without a Product Name
        if not row.get('Product Name') or not row['Product Name'].strip():
            continue
            
        # Build images array
        images = []
        for i in range(1, 4):
            img = row.get(f'Image {i}')
            if img and img.strip():
                images.append(img.strip())
                
        # Build features array
        features = []
        for i in range(1, 5):
            feat = row.get(f'Feature {i}')
            if feat and feat.strip():
                features.append(feat.strip())

        # Construct the product object
        product = {
            "id": clean_int(row.get('ID')),
            "name": row.get('Product Name', '').strip(),
            "category": row.get('Category', '').strip(),
            "subcategory": clean_str(row.get('Subcategory')),
            "brand": clean_str(row.get('Brand')),
            "sku": row.get('SKU', '').strip(),
            "slug": row.get('Slug', '').strip(),
            "unit": row.get('Unit', 'Each').strip(),
            "price": clean_price(row.get('Price')),
            "compare_price": clean_price(row.get('Compare Price')),
            "featured": to_bool(row.get('Featured')),
            "new_arrival": to_bool(row.get('New Arrival')),
            "active": to_bool(row.get('Active')),
            "stock": clean_int(row.get('Stock')),
            "images": images,
            "description": row.get('Description', '').strip(),
            "features": features
        }
        
        products.append(product)

# Build the final root object
output = {
    "success": True,
    "count": len(products),
    "products": products
}

# Ensure the directory exists
os.makedirs(os.path.dirname(JSON_FILE), exist_ok=True)

def clean_text(text):
    if not text: return text
    # Nuke the Mojibake
    return (text
        .replace("â€“", "–")
        .replace("â€”", "—")
        .replace("â€™", "’")
        .replace("â€œ", "“")
        .replace("â€", "”")
        .replace("Ã©", "é")
        .replace("Â ", " ")
        .replace("Â", "")
    )

# Write the JSON file
print(f"Writing {len(products)} products to {JSON_FILE}...")
with open(JSON_FILE, mode='w', encoding='utf-8') as f:
    # indent=2 makes it human-readable. Change to indent=None for a minified file.
    json.dump(output, f, indent=2, ensure_ascii=False)

print("✅ Conversion complete!")