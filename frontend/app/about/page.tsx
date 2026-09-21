"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const focusAreas = [
  {
    number: "01",
    title: "Personalisation",
    text: "Names, messages, dates, photographs, artwork and meaningful details that turn an ordinary product into something personal.",
  },
  {
    number: "02",
    title: "Gifting",
    text: "Thoughtful engraved pieces for birthdays, weddings, anniversaries, graduations, family occasions and the moments worth remembering.",
  },
  {
    number: "03",
    title: "Corporate",
    text: "Branded and personalised products for businesses, teams, events, recognition, client gifting and special occasions.",
  },
  {
    number: "04",
    title: "Custom",
    text: "Projects that start with an idea rather than a catalogue listing. Bring us your concept and we can explore what is possible.",
  },
];

const values = [
  {
    title: "Meaning over mass production",
    text: "Personalised products should feel personal. We focus on the detail that makes a piece meaningful to the person receiving it.",
  },
  {
    title: "Technology with purpose",
    text: "Laser engraving is the technology. The real goal is creating something useful, memorable, beautiful or meaningful.",
  },
  {
    title: "Details matter",
    text: "From artwork preparation to the final engraved surface, the small decisions influence the quality of the finished piece.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="bg-white text-[var(--store-ink)]">

        {/* ============================================================
            HERO
        ============================================================ */}

        <section className="border-b border-[var(--store-line)] bg-[var(--store-ink)] text-white">
          <div className="store-container py-20 sm:py-24 lg:py-28">

            <div className="max-w-4xl">

              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--store-accent)]">
                About the Lab
              </p>

              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-7xl">
                We make ordinary
                <span className="block text-white/50">
                  things worth remembering.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
                Laser Engraving Store is a personalised product studio built
                around the idea that the right detail can turn a product into
                something much more meaningful.
              </p>

            </div>

          </div>
        </section>

        {/* ============================================================
            INTRODUCTION
        ============================================================ */}

        <section className="store-section">
          <div className="store-container">

            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-accent)]">
                  The Store
                </p>

                <h2 className="store-heading mt-3">
                  More than an online catalogue.
                </h2>

              </div>

              <div className="max-w-3xl">

                <p className="text-lg leading-8 text-black/65">
                  The Laser Engraving Store brings together products that can
                  be personalised, engraved and transformed into something
                  uniquely yours.
                </p>

                <p className="mt-6 text-base leading-8 text-black/55">
                  From a small engraved gift to a larger corporate project,
                  our catalogue gives customers a starting point. The
                  personalisation process is where the product becomes yours.
                </p>

                <p className="mt-6 text-base leading-8 text-black/55">
                  Rather than treating every personalised order as a standard
                  ecommerce transaction, we use a quote-first approach. This
                  gives us room to understand what you need, review your
                  artwork and provide the appropriate production details.
                </p>

              </div>

            </div>

          </div>
        </section>

        {/* ============================================================
            THE LAB
        ============================================================ */}

        <section className="border-y border-[var(--store-line)] bg-[#f7f7f5]">
          <div className="store-container py-16 sm:py-20">

            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">

              {/* Visual block */}

              <div className="aspect-[4/3] overflow-hidden bg-[var(--store-ink)]">

                <div className="flex h-full flex-col justify-between p-7 text-white sm:p-10">

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--store-accent)]">
                      The Lab
                    </p>

                    <div className="mt-5 h-px w-16 bg-white/20" />
                  </div>

                  <div>

                    <p className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                      Create.
                      <br />
                      Engrave.
                      <br />
                      Remember.
                    </p>

                    <p className="mt-6 max-w-sm text-sm leading-6 text-white/45">
                      A place where digital designs become physical products.
                    </p>

                  </div>

                </div>

              </div>

              {/* Copy */}

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-accent)]">
                  Inside the Studio
                </p>

                <h2 className="store-heading mt-3">
                  Where ideas meet precision.
                </h2>

                <p className="mt-5 text-sm leading-7 text-black/60">
                  Laser engraving gives us a precise way to put names,
                  graphics, patterns and artwork onto a range of products and
                  materials.
                </p>

                <p className="mt-5 text-sm leading-7 text-black/60">
                  But the machine is only part of the process. Good results
                  begin with understanding the product, preparing the artwork,
                  choosing the right placement and paying attention to the
                  finished detail.
                </p>

                <p className="mt-5 text-sm leading-7 text-black/60">
                  That is what we mean by the Lab: a working space where
                  technology, design and craftsmanship come together.
                </p>

                <a
                  href="/how-it-works"
                  className="
                    mt-8 inline-flex min-h-12
                    items-center justify-center
                    border border-[var(--store-ink)]
                    px-7
                    text-sm font-semibold
                    transition-all duration-200
                    hover:bg-[var(--store-ink)]
                    hover:text-white
                  "
                >
                  See How It Works
                </a>

              </div>

            </div>

          </div>
        </section>

        {/* ============================================================
            WHAT WE CREATE
        ============================================================ */}

        <section className="store-section">
          <div className="store-container">

            <div className="mb-12 max-w-2xl">

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-accent)]">
                What We Create
              </p>

              <h2 className="store-heading mt-3">
                Personalised products for real moments.
              </h2>

              <p className="mt-5 text-sm leading-7 text-black/55">
                Our catalogue spans gifting, jewellery, home products,
                corporate pieces and custom projects.
              </p>

            </div>

            <div className="grid gap-px overflow-hidden border border-[var(--store-line)] bg-[var(--store-line)] sm:grid-cols-2">

              {focusAreas.map((area) => (
                <div
                  key={area.number}
                  className="bg-white p-7 sm:p-9"
                >

                  <span className="text-[11px] font-bold tracking-[0.16em] text-[var(--store-accent)]">
                    {area.number}
                  </span>

                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.025em]">
                    {area.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-black/55">
                    {area.text}
                  </p>

                </div>
              ))}

            </div>

          </div>
        </section>

        {/* ============================================================
            PHILOSOPHY
        ============================================================ */}

        <section className="bg-[var(--store-ink)] text-white">
          <div className="store-container py-16 sm:py-20">

            <div className="max-w-3xl">

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--store-accent)]">
                What We Believe
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Technology is the tool.
                <span className="block text-white/45">
                  The finished piece is the point.
                </span>
              </h2>

              <p className="mt-6 text-base leading-8 text-white/55">
                A laser can engrave a name in seconds. What matters is why
                that name is there — the person, occasion, memory or purpose
                behind it.
              </p>

              <p className="mt-5 text-base leading-8 text-white/55">
                That is why we approach each project from the product and
                customer backwards. What are we making? Who is it for? What
                should it communicate? What will make the finished piece feel
                right?
              </p>

            </div>

            <div className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-3">

              {values.map((value) => (
                <div
                  key={value.title}
                  className="bg-white/[0.04] p-7 sm:p-8"
                >

                  <h3 className="text-lg font-semibold">
                    {value.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-white/45">
                    {value.text}
                  </p>

                </div>
              ))}

            </div>

          </div>
        </section>

        {/* ============================================================
            LOCATION
        ============================================================ */}

        <section className="store-section">
          <div className="store-container">

            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-accent)]">
                  Find the Lab
                </p>

                <h2 className="store-heading mt-3">
                  Johannesburg, South Africa.
                </h2>

                <address className="mt-5 not-italic text-sm leading-7 text-black/55">
                  118 High Street
                  <br />
                  Turffontein
                  <br />
                  Johannesburg
                  <br />
                  Gauteng 2190
                </address>

              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">

                <a
                  href="tel:+27116810465"
                  className="
                    inline-flex min-h-12
                    items-center justify-center
                    border border-[var(--store-line)]
                    px-7 text-sm font-semibold
                    transition-all duration-200
                    hover:border-[var(--store-ink)]
                  "
                >
                  011 681 0465
                </a>

                <a
                  href="https://wa.me/27716299701"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex min-h-12
                    items-center justify-center
                    bg-[var(--store-ink)]
                    px-7 text-sm font-semibold text-white
                    transition-all duration-200
                    hover:bg-black
                  "
                >
                  WhatsApp the Lab
                </a>

              </div>

            </div>

          </div>
        </section>

        {/* ============================================================
            FINAL CTA
        ============================================================ */}

        <section className="border-t border-[var(--store-line)] bg-[#f7f7f5]">
          <div className="store-container py-20 text-center sm:py-24">

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--store-accent)]">
              Your Idea Starts Here
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Ready to make it personal?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-black/55">
              Browse the catalogue or tell us about something completely
              custom. We&apos;ll take it from there.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

              <a
                href="/catalogue"
                className="
                  inline-flex min-h-12
                  items-center justify-center
                  bg-[var(--store-ink)]
                  px-8
                  text-sm font-semibold text-white
                  transition-all duration-200
                  hover:bg-black
                "
              >
                Explore the Catalogue
              </a>

              <a
                href="/request-quote"
                className="
                  inline-flex min-h-12
                  items-center justify-center
                  border border-[var(--store-line)]
                  bg-white px-8
                  text-sm font-semibold
                  transition-all duration-200
                  hover:border-[var(--store-ink)]
                "
              >
                Request a Quote
              </a>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}