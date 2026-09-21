"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    eyebrow: "PERSONALISED GIFTS",
    title: "Made personal.",
    text: "Premium engraved pieces created for the people and moments that matter.",
    image:
      "/images/products/wine-boxes/wooden-wine-bottle-gift-box-floral-wine-glass-design.webp",
  },

  {
    eyebrow: "CUSTOM CRAFT",
    title: "Your idea. Our craft.",
    text: "Turn your concept into something tangible, personal and built to last.",
    image:
      "/images/products/corporate/custom-engraved-artistic-portrait-wood-plaque.webp",
  },

  {
    eyebrow: "CORPORATE & EVENTS",
    title: "Make it memorable.",
    text: "Thoughtful engraved gifts for teams, clients, celebrations and milestones.",
    image:
      "/images/products/home/custom-monogram-message-wooden-tray-collection.webp",
  },
  
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const slide = slides[active];

  return (
    <section className="relative min-h-[500px] overflow-hidden bg-[var(--store-dark)] md:min-h-[58vh]">

      {/* HERO IMAGE */}

      <div className="absolute inset-0">

        <img
          src={slide.image}
          alt=""
          className="h-full w-full object-cover object-center transition-opacity duration-700"
        />

        {/* Dark cinematic overlay */}

        <div className="absolute inset-0 bg-black/55" />

        {/* Left-side readability gradient */}

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />

        {/* Bottom fade */}

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Subtle warm accent */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(161,122,63,0.20),transparent_35%)]" />

      </div>


      {/* Content */}

      <div className="store-container relative flex min-h-[500px] items-end py-14 md:min-h-[58vh] md:items-center md:py-20">

        <div className="max-w-2xl text-white">

          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[var(--store-accent)]">
            {slide.eyebrow}
          </p>

          <h1 className="max-w-xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] md:text-7xl lg:text-8xl">
            {slide.title}
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-white/75 md:text-lg">
            {slide.text}
          </p>


          {/* CTA BUTTONS */}

          <div className="mt-8 flex flex-wrap gap-3">

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


      {/* Slider controls */}

      <div className="store-container absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center justify-between">

        <div className="flex gap-2">

          {slides.map((_, index) => (

            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show slide ${index + 1}`}
              className={`h-1 transition-all ${
                active === index
                  ? "w-10 bg-white"
                  : "w-5 bg-white/30"
              }`}
            />

          ))}

        </div>

      </div>

    </section>
  );
}

