import Link from "next/link";

const shopLinks = [
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
];

const labLinks = [
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
  {
    label: "Request a Quote",
    href: "/request-quote",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--store-ink)] text-white">

      <div className="store-container py-16 md:py-20">

        {/* MAIN FOOTER GRID */}

        <div className="grid gap-12 md:grid-cols-4">

          {/* BRAND */}

          <div className="md:col-span-2">

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


            <p className="mt-6 max-w-sm text-sm leading-7 text-white/50">
              Premium personalised products crafted in
              Johannesburg for gifts, milestones,
              businesses and moments worth remembering.
            </p>


            {/* CONTACT */}

            <div className="mt-7 space-y-2 text-sm text-white/50">

              <p>
                118 High Street
                <br />
                Turffontein, Johannesburg
                <br />
                Gauteng 2190
              </p>

              <a
                href="tel:+27116810465"
                className="block transition-colors hover:text-white"
              >
                011 681 0465
              </a>

              <a
                href="https://wa.me/27716299701"
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-white"
              >
                WhatsApp: 071 629 9701
              </a>

            </div>

          </div>


          {/* SHOP */}

          <div>

            <h3 className="text-xs font-bold uppercase tracking-[0.15em]">
              Shop
            </h3>

            <div className="mt-5 space-y-3">

              {shopLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="
                    block text-sm text-white/50
                    transition-colors
                    hover:text-white
                  "
                >
                  {link.label}
                </Link>
              ))}

            </div>

          </div>


          {/* THE LAB */}

          <div>

            <h3 className="text-xs font-bold uppercase tracking-[0.15em]">
              The Lab
            </h3>

            <div className="mt-5 space-y-3">

              {labLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="
                    block text-sm text-white/50
                    transition-colors
                    hover:text-white
                  "
                >
                  {link.label}
                </Link>
              ))}

            </div>

          </div>

        </div>


        {/* ABA NTU INTELLIGENCE DESIGNER SIGNATURE */}

        <div className="mt-16 border-t border-white/10 pt-10">

        {/* ABA NTU INTELLIGENCE DESIGNER SIGNATURE */}

<div className="mt-16 border-t border-white/10 pt-10">

  <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

    {/* SIGNATURE */}

    <div className="flex items-center gap-4">

      {/* ABA NTU INTELLIGENCE LOGO */}

      <Link
        href="https://abantu-website-1.onrender.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit AbaNtu Intelligence"
        className="
          flex h-12 w-12
          shrink-0 items-center justify-center
          overflow-hidden
          rounded-sm
          bg-white
          transition-opacity
          hover:opacity-80
        "
      >
        <img
          src="/images/products/logo.png"
          alt="AbaNtu Intelligence"
          className="h-full w-full object-contain p-1"
        />
      </Link>


      {/* COMPANY SIGNATURE */}

      <div>

        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/40">
          Designed & developed by
        </p>

        <Link
          href="https://abantu-website-1.onrender.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="
            mt-1 block
            text-sm font-bold tracking-tight
            text-white
            transition-colors
            hover:text-white/70
          "
        >
          AbaNtu Intelligence
        </Link>

        <p className="mt-1 text-[10px] text-white/40">
          Digital Problem Solvers
        </p>

      </div>

    </div>


    {/* COMPANY LINK */}

    <Link
      href="https://abantu-website-1.onrender.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="
        inline-flex items-center gap-2
        text-[10px] font-semibold
        uppercase tracking-[0.14em]
        text-white/40
        transition-colors
        hover:text-white
      "
    >
      Visit AbaNtu Intelligence

      <span>
        ↗
      </span>

    </Link>

  </div>

</div>

        </div>


        {/* LEGAL / LOCATION */}

        <div className="mt-8 border-t border-white/10 pt-7">

          <div className="flex flex-col gap-3 text-xs text-white/40 md:flex-row md:items-center md:justify-between">

            <span>
              © 2026 Laser Engraving Store
            </span>

            <span>
              118 High Street • Turffontein • Johannesburg
            </span>

          </div>

        </div>

      </div>

    </footer>
  );
}