
"use client";

import { useState } from "react";
import ProductModal from "./ProductModal";
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

export default function ProductCard({
  product,
}: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addedToQuote, setAddedToQuote] = useState(false);

  const image = product.images?.[0] || null;

  function handleAddToQuote() {
    addToQuote({
      id: product.id,
      name: product.name,
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      sku: product.sku,
      slug: product.slug,
      unit: product.unit,
      images: product.images,
      description: product.description,
    });

    setAddedToQuote(true);
  }

  return (
    <>
      <article className="group flex h-[470px] w-[220px] min-w-[220px] max-w-[220px] shrink-0 flex-col overflow-hidden bg-white sm:w-[250px] sm:min-w-[250px] sm:max-w-[250px]">

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="block w-full text-left"
          aria-label={`View details for ${product.name}`}
        >
          <div className="relative h-[260px] w-full overflow-hidden bg-white sm:h-[300px]">
            {image ? (
              <img
                src={image}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain bg-white p-3 transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white px-6 text-center">
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

            <h3 className="mt-1 line-clamp-2 min-h-[40px] text-sm font-semibold leading-snug text-[var(--store-ink)]">
              {product.name}
            </h3>

            {product.stock > 0 && (
              <p className="mt-2 text-[10px] font-medium text-[var(--store-muted)]">
                {product.stock} available
              </p>
            )}
          </div>
        </button>

        <div className="mt-auto w-full pt-3">
          <button
            type="button"
            onClick={handleAddToQuote}
            className="w-full bg-[var(--store-ink)] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:opacity-90"
          >
            {addedToQuote ? "Added to quote ✓" : "Add to quote"}
          </button>
        </div>

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
