from pathlib import Path
from PIL import Image, ImageOps

source = Path("public/images/products")
output = Path("public/images/thumbnails")

count = 0
original_bytes = 0
thumbnail_bytes = 0

for file in source.rglob("*"):
    if not file.is_file():
        continue

    if file.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
        continue

    relative = file.relative_to(source)
    destination = (output / relative).with_suffix(".webp")
    destination.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(file) as img:
        img = ImageOps.exif_transpose(img)
        img.thumbnail((480, 480), Image.Resampling.LANCZOS)

        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGBA" if "A" in img.getbands() else "RGB")

        img.save(destination, "WEBP", quality=75, method=3)

    count += 1
    print(f'Processed {count}: {file.name}', flush=True)
    original_bytes += file.stat().st_size
    thumbnail_bytes += destination.stat().st_size

print(f"Processed: {count} images")
print(f"Original size: {original_bytes / 1048576:.2f} MB")
print(f"Thumbnail size: {thumbnail_bytes / 1048576:.2f} MB")
print(f"Reduction: {(1 - thumbnail_bytes / original_bytes) * 100:.1f}%")


