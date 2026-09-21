"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getQuoteBasket,
  removeFromQuote,
  updateQuoteQuantity,
  type QuoteItem,
} from "@/services/quoteBasket";

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

export default function QuoteBasketPage() {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const basket = getQuoteBasket();

    console.log("QUOTE BASKET LOADED:", basket);

    setItems(basket);
    setLoaded(true);

    function handleBasketUpdate() {
      const updatedBasket = getQuoteBasket();

      console.log(
        "QUOTE BASKET UPDATED:",
        updatedBasket
      );

      setItems(updatedBasket);
    }

    window.addEventListener(
      "quote-basket-updated",
      handleBasketUpdate
    );

    return () => {
      window.removeEventListener(
        "quote-basket-updated",
        handleBasketUpdate
      );
    };
  }, []);

  function changeQuantity(
    productId: string,
    quantity: number
  ) {
    const updatedBasket = updateQuoteQuantity(
      productId,
      quantity
    );

    setItems(updatedBasket);
  }

  function removeItem(productId: string) {
    const updatedBasket = removeFromQuote(productId);

    setItems(updatedBasket);
  }

  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = items.reduce((total, item) => {
    if (item.product.price === null) {
      return total;
    }

    return (
      total +
      item.product.price * item.quantity
    );
  }, 0);

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[var(--store-paper)]">
        <div className="store-container py-20">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--store-muted)]">
            Loading quote basket...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--store-paper)]">
      <div className="store-container py-10 sm:py-16">

        <div className="flex flex-col gap-4 border-b border-[var(--store-line)] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-accent)]">
              Your selection
            </p>

            <h1 className="store-heading mt-2">
              Quote Basket
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--store-muted)]">
              Review the products you would like included
              in your quotation request.
            </p>
          </div>

          <Link
            href="/"
            className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--store-ink)]"
          >
            ← Continue shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <section className="mt-10 border border-[var(--store-line)] bg-[var(--store-soft)] px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[var(--store-line)] bg-[var(--store-paper)] text-2xl">
              🛒
            </div>

            <h2 className="mt-6 text-xl font-semibold text-[var(--store-ink)]">
              Your quote basket is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--store-muted)]">
              Browse our collection and add products you
              would like us to quote for.
            </p>

            <Link
              href="/"
              className="store-button store-button-dark mt-7 inline-flex"
            >
              Continue shopping
            </Link>
          </section>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">

            <section className="space-y-4">
              {items.map((item) => {
                const product = item.product;
                const image =
                  product.images?.[0] || null;

                const lineTotal =
                  product.price === null
                    ? null
                    : product.price * item.quantity;

                return (
                  <article
                    key={product.id}
                    className="border border-[var(--store-line)] bg-white p-4 sm:p-5"
                  >
                    <div className="flex gap-4 sm:gap-6">

                      <div className="h-28 w-24 shrink-0 overflow-hidden bg-[var(--store-soft)] sm:h-36 sm:w-32">
                        {image ? (
                          <img
                            src={image}
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-3 text-center">
                            <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--store-muted)]">
                              Product image
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-4">

                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--store-accent)]">
                              {product.category}
                            </p>

                            <h2 className="mt-1 text-sm font-semibold leading-snug text-[var(--store-ink)] sm:text-base">
                              {product.name}
                            </h2>

                            <p className="mt-2 text-[10px] text-[var(--store-muted)]">
                              SKU: {product.sku}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(product.id)
                            }
                            className="shrink-0 text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--store-muted)] hover:text-[var(--store-ink)]"
                          >
                            Remove
                          </button>

                        </div>

                        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">

                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--store-muted)]">
                              Quantity
                            </p>

                            <div className="mt-2 flex h-9 items-center border border-[var(--store-line)]">

                              <button
                                type="button"
                                onClick={() =>
                                  changeQuantity(
                                    product.id,
                                    item.quantity - 1
                                  )
                                }
                                className="flex h-full w-9 items-center justify-center text-sm hover:bg-[var(--store-soft)]"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>

                              <span className="flex h-full min-w-9 items-center justify-center border-x border-[var(--store-line)] px-2 text-xs font-semibold">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  changeQuantity(
                                    product.id,
                                    item.quantity + 1
                                  )
                                }
                                className="flex h-full w-9 items-center justify-center text-sm hover:bg-[var(--store-soft)]"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>

                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--store-muted)]">
                              Line total
                            </p>

                            <p className="mt-1 text-sm font-bold text-[var(--store-ink)]">
                              {lineTotal === null
                                ? "Price on request"
                                : formatPrice(lineTotal)}
                            </p>
                          </div>

                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="h-fit border border-[var(--store-line)] bg-[var(--store-soft)] p-6 sm:p-7 lg:sticky lg:top-28">

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--store-accent)]">
                Quote summary
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[var(--store-ink)]">
                Your selection
              </h2>

              <div className="my-6 h-px bg-[var(--store-line)]" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--store-muted)]">
                  Items
                </span>

                <span className="text-sm font-semibold text-[var(--store-ink)]">
                  {itemCount}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-[var(--store-muted)]">
                  Estimated subtotal
                </span>

                <span className="text-sm font-bold text-[var(--store-ink)]">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <p className="mt-5 text-[10px] leading-5 text-[var(--store-muted)]">
                This is an estimated product subtotal.
                Personalisation, engraving, delivery and
                other applicable costs will be confirmed
                in your quotation.
              </p>

              <Link
                href="/checkout"
                className="store-button store-button-dark mt-7 flex w-full"
              >
                Request quotation
              </Link>

            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

