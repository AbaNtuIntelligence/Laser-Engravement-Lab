"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

const MASK_FADE = 32;
const SKELETON_PULSE =
  "animate-[pulse_2.4s_cubic-bezier(0.4,0,0.6,1)_infinite]";

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
  const [progress, setProgress] = useState(0);
  const [visibleRatio, setVisibleRatio] = useState(1);

  /* --------------------------------------------------------------- */
  /* Data                                                            */
  /* --------------------------------------------------------------- */
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
            err instanceof Error ? err.message : "Unable to load products."
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

  /* --------------------------------------------------------------- */
  /* Scroll state                                                    */
  /* --------------------------------------------------------------- */
  const updateScrollState = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;

    const max = rail.scrollWidth - rail.clientWidth;
    const pos = rail.scrollLeft;

    setCanScrollLeft(pos > 4);
    setCanScrollRight(pos < max - 4);
    setProgress(max > 0 ? Math.min(1, Math.max(0, pos / max)) : 1);
    setVisibleRatio(
      rail.scrollWidth > 0
        ? Math.min(1, rail.clientWidth / rail.scrollWidth)
        : 1
    );
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || products.length === 0) return;

    rail.scrollLeft = 0;
    updateScrollState();

    const ro = new ResizeObserver(updateScrollState);
    ro.observe(rail);

    // Catch late layout shifts (fonts, images, etc.)
    const settle = window.setTimeout(updateScrollState, 400);

    rail.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      ro.disconnect();
      window.clearTimeout(settle);
      rail.removeEventListener("scroll", updateScrollState);
    };
  }, [products, updateScrollState]);

  /* --------------------------------------------------------------- */
  /* Navigation                                                      */
  /* --------------------------------------------------------------- */
  const scrollRail = useCallback((direction: "left" | "right") => {
    const rail = railRef.current;
    if (!rail) return;

    const amount = Math.max(rail.clientWidth * 0.85, 300);

    rail.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  }, []);

  /* --------------------------------------------------------------- */
  /* Edge mask                                                       */
  /* --------------------------------------------------------------- */
  const maskImage = useMemo(() => {
    if (!canScrollLeft && !canScrollRight) return undefined;

    const clear = "rgba(0,0,0,0)";
    const ink = "#000";

    if (canScrollLeft && canScrollRight) {
      return `linear-gradient(to right, ${clear} 0, ${ink} ${MASK_FADE}px, ${ink} calc(100% - ${MASK_FADE}px), ${clear} 100%)`;
    }
    if (canScrollLeft) {
      return `linear-gradient(to right, ${clear} 0, ${ink} ${MASK_FADE}px, ${ink} 100%)`;
    }
    return `linear-gradient(to right, ${ink} 0, ${ink} calc(100% - ${MASK_FADE}px), ${clear} 100%)`;
  }, [canScrollLeft, canScrollRight]);

  const hasProducts = !loading && !error && products.length > 0;
  const itemLabel = products.length === 1 ? "Item" : "Items";

  const thumbWidthPct = Math.max(visibleRatio * 100, 8);
  const thumbLeftPct = progress * (100 - thumbWidthPct);

  /* --------------------------------------------------------------- */
  /* Render                                                          */
  /* --------------------------------------------------------------- */
  return (
    <section
      className="store-section"
      aria-roledescription="carousel"
      aria-label={title}
    >
      <div className="store-container">
        {/* HEADER */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-accent)]">
              <span
                aria-hidden="true"
                className="inline-block h-px w-5 bg-[var(--store-accent)]"
              />
              {eyebrow}
            </p>

            <h2 className="store-heading mt-3 text-balance">{title}</h2>
          </div>

          {hasProducts && (
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollRail("left")}
                disabled={!canScrollLeft}
                aria-label={`Previous ${title}`}
                className="
                  group flex h-11 w-11 items-center justify-center
                  border border-[var(--store-line)] bg-transparent
                  text-[var(--store-ink)]
                  transition-colors duration-300 ease-out
                  hover:border-[var(--store-ink)]
                  hover:bg-[var(--store-ink)] hover:text-white
                  focus-visible:outline-none focus-visible:ring-1
                  focus-visible:ring-[var(--store-ink)] focus-visible:ring-offset-2
                  disabled:pointer-events-none disabled:opacity-25
                "
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-out group-hover:-translate-x-0.5"
                >
                  <path d="M11 7H3" />
                  <path d="M6 4 3 7l3 3" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => scrollRail("right")}
                disabled={!canScrollRight}
                aria-label={`Next ${title}`}
                className="
                  group flex h-11 w-11 items-center justify-center
                  border border-[var(--store-line)] bg-transparent
                  text-[var(--store-ink)]
                  transition-colors duration-300 ease-out
                  hover:border-[var(--store-ink)]
                  hover:bg-[var(--store-ink)] hover:text-white
                  focus-visible:outline-none focus-visible:ring-1
                  focus-visible:ring-[var(--store-ink)] focus-visible:ring-offset-2
                  disabled:pointer-events-none disabled:opacity-25
                "
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                >
                  <path d="M3 7h8" />
                  <path d="M8 4l3 3-3 3" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="store-horizontal-rail">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="min-w-[220px] max-w-[220px] shrink-0 sm:min-w-[250px] sm:max-w-[250px]"
              >
                <div
                  className={`aspect-[4/5] bg-[var(--store-soft)] ${SKELETON_PULSE}`}
                />
                <div
                  className={`mt-4 h-2 w-16 bg-[var(--store-soft)] ${SKELETON_PULSE}`}
                />
                <div
                  className={`mt-2 h-3 w-44 bg-[var(--store-soft)] ${SKELETON_PULSE}`}
                />
                <div
                  className={`mt-3 h-2 w-12 bg-[var(--store-soft)] ${SKELETON_PULSE}`}
                />
              </div>
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="flex items-start gap-4 border border-[var(--store-line)] bg-[var(--store-paper)] p-6 sm:p-8">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-[var(--store-line)] font-mono text-[11px] text-[var(--store-ink)]"
            >
              !
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-tight text-[var(--store-ink)]">
                Catalogue unavailable
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--store-muted)]">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && products.length === 0 && (
          <div className="flex items-start gap-4 border border-[var(--store-line)] bg-[var(--store-paper)] p-6 sm:p-8">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-[var(--store-line)] font-mono text-[11px] text-[var(--store-muted)]"
            >
              —
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-tight text-[var(--store-ink)]">
                No products found
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--store-muted)]">
                Products matching this collection will appear here.
              </p>
            </div>
          </div>
        )}

        {/* RAIL */}
        {hasProducts && (
          <div
            ref={railRef}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                scrollRail("right");
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                scrollRail("left");
              }
            }}
            role="group"
            aria-label={`${title} products`}
            className="
              store-horizontal-rail scroll-smooth snap-x snap-mandatory
              overscroll-x-contain
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
              outline-none focus-visible:outline focus-visible:outline-1
              focus-visible:outline-offset-4 focus-visible:outline-[var(--store-ink)]
            "
            style={{ maskImage, WebkitMaskImage: maskImage }}
          >
            {products.map((product) => (
              <div key={product.id} className="snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* PROGRESS + COUNT */}
        {hasProducts && (
          <div className="mt-8 flex items-center gap-5">
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
              aria-label="Carousel position"
              className="relative h-px flex-1 overflow-hidden bg-[var(--store-line)]"
            >
              <span
                className="absolute inset-y-0 bg-[var(--store-ink)]"
                style={{
                  width: `${thumbWidthPct}%`,
                  left: `${thumbLeftPct}%`,
                }}
              />
            </div>

            <span className="shrink-0 tabular-nums text-[10px] uppercase tracking-[0.18em] text-[var(--store-muted)]">
              {String(products.length).padStart(2, "0")} {itemLabel}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}