"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { submitQuote } from "@/services/api";
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

export default function RequestQuotePage() {
  const [items, setItems] = useState<QuoteItem[]>([]);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [engravingRequirements, setEngravingRequirements] =
    useState("");
  const [additionalRequirements, setAdditionalRequirements] =
    useState("");

  useEffect(() => {
    setItems(getQuoteBasket());
    

    function handleBasketUpdate() {
      setItems(getQuoteBasket());
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
async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!name.trim()) {
    alert("Please enter your name.");
    return;
  }

  if (!email.trim()) {
    alert("Please enter your email address.");
    return;
  }

  if (!phone.trim()) {
    alert("Please enter your phone number.");
    return;
  }

  if (items.length === 0) {
    alert("Your quote basket is empty.");
    return;
  }

  try {
    const payload = {
      customer_name: name.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
      engraving_requirements: engravingRequirements.trim(),
      additional_requirements: additionalRequirements.trim(),

      items: items.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          sku: item.product.sku,
          price: item.product.price,
        },
        quantity: item.quantity,
      })),
    };

    const response = await submitQuote(payload);

    if (!response.success) {
      throw new Error(
        response.error || "Unable to submit quote."
      );
    }

    alert(
      `Quote request submitted successfully.\n\nReference: ${response.quote.reference}`
    );

    localStorage.removeItem("laser-engraving-quote-basket");
    window.dispatchEvent(new Event("quote-basket-updated"));

    setItems([]);
  } catch (error) {
    console.error("Quote submission error:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Something went wrong while submitting your quote."
    );
  }
}
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--store-paper)]">
        <div className="store-container py-16 sm:py-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-accent)]">
            Request a quote
          </p>

          <h1 className="store-heading mt-2">
            Your quote basket is empty
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--store-muted)]">
            Add the products you are interested in to your
            quote basket before submitting a quotation
            request.
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

        {/* PAGE HEADER */}

        <div className="border-b border-[var(--store-line)] pb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-accent)]">
            {itemCount} {itemCount === 1 ? "item" : "items"} selected
          </p>

          <h1 className="store-heading mt-2">
            Request a Quote
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--store-muted)]">
            Review your selected products and tell us what
            you need engraved or personalised. We will review
            your request and prepare a quotation.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* LEFT COLUMN */}

    <form onSubmit={handleSubmit} className="space-y-8">

            {/* SELECTED PRODUCTS */}

            <section className="border border-[var(--store-line)] bg-white">

              <div className="border-b border-[var(--store-line)] p-6 sm:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--store-accent)]">
                  Your selection
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[var(--store-ink)]">
                  Quote Basket
                </h2>
              </div>

              <div className="divide-y divide-[var(--store-line)]">

                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-5 sm:p-7"
                  >
                    <div className="flex gap-4">

                      {/* IMAGE */}

                      <div className="h-24 w-20 shrink-0 overflow-hidden bg-[var(--store-soft)] sm:h-28 sm:w-24">
                        {item.product.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-2 text-center text-[8px] font-bold uppercase tracking-[0.1em] text-[var(--store-muted)]">
                            Product
                          </div>
                        )}
                      </div>

                      {/* PRODUCT INFO */}

                      <div className="min-w-0 flex-1">

                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--store-accent)]">
                          {item.product.category}
                        </p>

                        <h3 className="mt-1 text-sm font-semibold leading-5 text-[var(--store-ink)] sm:text-base">
                          {item.product.name}
                        </h3>

                        <p className="mt-1 text-[10px] text-[var(--store-muted)]">
                          SKU: {item.product.sku}
                        </p>

                        {/* QUANTITY */}

                        <div className="mt-4 flex flex-wrap items-center gap-3">

                          <div className="flex h-9 items-center border border-[var(--store-line)]">

                            <button
                              type="button"
                              onClick={() =>
                                changeQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              aria-label={`Decrease quantity for ${item.product.name}`}
                              className="flex h-full w-9 items-center justify-center text-base text-[var(--store-ink)] transition hover:bg-[var(--store-soft)]"
                            >
                              −
                            </button>

                            <span className="flex h-full min-w-10 items-center justify-center border-x border-[var(--store-line)] px-2 text-xs font-bold text-[var(--store-ink)]">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                changeQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              aria-label={`Increase quantity for ${item.product.name}`}
                              className="flex h-full w-9 items-center justify-center text-base text-[var(--store-ink)] transition hover:bg-[var(--store-soft)]"
                            >
                              +
                            </button>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(item.product.id)
                            }
                            className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--store-muted)] transition hover:text-[var(--store-ink)]"
                          >
                            Remove
                          </button>

                        </div>

                      </div>

                      {/* PRICE */}

                      <div className="hidden shrink-0 text-right sm:block">
                        <p className="text-sm font-bold text-[var(--store-ink)]">
                          {item.product.price === null
                            ? "Quote"
                            : formatPrice(
                                item.product.price *
                                  item.quantity
                              )}
                        </p>

                        {item.product.price !== null && (
                          <p className="mt-1 text-[9px] text-[var(--store-muted)]">
                            {formatPrice(item.product.price)} each
                          </p>
                        )}
                      </div>

                    </div>

                    {/* MOBILE PRICE */}

                    <div className="mt-4 flex items-center justify-between border-t border-[var(--store-line)] pt-4 sm:hidden">
                      <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--store-muted)]">
                        Estimated
                      </span>

                      <span className="text-sm font-bold text-[var(--store-ink)]">
                        {item.product.price === null
                          ? "Price on request"
                          : formatPrice(
                              item.product.price *
                                item.quantity
                            )}
                      </span>
                    </div>

                  </div>
                ))}

              </div>

            </section>

            {/* CUSTOMER DETAILS */}

            <section className="border border-[var(--store-line)] bg-white p-6 sm:p-8">

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--store-accent)]">
                Contact information
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[var(--store-ink)]">
                Your Details
              </h2>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="name"
                    className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--store-muted)]"
                  >
                    Full name *
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
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
                    value={company}
                    onChange={(event) =>
                      setCompany(event.target.value)
                    }
                    placeholder="Optional"
                    className="mt-2 h-12 w-full border border-[var(--store-line)] bg-[var(--store-paper)] px-4 text-sm outline-none transition focus:border-[var(--store-ink)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--store-muted)]"
                  >
                    Email address *
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    className="mt-2 h-12 w-full border border-[var(--store-line)] bg-[var(--store-paper)] px-4 text-sm outline-none transition focus:border-[var(--store-ink)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--store-muted)]"
                  >
                    Phone / WhatsApp *
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    placeholder="Your phone number"
                    className="mt-2 h-12 w-full border border-[var(--store-line)] bg-[var(--store-paper)] px-4 text-sm outline-none transition focus:border-[var(--store-ink)]"
                  />
                </div>

              </div>

              <div className="mt-6">

                <label
                  htmlFor="engraving"
                  className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--store-muted)]"
                >
                  Engraving / personalisation
                </label>

                <textarea
                  id="engraving"
                  value={engravingRequirements}
                  onChange={(event) =>
                    setEngravingRequirements(
                      event.target.value
                    )
                  }
                  rows={6}
                  placeholder="Tell us what you would like engraved, including names, dates, wording, logos or other requirements."
                  className="mt-2 w-full resize-y border border-[var(--store-line)] bg-[var(--store-paper)] px-4 py-4 text-sm leading-6 outline-none transition focus:border-[var(--store-ink)]"
                />

              </div>

              <div className="mt-6">

                <label
                  htmlFor="additional"
                  className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--store-muted)]"
                >
                  Additional requirements
                </label>

                <textarea
                  id="additional"
                  value={additionalRequirements}
                  onChange={(event) =>
                    setAdditionalRequirements(
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Delivery requirements, event date, quantity requirements or anything else we should know."
                  className="mt-2 w-full resize-y border border-[var(--store-line)] bg-[var(--store-paper)] px-4 py-4 text-sm leading-6 outline-none transition focus:border-[var(--store-ink)]"
                />

              </div>

              <button
  type="submit"
  className="store-button store-button-dark mt-8 w-full sm:w-auto"
>
  Submit Quote Request
</button>

              <p className="mt-4 text-[10px] leading-5 text-[var(--store-muted)]">
                Your quotation will be reviewed and confirmed
                before any payment or order is finalised.
              </p>

                      </section>

          </form>

          {/* RIGHT COLUMN */}

          <aside className="h-fit border border-[var(--store-line)] bg-[var(--store-soft)] p-6 sm:p-7 lg:sticky lg:top-28">

            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--store-accent)]">
              Quote summary
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[var(--store-ink)]">
              Your Selection
            </h2>

            <div className="my-6 h-px bg-[var(--store-line)]" />

            <div className="space-y-4">

              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold leading-5 text-[var(--store-ink)]">
                      {item.product.name}
                    </p>

                    <p className="mt-1 text-[10px] text-[var(--store-muted)]">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-xs font-bold text-[var(--store-ink)]">
                    {item.product.price === null
                      ? "Quote"
                      : formatPrice(
                          item.product.price *
                            item.quantity
                        )}
                  </p>
                </div>
              ))}

            </div>

            <div className="my-6 h-px bg-[var(--store-line)]" />

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-[var(--store-muted)]">
                Estimated subtotal
              </span>

              <span className="text-base font-bold text-[var(--store-ink)]">
                {formatPrice(subtotal)}
              </span>
            </div>

            <p className="mt-4 text-[10px] leading-5 text-[var(--store-muted)]">
              Final pricing may vary depending on engraving
              requirements, materials, quantities,
              personalisation and delivery.
            </p>

          </aside>

        </div>
      </div>
    </main>
  );
}
