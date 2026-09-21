"use client";

import { useEffect, useState } from "react";
import { addToQuote } from "@/services/quoteBasket";

type Product = {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  brand: string | null;
  sku: string;
  slug: string;
  unit: string;
  price: number | null;
  compare_price: number | null;
  featured: boolean;
  new_arrival: boolean;
  active: boolean;
  stock: number;
  images: string[];
  description: string;
  features: string[];
};

type ProductModalProps = {
  product: Product;
  onClose: () => void;
};

function formatPrice(price: number | null) {
  if (price === null) {
    return "Price on request";
  }

  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 2,
  }).format(price);
}

export default function ProductModal({
  product,
  onClose,
}: ProductModalProps) {
  const [addedToQuote, setAddedToQuote] = useState(false);
  const images = product.images?.filter(Boolean) || [];
  const [selectedImage, setSelectedImage] = useState(0);

  const activeImage = images[selectedImage] || null;

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`product-modal-${product.id}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative flex max-h-[96vh] w-full flex-col overflow-hidden bg-[var(--store-paper)] shadow-2xl sm:max-w-6xl sm:flex-row">

        {/* Close */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl font-light leading-none text-[var(--store-ink)] shadow-md transition hover:bg-[var(--store-soft)]"
        >
          ×
        </button>

        {/* IMAGE AREA */}

        <div className="flex w-full shrink-0 flex-col bg-[var(--store-soft)] sm:w-[52%]">

          {/* Main image */}

          <div className="relative flex min-h-[320px] flex-1 items-center justify-center p-5 sm:min-h-[620px] sm:p-10">

            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="flex h-full min-h-[280px] w-full items-center justify-center">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--store-muted)]">
                  Product image
                </span>
              </div>
            )}

            {product.new_arrival && (
              <span className="absolute left-5 top-5 bg-[var(--store-ink)] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
                New arrival
              </span>
            )}

          </div>

          {/* Image thumbnails */}

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto border-t border-black/5 bg-[var(--store-paper)] p-4 sm:p-5">

              {images.map((image, index) => (
                <button
                  key={`${product.id}-image-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  aria-label={`View product image ${index + 1}`}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden border-2 bg-[var(--store-soft)] transition ${
                    selectedImage === index
                      ? "border-[var(--store-ink)]"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}

            </div>
          )}

        </div>

        {/* PRODUCT DETAILS */}

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">

          <div className="p-6 sm:p-10">

            <div className="pr-10">

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-accent)]">
                {product.category}

                {product.subcategory && (
                  <>
                    <span className="mx-2 text-[var(--store-muted)]">
                      /
                    </span>

                    {product.subcategory}
                  </>
                )}
              </p>

              <h2
                id={`product-modal-${product.id}`}
                className="mt-3 max-w-xl text-2xl font-semibold leading-tight text-[var(--store-ink)] sm:text-3xl"
              >
                {product.name}
              </h2>

            </div>

            {/* Price */}

            <div className="mt-6 flex flex-wrap items-center gap-3">

              <span className="text-2xl font-bold text-[var(--store-ink)]">
                {formatPrice(product.price)}
              </span>

              {product.compare_price !== null && (
                <span className="text-sm text-[var(--store-muted)] line-through">
                  {formatPrice(product.compare_price)}
                </span>
              )}

            </div>

            {/* Availability */}

            <div className="mt-3">

              {product.stock > 0 ? (
                <p className="text-xs font-medium text-[var(--store-muted)]">
                  {product.stock} available
                </p>
              ) : (
                <p className="text-xs font-medium text-[var(--store-muted)]">
                  Made to order
                </p>
              )}

            </div>

            <div className="my-8 h-px bg-[var(--store-line)]" />

            {/* Description */}

            <section>

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--store-muted)]">
                About this piece
              </p>

              <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--store-ink)]">
                {product.description}
              </p>

            </section>

            {/* Features */}

            {product.features?.length > 0 && (
              <section className="mt-8">

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--store-muted)]">
                  Product details
                </p>

                <ul className="mt-4 space-y-3">

                  {product.features.map((feature, index) => (
                    <li
                      key={`${product.id}-feature-${index}`}
                      className="flex gap-3 text-sm leading-6 text-[var(--store-ink)]"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--store-accent)]" />

                      <span>
                        {feature}
                      </span>
                    </li>
                  ))}

                </ul>

              </section>
            )}

            {/* Product metadata */}

            <div className="mt-8 grid grid-cols-2 gap-5 border-t border-[var(--store-line)] pt-6">

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--store-muted)]">
                  SKU
                </p>

                <p className="mt-1 text-xs font-semibold text-[var(--store-ink)]">
                  {product.sku}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--store-muted)]">
                  Sold as
                </p>

                <p className="mt-1 text-xs font-semibold capitalize text-[var(--store-ink)]">
                  {product.unit}
                </p>
              </div>

            </div>

          </div>

          {/* ACTION */}

          <div className="mt-auto border-t border-[var(--store-line)] bg-[var(--store-paper)] p-6 sm:p-8">

            <button
  type="button"
  onClick={() => {
    addToQuote({
      id: product.id,
      name: product.name,
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      sku: product.sku,
      slug: product.slug,
      unit: product.unit,
      price: product.price,
      compare_price: product.compare_price,
      images: product.images,
      description: product.description,
    });

    setAddedToQuote(true);
  }}
  className="w-full bg-[var(--store-ink)] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:opacity-90"
>
  {addedToQuote ? "Added to quote ✓" : "Add to quote"}
</button>

            <p className="mt-3 text-center text-[10px] leading-5 text-[var(--store-muted)]">
              Personalised engraving options can be discussed before your
              order is confirmed.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}