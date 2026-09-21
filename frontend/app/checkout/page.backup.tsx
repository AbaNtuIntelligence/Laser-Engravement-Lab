"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getQuoteBasket,
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

export default function CheckoutPage() {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(getQuoteBasket());
    setLoaded(true);
  }, []);

  const subtotal = items.reduce((total, item) => {
    if (item.product.price === null) {
      return total;
    }

    return total + item.product.price * item.quantity;
  }, 0);

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[var(--store-paper)]">
        <div className="store-container py-20">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--store-muted)]">
            Loading...
          </p>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--store-paper)]">
        <div className="store-container py-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-accent)]">
            Request a quote
          </p>

          <h1 className="store-heading mt-2">
            Your basket is empty
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--store-muted)]">
            Add products to your quote basket before
            requesting a quotation.
          </p>

          <Link
            href="/"
            className="store-button store-button-dark mt-7 inline-flex"
          >
            Browse products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--store-paper)]">
      <div className="store-container py-10 sm:py-16">

        <div className="border-b border-[var(--store-line)] pb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-accent)]">
            Quotation
          </p>

          <h1 className="store-heading mt-2">
            Request a quote
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--store-muted)]">
            Tell us how to contact you and provide any
            engraving or personalisation details. We will
            review your selection and prepare a quotation.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">

          <section className="border border-[var(--store-line)] bg-white p-6 sm:p-8">

            <h2 className="text-xl font-semibold text-[var(--store-ink)]">
              Your details
            </h2>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">

              <div>
                <label
                  htmlFor="name"
                  className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--store-muted)]"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  className="mt-2 h-12 w-full border border-[var(--store-line)] bg-[var(--store-paper)] px-4 text-sm outline-none transition focus:border-[var(--store-ink)]"
                />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--store-muted)]"
                >
                  Company
                </label>

                <input
                  id="company"
                  type="text"
                  name="company"
                  placeholder="Optional"
                  className="mt-2 h-12 w-full border border-[var(--store-line)] bg-[var(--store-paper)] px-4 text-sm outline-none transition focus:border-[var(--store-ink)]"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--store-muted)]"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="mt-2 h-12 w-full border border-[var(--store-line)] bg-[var(--store-paper)] px-4 text-sm outline-none transition focus:border-[var(--store-ink)]"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--store-muted)]"
                >
                  Phone / WhatsApp
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="Your phone number"
                  className="mt-2 h-12 w-full border border-[var(--store-line)] bg-[var(--store-paper)] px-4 text-sm outline-none transition focus:border-[var(--store-ink)]"
                />
              </div>

            </div>

            <div className="mt-6">

              <label
                htmlFor="message"
                className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--store-muted)]"
              >
                Engraving / personalisation details
              </label>

              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Tell us what you would like engraved, including names, dates, wording, logos or other requirements."
                className="mt-2 w-full resize-y border border-[var(--store-line)] bg-[var(--store-paper)] px-4 py-4 text-sm leading-6 outline-none transition focus:border-[var(--store-ink)]"
              />

            </div>

            <div className="mt-6">

              <label
                htmlFor="delivery"
                className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--store-muted)]"
              >
                Additional requirements
              </label>

              <textarea
                id="delivery"
                name="delivery"
                rows={4}
                placeholder="Delivery requirements, event date, quantity requirements or anything else we should know."
                className="mt-2 w-full resize-y border border-[var(--store-line)] bg-[var(--store-paper)] px-4 py-4 text-sm leading-6 outline-none transition focus:border-[var(--store-ink)]"
              />

            </div>

            <button
              type="button"
              className="store-button store-button-dark mt-8 w-full sm:w-auto"
              onClick={() => {
                alert(
                  "Quotation request form is ready. We will connect this button to the Django quotation API next."
                );
              }}
            >
              Submit quotation request
            </button>

            <p className="mt-4 text-[10px] leading-5 text-[var(--store-muted)]">
              Your quotation will be confirmed before any
              payment or order is finalised.
            </p>

          </section>

          <aside className="h-fit border border-[var(--store-line)] bg-[var(--store-soft)] p-6 sm:p-7 lg:sticky lg:top-28">

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--store-accent)]">
                  Your selection
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[var(--store-ink)]">
                  Quote summary
                </h2>
              </div>

              <Link
                href="/cart"
                className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--store-muted)] hover:text-[var(--store-ink)]"
              >
                Edit
              </Link>
            </div>

            <div className="my-6 h-px bg-[var(--store-line)]" />

            <div className="space-y-5">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4"
                >
                  <div className="h-16 w-14 shrink-0 overflow-hidden bg-[var(--store-paper)]">
                    {item.product.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-full w-full object-contain"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold leading-5 text-[var(--store-ink)]">
                      {item.product.name}
                    </p>

                    <p className="mt-1 text-[10px] text-[var(--store-muted)]">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xs font-bold text-[var(--store-ink)]">
                      {item.product.price === null
                        ? "Quote"
                        : formatPrice(
                            item.product.price *
                              item.quantity
                          )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-6 h-px bg-[var(--store-line)]" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--store-muted)]">
                Estimated subtotal
              </span>

              <span className="text-base font-bold text-[var(--store-ink)]">
                {formatPrice(subtotal)}
              </span>
            </div>

            <p className="mt-4 text-[10px] leading-5 text-[var(--store-muted)]">
              Final pricing may change depending on
              engraving requirements, quantities,
              personalisation and delivery.
            </p>

          </aside>

        </div>
      </div>
    </main>
  );
}