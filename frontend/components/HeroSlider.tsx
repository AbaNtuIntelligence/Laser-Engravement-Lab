
"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    eyebrow: "CORPORATE ENGRAVING",
    title: "Make an impression.",
    text: "Premium engraved plaques and meaningful corporate keepsakes.",
    image: "/images/products/corporate/custom-engraved-artistic-portrait-wood-plaque.webp",
    position: "center",
  },
  {
    eyebrow: "CUSTOM CREATIONS",
    title: "Your vision. Our craft.",
    text: "Turn special memories into one-of-a-kind personalised creations.",
    image: "/images/products/custom/custom-color-photo-jigsaw-puzzle.webp",
    position: "center",
  },
  {
    eyebrow: "PERSONALISED GIFTS",
    title: "Gifts worth keeping.",
    text: "Thoughtful engraved gifts made for unforgettable moments.",
    image: "/images/products/gifts/blue-octagonal-wooden-box-gold-chain.webp",
    position: "center",
  },
  {
    eyebrow: "HOME & LIFESTYLE",
    title: "Personal touches.",
    text: "Beautifully crafted engraved pieces for the spaces you love.",
    image: "/images/products/home/custom-monogram-message-wooden-tray-collection.webp",
    position: "center",
  },
  {
    eyebrow: "JEWELLERY",
    title: "Wear your story.",
    text: "Distinctive laser-cut jewellery with character and detail.",
    image: "/images/products/jewellery/geometric-blue-diamond-earrings.webp",
    position: "center",
  },
  {
    eyebrow: "LEATHER ACCESSORIES",
    title: "Crafted for you.",
    text: "Personalised leather accessories with a timeless finish.",
    image: "/images/products/leather/mazibuko-monogram-black-leather-wallet.webp",
    position: "center",
  },
  {
    eyebrow: "PERSONALISED MERCHANDISE",
    title: "Make it yours.",
    text: "Customised everyday essentials with a personal touch.",
    image: "/images/products/personalised-gifts/kelvin-power-custom-name-mug.webp",
    position: "center",
  },
  {
    eyebrow: "WINE GIFT BOXES",
    title: "Celebrate beautifully.",
    text: "Elegant wooden wine presentation boxes for special occasions.",
    image: "/images/products/wine-boxes/custom-engraved-portrait-wine-box-floral-cutout.webp",
    position: "center",
  },
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    const next = (active + 1) % slides.length;
    const image = new window.Image();
    image.src = slides[next].image;
  }, [active]);

  const previousSlide = () => {
    setActive((current) => (current - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setActive((current) => (current + 1) % slides.length);
  };

  return (
    <section
      aria-label="Laser Engraving Lab product showcase"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
      className="relative isolate h-[75svh] min-h-[520px] overflow-hidden bg-[#171717] md:h-[88svh] md:min-h-[620px] md:max-h-[1050px]"
    >
      {/* Category photography */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <img
            key={slide.image}
            src={slide.image}
            alt=""
            aria-hidden="true"
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              active === index ? "opacity-100" : "opacity-0"
            }`}
            style={{ objectPosition: slide.position }}
          />
        ))}

        {/* Light directional overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent" />

        {/* Subtle lower fade */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/45 to-transparent" />
      </div>

      {/* Main content */}
      <div className="store-container relative z-10 flex h-full items-center">
        <div className="max-w-[680px] py-20 text-white">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-[var(--store-accent)]">
            {slides[active].eyebrow}
          </p>

          <h1 className="max-w-2xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl xl:text-8xl">
            {slides[active].title}
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-white/90 md:text-lg">
            {slides[active].text}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#featured"
              className="store-button bg-white text-[var(--store-ink)]"
            >
              Shop Collection
            </a>

            <a
              href="#custom-order"
              className="store-button store-button-light"
            >
              Custom Order
            </a>
          </div>
        </div>
      </div>

      {/* Slider navigation */}
      <div className="store-container absolute inset-x-0 bottom-7 z-20 flex items-center justify-between gap-4 md:bottom-10">
        <div className="flex flex-wrap items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show ${slide.eyebrow} slide`}
              aria-current={active === index ? "true" : undefined}
              className="flex min-h-11 items-center justify-center px-1"
            >
              <span
                className={`block h-1 rounded-full transition-all duration-300 ${
                  active === index
                    ? "w-8 bg-white"
                    : "w-4 bg-white/40 hover:bg-white/80"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous slide"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black/20 text-white transition hover:bg-white hover:text-black"
          >
            <span aria-hidden="true" className="text-xl">‹</span>
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black/20 text-white transition hover:bg-white hover:text-black"
          >
            <span aria-hidden="true" className="text-xl">›</span>
          </button>
        </div>
      </div>
    </section>
  );
}
