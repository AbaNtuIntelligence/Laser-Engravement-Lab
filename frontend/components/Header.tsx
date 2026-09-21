"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getQuoteBasket } from "@/services/quoteBasket";

const navigation = [
  {
    label: "Catalogue",
    href: "/catalogue",
  },
  {
    label: "Gifts",
    href: "/catalogue?category=Gifts",
  },
  {
    label: "Jewellery",
    href: "/catalogue?category=Jewellery",
  },
  {
    label: "Home",
    href: "/catalogue?category=Home",
  },
  {
    label: "Corporate",
    href: "/catalogue?category=Corporate",
  },
  {
    label: "New Arrivals",
    href: "/catalogue?new_arrival=true",
  },
  {
    label: "How It Works",
    href: "/how-it-works",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteCount, setQuoteCount] = useState(0);

  useEffect(() => {
    function updateQuoteCount() {
      try {
        const basket = getQuoteBasket();

        const count = basket.reduce(
          (total, item) => total + item.quantity,
          0
        );

        setQuoteCount(count);
      } catch {
        setQuoteCount(0);
      }
    }

    updateQuoteCount();

    window.addEventListener(
      "quote-basket-updated",
      updateQuoteCount
    );

    window.addEventListener(
      "storage",
      updateQuoteCount
    );

    return () => {
      window.removeEventListener(
        "quote-basket-updated",
        updateQuoteCount
      );

      window.removeEventListener(
        "storage",
        updateQuoteCount
      );
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className="
        fixed inset-x-0 top-0 z-[100]
        w-full
        border-b border-[var(--store-line)]
        bg-[rgba(247,245,240,0.97)]
        backdrop-blur-xl
      "
    >
      {/* TOP BAR */}

      <div className="hidden border-b border-[var(--store-line)] bg-[var(--store-ink)] text-white md:block">
        <div className="store-container flex h-8 items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em]">
          <span>
            Custom engraving • Johannesburg
          </span>

          <span>
            WhatsApp ordering available
          </span>
        </div>
      </div>


      {/* MAIN HEADER */}

      <div className="store-container flex h-[68px] items-center justify-between gap-3 md:h-[72px]">

        {/* MOBILE MENU */}

        <button
          type="button"
          onClick={() =>
            setMenuOpen((current) => !current)
          }
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={
            menuOpen
              ? "Close menu"
              : "Open menu"
          }
          className="
            flex h-11 min-w-[72px]
            items-center justify-center gap-2
            border border-[var(--store-line)]
            bg-white px-3
            text-[11px] font-bold uppercase
            tracking-[0.08em]
            transition-colors
            hover:border-[var(--store-ink)]
            md:hidden
          "
        >
          <span className="text-lg leading-none">
            {menuOpen ? "×" : "☰"}
          </span>

          <span>
            {menuOpen ? "Close" : "Menu"}
          </span>
        </button>


        {/* LOGO */}

        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="Laser Engraving home"
        >
          <img
            src="/images/logo.webp"
            alt="Laser Engraving"
            className="h-12 w-auto object-contain md:h-14"
          />

          <span className="flex flex-col justify-center text-left">

            <span className="text-[17px] font-bold leading-none tracking-[-0.05em] md:text-lg">
              LASER
            </span>

            <span className="mt-1 text-[8px] font-semibold leading-none tracking-[0.28em] text-[var(--store-accent)]">
              ENGRAVING
            </span>

            <span className="text-[12px] font-bold leading-none tracking-[-0.03em] md:text-lg">
              LAB
            </span>

          </span>
        </Link>


        {/* DESKTOP NAVIGATION */}

        <nav
          aria-label="Main navigation"
          className="
            hidden flex-1 items-center justify-center
            gap-4 xl:gap-5
            lg:flex
          "
        >
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="
                whitespace-nowrap
                text-[11px] font-semibold
                text-[var(--store-muted)]
                transition-colors
                hover:text-[var(--store-ink)]
                xl:text-[12px]
              "
            >
              {item.label}
            </Link>
          ))}
        </nav>


        {/* ACTIONS */}

        <div className="flex items-center gap-1">

          {/* SEARCH */}

          <button
            type="button"
            aria-label="Search"
            className="
              hidden h-11 w-11
              items-center justify-center
              text-xl text-[var(--store-ink)]
              sm:flex
            "
          >
            ⌕
          </button>


          {/* WISHLIST */}

          <button
            type="button"
            aria-label="Wishlist"
            className="
              hidden h-11 w-11
              items-center justify-center
              text-xl text-[var(--store-ink)]
              sm:flex
            "
          >
            ♡
          </button>


          {/* QUOTE BASKET */}

          <Link
            href="/request-quote"
            aria-label={`Quote basket with ${quoteCount} ${
              quoteCount === 1
                ? "item"
                : "items"
            }`}
            className="
              relative flex h-11 w-11
              items-center justify-center
              text-lg text-[var(--store-ink)]
            "
          >
            🛒

            {quoteCount > 0 && (
              <span
                className="
                  absolute right-0.5 top-0.5
                  flex h-5 min-w-5
                  items-center justify-center
                  rounded-full
                  bg-[var(--store-accent)]
                  px-1
                  text-[9px] font-bold
                  leading-none text-white
                "
              >
                {quoteCount > 99
                  ? "99+"
                  : quoteCount}
              </span>
            )}
          </Link>

        </div>

      </div>


      {/* MOBILE NAVIGATION */}

      <div
        id="mobile-navigation"
        className={`
          overflow-hidden
          border-t border-[var(--store-line)]
          bg-[var(--store-paper)]
          transition-[max-height,opacity]
          duration-300 ease-out
          md:hidden
          ${
            menuOpen
              ? "max-h-[700px] opacity-100"
              : "max-h-0 opacity-0"
          }
        `}
      >
        <nav className="store-container flex flex-col py-2">

          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="
                flex min-h-[52px]
                items-center justify-between
                border-b border-[var(--store-line)]
                text-sm font-semibold
              "
            >
              <span>
                {item.label}
              </span>

              <span className="text-[var(--store-muted)]">
                →
              </span>
            </Link>
          ))}


          {/* MOBILE QUOTE CTA */}

          <Link
            href="/request-quote"
            onClick={() => setMenuOpen(false)}
            className="
              store-button
              store-button-dark
              mb-3 mt-5
            "
          >
            Request a Quote
          </Link>

        </nav>
      </div>

    </header>
  );
}