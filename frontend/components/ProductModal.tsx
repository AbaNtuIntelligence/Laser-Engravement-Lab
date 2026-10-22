"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

type ProductModalProps = {
  product: Product;
  onClose: () => void;
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const CLOSE_DELAY = 300;

export default function ProductModal({
  product,
  onClose,
}: ProductModalProps) {
  const [addedToQuote, setAddedToQuote] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const images = useMemo(
    () => product.images?.filter(Boolean) ?? [],
    [product.images]
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const activeImage = images[selectedImage] ?? null;
  const hasMultiple = images.length > 1;

  const modalRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const triggerRef = useRef<HTMLElement | null>(null);

  /* ------------------------------------------------------------- */
  /* Mount / close animation                                       */
  /* ------------------------------------------------------------- */
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const requestClose = useCallback(() => {
    setIsClosing((closing) => {
      if (closing) return closing;
      window.setTimeout(onClose, CLOSE_DELAY);
      return true;
    });
  }, [onClose]);

  const isOpen = isMounted && !isClosing;

  /* ------------------------------------------------------------- */
  /* Focus management                                              */
  /* ------------------------------------------------------------- */
  useEffect(() => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    return () => {
      triggerRef.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const id = window.setTimeout(() => {
      const modal = modalRef.current;
      if (!modal) return;
      const focusable =
        modal.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      (focusable[0] ?? modal).focus({ preventScroll: true });
      // Prefer focusing the dialog itself; fall through if missing.
      if (document.activeElement === focusable[0]) {
        // no-op; keeps intent explicit
      }
    }, 40);

    return () => window.clearTimeout(id);
  }, [isMounted]);

  /* ------------------------------------------------------------- */
  /* Image helpers                                                 */
  /* ------------------------------------------------------------- */
  const goPrev = useCallback(() => {
    setSelectedImage((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = useCallback(() => {
    setSelectedImage((i) => (i + 1) % images.length);
  }, [images.length]);


  // Keep active thumb in view
  useEffect(() => {
    if (!hasMultiple) return;
    thumbRefs.current[selectedImage]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [selectedImage, hasMultiple]);

  /* ------------------------------------------------------------- */
  /* Global listeners: keys, focus trap, body lock                 */
  /* ------------------------------------------------------------- */
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }

      const target = event.target as HTMLElement | null;
      const isEditable =
        target?.closest(
          'input, textarea, select, [contenteditable="true"]'
        ) ?? null;

      if (hasMultiple && !isEditable) {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          goNext();
          return;
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          goPrev();
          return;
        }
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        modal.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => el.offsetParent !== null);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (document.activeElement === modal) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey);

    const originalOverflow = document.body.style.overflow;
    const originalPadding = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPadding;
    };
  }, [requestClose, hasMultiple, goPrev, goNext]);

  /* ------------------------------------------------------------- */
  /* Add to quote                                                  */
  /* ------------------------------------------------------------- */
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

  /* ------------------------------------------------------------- */
  /* Render                                                        */
  /* ------------------------------------------------------------- */
  return (
    <div
      className={`
        fixed inset-0 z-[100] flex items-end justify-center bg-black/70
        p-0 backdrop-blur-md transition-opacity duration-300 ease-out
        motion-reduce:transition-none
        sm:items-center sm:p-5
        ${isOpen ? "opacity-100" : "opacity-0"}
        ${isClosing ? "pointer-events-none" : ""}
      `}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`product-modal-${product.id}`}
      aria-describedby={`product-modal-desc-${product.id}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          requestClose();
        }
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`
          relative flex max-h-[100dvh] w-full flex-col overflow-hidden
          bg-white outline-none
          shadow-[0_40px_80px_-20px_rgba(0,0,0,0.35)]
          transition-all duration-[400ms]
          [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]
          motion-reduce:transition-none
          sm:max-h-[94vh] sm:max-w-6xl sm:flex-row
          ${
            isOpen
              ? "translate-y-0 opacity-100 sm:scale-100"
              : "translate-y-6 opacity-0 sm:translate-y-0 sm:scale-[0.98]"
          }
        `}
      >
        {/* Close */}
        <button
          type="button"
          onClick={requestClose}
          aria-label="Close product details"
          className="
            absolute right-4 top-4 z-30 flex h-10 w-10 items-center
            justify-center border border-black/10 bg-white/95
            text-[var(--store-ink)] backdrop-blur-md
            transition-colors duration-300 ease-out
            hover:border-[var(--store-ink)] hover:bg-[var(--store-ink)]
            hover:text-white
            focus-visible:outline-none focus-visible:ring-1
            focus-visible:ring-[var(--store-ink)] focus-visible:ring-offset-2
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
            aria-hidden="true"
          >
            <path d="M3 3 11 11" />
            <path d="M11 3 3 11" />
          </svg>
        </button>

        {/* IMAGE AREA */}
        <div className="flex w-full shrink-0 flex-col bg-white sm:w-[52%]">
          <div className="relative flex min-h-[320px] flex-1 items-center justify-center p-5 sm:min-h-[620px] sm:p-10">
            {activeImage ? (
              <img
                key={activeImage}
                src={activeImage}
                alt={product.name}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="flex h-full min-h-[280px] w-full items-center justify-center">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--store-muted)]">
                  Product image
                </span>
              </div>
            )}

            {product.new_arrival && (
              <span className="absolute left-5 top-5 bg-[var(--store-ink)] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white">
                New arrival
              </span>
            )}

            {hasMultiple && (
              <span className="absolute bottom-5 left-5 tabular-nums text-[10px] uppercase tracking-[0.18em] text-[var(--store-muted)]">
                {String(selectedImage + 1).padStart(2, "0")} /{" "}
                {String(images.length).padStart(2, "0")}
              </span>
            )}

            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous image"
                  className="
                    group absolute left-4 top-1/2 hidden h-10 w-10
                    -translate-y-1/2 items-center justify-center
                    border border-black/10 bg-white/95
                    text-[var(--store-ink)] backdrop-blur-md
                    transition-colors duration-300
                    hover:border-[var(--store-ink)] hover:bg-[var(--store-ink)]
                    hover:text-white
                    focus-visible:outline-none focus-visible:ring-1
                    focus-visible:ring-[var(--store-ink)]
                    sm:flex
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
                  onClick={goNext}
                  aria-label="Next image"
                  className="
                    group absolute right-4 top-1/2 hidden h-10 w-10
                    -translate-y-1/2 items-center justify-center
                    border border-black/10 bg-white/95
                    text-[var(--store-ink)] backdrop-blur-md
                    transition-colors duration-300
                    hover:border-[var(--store-ink)] hover:bg-[var(--store-ink)]
                    hover:text-white
                    focus-visible:outline-none focus-visible:ring-1
                    focus-visible:ring-[var(--store-ink)]
                    sm:flex
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
              </>
            )}
          </div>

          {hasMultiple && (
            <div className="flex gap-3 overflow-x-auto border-t border-black/5 bg-white p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:p-5">
              {images.map((image, index) => {
                const isActive = selectedImage === index;
                return (
                  <button
                    key={`${product.id}-image-${index}`}
                    ref={(el) => {
                      thumbRefs.current[index] = el;
                    }}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View product image ${index + 1}`}
                    aria-current={isActive}
                    className={`
                      relative h-20 w-20 shrink-0 overflow-hidden
                      border bg-white
                      transition-all duration-300 ease-out
                      ${
                        isActive
                          ? "border-[var(--store-ink)] opacity-100"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }
                      focus-visible:outline-none focus-visible:ring-1
                      focus-visible:ring-[var(--store-ink)] focus-visible:ring-offset-2
                    `}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain bg-white">
          <div className="p-6 sm:p-10">
            <div className="pr-12">
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
                className="mt-3 max-w-xl text-balance text-2xl font-semibold leading-[1.15] tracking-tight text-[var(--store-ink)] sm:text-[28px]"
              >
                {product.name}
              </h2>
            </div>

            {/* Availability */}
            <div className="mt-5 inline-flex items-center gap-2 text-xs font-medium tabular-nums text-[var(--store-muted)]">
              <span
                aria-hidden="true"
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  product.stock > 0
                    ? "bg-[var(--store-accent)]"
                    : "bg-[var(--store-muted)]/50"
                }`}
              />
              {product.stock > 0
                ? `${product.stock} available`
                : "Made to order"}
            </div>

            <div className="my-8 h-px bg-[var(--store-line)]" />

            {/* Description */}
            <section>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-muted)]">
                About this piece
              </p>
              <p
                id={`product-modal-desc-${product.id}`}
                className="mt-3 max-w-xl text-sm leading-7 text-[var(--store-ink)]"
              >
                {product.description}
              </p>
            </section>

            {/* Features */}
            {product.features?.length > 0 && (
              <section className="mt-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-muted)]">
                  Product details
                </p>

                <ul className="mt-4 space-y-3">
                  {product.features.map((feature, index) => (
                    <li
                      key={`${product.id}-feature-${index}`}
                      className="flex gap-3 text-sm leading-6 text-[var(--store-ink)]"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-px w-3 shrink-0 bg-[var(--store-accent)]"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Meta */}
            <div className="mt-8 grid grid-cols-2 gap-5 border-t border-[var(--store-line)] pt-6 sm:grid-cols-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--store-muted)]">
                  SKU
                </p>
                <p className="mt-1.5 text-xs font-semibold tabular-nums text-[var(--store-ink)]">
                  {product.sku}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--store-muted)]">
                  Sold as
                </p>
                <p className="mt-1.5 text-xs font-semibold capitalize text-[var(--store-ink)]">
                  {product.unit}
                </p>
              </div>

              {product.brand && (
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--store-muted)]">
                    Brand
                  </p>
                  <p className="mt-1.5 text-xs font-semibold text-[var(--store-ink)]">
                    {product.brand}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ACTION */}
          <div className="mt-auto border-t border-[var(--store-line)] bg-white p-6 sm:p-8">
            <button
              type="button"
              onClick={handleAddToQuote}
              className="
                group flex w-full items-center justify-center gap-3
                bg-[var(--store-ink)] px-6 py-4
                text-[10px] font-bold uppercase tracking-[0.18em] text-white
                transition-opacity duration-300 ease-out
                hover:opacity-90
                focus-visible:outline-none focus-visible:ring-1
                focus-visible:ring-[var(--store-ink)] focus-visible:ring-offset-2
              "
            >
              {addedToQuote ? (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M2.5 7.5 6 11l5.5-8" />
                  </svg>
                  Added to quote
                </>
              ) : (
                <>
                  Add to quote
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
                </>
              )}
            </button>

            <span className="sr-only" aria-live="polite">
              {addedToQuote ? "Added to quote" : ""}
            </span>

            <p className="mt-3 text-center text-[10px] leading-relaxed text-[var(--store-muted)]">
              Personalised engraving options can be discussed before your
              order is confirmed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
