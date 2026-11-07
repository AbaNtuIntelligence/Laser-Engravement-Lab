import HeroSlider from "./HeroSlider";

const promotions = [
  {
    title: "Personalised Gifts",
    subtitle: "Made meaningful, made for you",
    image:
      "/images/products/gifts/blue-octagonal-wooden-box-gold-chain.webp",
    href: "/catalogue/?category=Gifts",
  },
  {
    title: "Corporate Engraving",
    subtitle: "Distinctive gifts for your business",
    image:
      "/images/products/corporate/custom-engraved-artistic-portrait-wood-plaque.webp",
    href: "/catalogue/?category=Corporate",
  },
];

export default function StorefrontHero() {
  return (
    <section
      aria-label="Featured collections and promotions"
      className="bg-white py-3 md:py-4"
    >
      <div className="store-container">
        <div className="grid grid-cols-1 gap-3 lg:h-[360px] lg:grid-cols-3">
          {/* Hero slider — same reduced height as before */}
          <div className="h-[200px] min-w-0 overflow-hidden rounded-2xl sm:h-[260px] lg:col-span-2 lg:h-full">
            <HeroSlider />
          </div>

          {/* Promo cards — 1:1 product tiles, no crop */}
          <div className="grid grid-cols-2 gap-3 lg:h-full">
            {promotions.map((promotion) => (
              <a
                key={promotion.title}
                href={promotion.href}
                className="group flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--store-line)] bg-white transition-shadow duration-300 hover:shadow-md"
              >
                {/* Square image container — standard e-commerce 1:1 */}
                <div className="relative aspect-square w-full overflow-hidden bg-white">
                  <img
                    src={promotion.image}
                    alt={promotion.title}
                    loading="eager"
                    className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                  />

                  <span className="absolute left-2 top-2 bg-[var(--store-ink)] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-white">
                    Featured
                  </span>
                </div>

                {/* Text below the image — standard e-commerce layout */}
                <div className="flex flex-1 flex-col justify-center px-3 py-2.5">
                  <h2 className="line-clamp-1 text-xs font-semibold tracking-tight text-[var(--store-ink)]">
                    {promotion.title}
                  </h2>

                  <p className="mt-0.5 hidden line-clamp-1 text-[10px] leading-snug text-[var(--store-muted)] sm:block">
                    {promotion.subtitle}
                  </p>

                  <span className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--store-accent)]">
                    Explore
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 10 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    >
                      <path d="M2 5h6" />
                      <path d="M5 2l3 3-3 3" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}