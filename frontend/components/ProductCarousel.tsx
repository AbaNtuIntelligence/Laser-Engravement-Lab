"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "@/services/api";

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

type ProductCarouselProps = {
  eyebrow: string;
  title: string;
  category?: string;
  featured?: boolean;
  newArrival?: boolean;
};



export default function ProductCarousel({
  eyebrow,
  title,
  category,
  featured,
  newArrival,
}: ProductCarouselProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const railRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts({
          category,
          featured,
          new_arrival: newArrival,
        });

        if (mounted) {
          setProducts(data.products || []);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load products."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [category, featured, newArrival]);

  function updateScrollState() {
    const rail = railRef.current;

    if (!rail) return;

    const maxScrollLeft =
      rail.scrollWidth - rail.clientWidth;

    setCanScrollLeft(rail.scrollLeft > 5);
    setCanScrollRight(
      rail.scrollLeft < maxScrollLeft - 5
    );
  }

  useEffect(() => {
    const rail = railRef.current;

    if (!rail || products.length === 0) return;

    updateScrollState();

    rail.addEventListener(
      "scroll",
      updateScrollState,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateScrollState
    );

    return () => {
      rail.removeEventListener(
        "scroll",
        updateScrollState
      );

      window.removeEventListener(
        "resize",
        updateScrollState
      );
    };
  }, [products]);

  function scrollRail(direction: "left" | "right") {
    const rail = railRef.current;

    if (!rail) return;

    const amount = Math.max(
      rail.clientWidth * 0.8,
      300
    );

    rail.scrollBy({
      left:
        direction === "right"
          ? amount
          : -amount,
      behavior: "smooth",
    });
  }

  

  

  return (
    <section className="store-section">
      <div className="store-container">

        {/* SECTION HEADER */}

        <div className="mb-7 flex items-end justify-between gap-6">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-accent)]">
              {eyebrow}
            </p>

            <h2 className="store-heading mt-2">
              {title}
            </h2>
          </div>

          {!loading &&
            !error &&
            products.length > 0 && (
              <div className="flex shrink-0 items-center gap-2">

                <button
                  type="button"
                  onClick={() =>
                    scrollRail("left")
                  }
                  disabled={!canScrollLeft}
                  aria-label={`Previous ${title}`}
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    border border-[var(--store-line)]
                    bg-white
                    text-lg
                    text-[var(--store-ink)]
                    transition-all
                    hover:border-[var(--store-ink)]
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={() =>
                    scrollRail("right")
                  }
                  disabled={!canScrollRight}
                  aria-label={`Next ${title}`}
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    border border-[var(--store-line)]
                    bg-white
                    text-lg
                    text-[var(--store-ink)]
                    transition-all
                    hover:border-[var(--store-ink)]
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  →
                </button>

              </div>
            )}

        </div>

        {/* LOADING */}

        {loading && (
          <div className="store-horizontal-rail">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  min-w-[220px]
                  max-w-[220px]
                  shrink-0
                  sm:min-w-[250px]
                  sm:max-w-[250px]
                "
              >
                <div className="aspect-[4/5] animate-pulse bg-[var(--store-soft)]" />

                <div className="mt-4 h-2 w-20 animate-pulse bg-[var(--store-soft)]" />

                <div className="mt-2 h-4 w-40 animate-pulse bg-[var(--store-soft)]" />
              </div>
            ))}

          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="border border-[var(--store-line)] bg-[var(--store-paper)] px-5 py-8">

            <p className="text-sm font-semibold text-[var(--store-ink)]">
              Catalogue unavailable
            </p>

            <p className="mt-2 text-xs text-[var(--store-muted)]">
              {error}
            </p>

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="border border-[var(--store-line)] bg-[var(--store-paper)] px-5 py-8">

              <p className="text-sm font-semibold text-[var(--store-ink)]">
                No products found
              </p>

              <p className="mt-2 text-xs text-[var(--store-muted)]">
                Products matching this collection will appear here.
              </p>

            </div>
          )}

        {/* PRODUCTS */}

        {!loading &&
          !error &&
          products.length > 0 && (
            <div
              ref={railRef}
              className="
                store-horizontal-rail
                scroll-smooth
                snap-x
                snap-mandatory
              "
            >
              {products.map((product, index) => (
  <div
    key={product.id}
    className="snap-start"
  >
   <ProductCard
  product={product}
/>
  </div>
))}
            </div>
          )}

      </div>
    </section>
  );
}