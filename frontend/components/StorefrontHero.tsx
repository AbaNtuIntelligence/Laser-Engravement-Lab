import HeroSlider from "./HeroSlider";

const promotions = [
  {
    title: "Custom Keepsakes",
    subtitle: "Turn your memories into art",
    // Using the new Best Dad Plaque image
    image: "/images/products/corporate/best-dad-engraved-photo-plaque.webp",
    href: "/catalogue/?category=Corporate",
  },
  {
    title: "Personalised Gifting",
    subtitle: "Made meaningful, made for you",
    // Using the new Custom Photo Tumbler image
    image: "/images/products/gifts/custom-photo-tumbler.webp",
    href: "/catalogue/?category=Gifts",
  },
];

export default function StorefrontHero() {
  return (
    <section
      aria-label="Featured collections and promotions"
      className="bg-white py-3 md:py-4"
    >
      <div className="store-container">
        <div className="grid grid-cols-1 gap-3 lg:h-[320px] lg:grid-cols-3">
          {/* Hero — constrained to a typical banner height */}
          <div className="h-[200px] min-w-0 overflow-hidden rounded-2xl sm:h-[260px] lg:col-span-2 lg:h-full">
            <HeroSlider />
          </div>

          {/* Promo pair — matches hero height on desktop */}
          <div className="grid h-[150px] grid-cols-2 gap-3 sm:h-[180px] lg:h-full lg:grid-cols-1">
            {promotions.map((promotion) => (
              <a
                key={promotion.title}
                href={promotion.href}
                className="group relative min-h-0 overflow-hidden rounded-2xl bg-neutral-900"
              >
                <img
                  src={promotion.image}
                  alt=""
                  loading="eager"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <h2 className="text-base font-semibold md:text-lg">
                    {promotion.title}
                  </h2>

                  <p className="mt-1 hidden text-xs text-white/85 sm:block">
                    {promotion.subtitle}
                  </p>

                  <span className="mt-2 inline-block text-xs font-semibold underline underline-offset-4">
                    Explore Collection
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