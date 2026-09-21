"use client";

import { useState } from "react";
import ProductModal from "./ProductModal";

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

type ProductCardProps = {
  product: Product;
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

export default function ProductCard({
  product,
}: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const image = product.images?.[0] || null;

  return (
    <>
      <article className="group min-w-[220px] max-w-[220px] shrink-0 sm:min-w-[250px] sm:max-w-[250px]">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="block w-full text-left"
          aria-label={`View details for ${product.name}`}
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-[var(--store-soft)]">
            {image ? (
              <img
                src={image}
                alt={product.name}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[var(--store-soft)] px-6 text-center">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--store-muted)]">
                  Product image
                </span>
              </div>
            )}

            {product.new_arrival && (
              <span className="absolute left-3 top-3 bg-[var(--store-ink)] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
                New
              </span>
            )}
          </div>

          <div className="pt-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--store-accent)]">
              {product.category}
            </p>

            <h3 className="mt-1 text-sm font-semibold leading-snug text-[var(--store-ink)]">
              {product.name}
            </h3>

            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--store-ink)]">
                {formatPrice(product.price)}
              </span>

              {product.compare_price !== null && (
                <span className="text-xs text-[var(--store-muted)] line-through">
                  {formatPrice(product.compare_price)}
                </span>
              )}
            </div>

            {product.stock > 0 && (
              <p className="mt-2 text-[10px] font-medium text-[var(--store-muted)]">
                {product.stock} available
              </p>
            )}
          </div>
        </button>
      </article>

      {isModalOpen && (
        <ProductModal
          product={product}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}