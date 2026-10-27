
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
      className="bg-white py-4 md:py-6"
    >
      <div className="store-container">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <HeroSlider />
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {promotions.map((promotion) => (
              <a
                key={promotion.title}
                href={promotion.href}
                className="group relative min-h-[150px] overflow-hidden rounded-2xl bg-neutral-900 lg:min-h-0"
              >
                <img
                  src={promotion.image}
                  alt=""
                  loading="lazy"
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
