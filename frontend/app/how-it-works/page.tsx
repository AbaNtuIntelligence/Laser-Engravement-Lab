"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const steps = [
  {
    number: "01",
    title: "Choose",
    text: "Browse the catalogue and find something that fits the occasion, person, space or business.",
  },
  {
    number: "02",
    title: "Personalise",
    text: "Tell us what you would like engraved — names, messages, dates, artwork, logos, photographs or your own design.",
  },
  {
    number: "03",
    title: "Build Your Quote",
    text: "Add the products you are interested in to your quote basket and tell us what you need.",
  },
  {
    number: "04",
    title: "We Review",
    text: "We review the product, personalisation, quantities and any artwork requirements before preparing your quotation.",
  },
  {
    number: "05",
    title: "We Create",
    text: "Once the details are confirmed, your project moves into the Lab for engraving, finishing and quality checking.",
  },
  {
    number: "06",
    title: "Ready",
    text: "Your completed pieces are prepared for collection or the agreed delivery arrangement.",
  },
];

const principles = [
  {
    title: "Personalised",
    text: "Your engraving is created around your requirements rather than forcing your idea into a standard product.",
  },
  {
    title: "Quote-first",
    text: "Personalisation, quantities and custom artwork can change the scope of a project, so we quote according to what you actually need.",
  },
  {
    title: "Made with care",
    text: "Every engraved piece goes through preparation, engraving and finishing before it leaves the Lab.",
  },
];

const faqs = [
  {
    question: "Why do I need to request a quote?",
    answer:
      "Personalised work can vary according to the product, engraving, artwork, quantity and finishing requirements. A quote lets us price the project according to your actual requirements.",
  },
  {
    question: "Can I use my own design?",
    answer:
      "Yes. If you already have artwork, a logo, photograph or another design, you can tell us about it when requesting your quote. We will assess what is required to prepare it for engraving.",
  },
  {
    question: "Can I order multiple products?",
    answer:
      "Yes. The quote basket is designed for multiple products and quantities, making it suitable for gifts, family projects, events and corporate orders.",
  },
  {
    question: "Can businesses place larger orders?",
    answer:
      "Yes. Corporate and bulk requirements can be submitted through the quote process. Include your quantities, branding requirements and any deadlines in your request.",
  },
  {
    question: "What happens after I submit my quote?",
    answer:
      "We review the products and personalisation details you submitted and use that information to prepare the next step, including pricing and any artwork or production requirements.",
  },
];

export default function HowItWorksPage() {
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
                How It Works
              </p>

              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-7xl">
                From an idea
                <span className="block text-white/50">
                  to something you can hold.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
                The Laser Engraving Store is built around personalised
                products. Choose what you like, tell us what you want,
                request a quote, and let the Lab take care of the rest.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">

                <a
                  href="/catalogue"
                  className="
                    inline-flex min-h-12 items-center justify-center
                    bg-white px-7
                    text-sm font-semibold
                    text-[var(--store-ink)]
                    transition-all duration-200
                    hover:bg-[var(--store-accent)]
                    hover:text-white
                  "
                >
                  Explore the Catalogue
                </a>

                <a
                  href="/request-quote"
                  className="
                    inline-flex min-h-12 items-center justify-center
                    border border-white/20 px-7
                    text-sm font-semibold text-white
                    transition-all duration-200
                    hover:border-white/50
                    hover:bg-white/10
                  "
                >
                  Start a Quote
                </a>

              </div>

            </div>

          </div>
        </section>

        {/* ============================================================
            PROCESS INTRO
        ============================================================ */}

        <section className="store-section">
          <div className="store-container">

            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-accent)]">
                  The Process
                </p>

                <h2 className="store-heading mt-3">
                  Simple for you.
                  <span className="block text-black/40">
                    Precise in the Lab.
                  </span>
                </h2>
              </div>

              <div>
                <p className="max-w-2xl text-base leading-8 text-black/60">
                  We have designed the buying experience around the reality
                  of personalised engraving. Instead of treating every order
                  like a standard product checkout, we give you space to
                  describe exactly what you want.
                </p>

                <p className="mt-5 max-w-2xl text-base leading-8 text-black/60">
                  That means a name on a gift, a family design, a wedding
                  project, a corporate logo or a larger custom job can all
                  start from the same simple process.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ============================================================
            SIX STEPS
        ============================================================ */}

        <section className="border-y border-[var(--store-line)] bg-[#f7f7f5]">
          <div className="store-container py-16 sm:py-20">

            <div className="mb-12 max-w-2xl">

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-accent)]">
                Six Steps
              </p>

              <h2 className="store-heading mt-3">
                How your project moves through the Lab.
              </h2>

            </div>

            <div className="grid gap-px overflow-hidden border border-[var(--store-line)] bg-[var(--store-line)] sm:grid-cols-2 lg:grid-cols-3">

              {steps.map((step) => (
                <div
                  key={step.number}
                  className="bg-white p-7 sm:p-8"
                >
                  <span className="text-[11px] font-bold tracking-[0.16em] text-[var(--store-accent)]">
                    {step.number}
                  </span>

                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-black/55">
                    {step.text}
                  </p>
                </div>
              ))}

            </div>

          </div>
        </section>

        {/* ============================================================
            THE LAB
        ============================================================ */}

        <section className="store-section">
          <div className="store-container">

            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">

              <div className="aspect-[4/3] overflow-hidden bg-[var(--store-ink)]">

                <div className="flex h-full flex-col justify-between p-7 text-white sm:p-10">

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--store-accent)]">
                      Inside the Lab
                    </p>

                    <h2 className="mt-4 max-w-lg text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                      Designed.
                      <br />
                      Prepared.
                      <br />
                      Engraved.
                      <br />
                      Finished.
                    </h2>
                  </div>

                  <div className="flex items-end justify-between gap-5">

                    <p className="max-w-xs text-sm leading-6 text-white/50">
                      Every project starts with an idea and ends with a
                      physical piece made to be remembered.
                    </p>

                    <span className="hidden text-5xl font-light text-white/10 sm:block">
                      LAB
                    </span>

                  </div>

                </div>

              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-accent)]">
                  More Than a Catalogue
                </p>

                <h2 className="store-heading mt-3">
                  The product is only the starting point.
                </h2>

                <p className="mt-5 text-sm leading-7 text-black/60">
                  Our catalogue gives you a place to discover products and
                  possibilities. Personalisation is where your project
                  becomes yours.
                </p>

                <p className="mt-5 text-sm leading-7 text-black/60">
                  Whether you are creating one meaningful gift or preparing
                  a larger project, the same process applies: understand the
                  requirement, prepare the artwork, engrave the piece and
                  make sure the finished result is ready for you.
                </p>

                <a
                  href="/request-quote"
                  className="
                    mt-8 inline-flex min-h-12
                    items-center justify-center
                    bg-[var(--store-ink)]
                    px-7
                    text-sm font-semibold text-white
                    transition-all duration-200
                    hover:bg-black
                  "
                >
                  Bring Your Idea to the Lab
                </a>

              </div>

            </div>

          </div>
        </section>

        {/* ============================================================
            THREE PRINCIPLES
        ============================================================ */}

        <section className="border-y border-[var(--store-line)]">
          <div className="store-container py-16 sm:py-20">

            <div className="mb-10 max-w-2xl">

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-accent)]">
                Our Approach
              </p>

              <h2 className="store-heading mt-3">
                Built around your project.
              </h2>

            </div>

            <div className="grid gap-px overflow-hidden border border-[var(--store-line)] bg-[var(--store-line)] md:grid-cols-3">

              {principles.map((principle) => (
                <div
                  key={principle.title}
                  className="bg-white p-7 sm:p-9"
                >
                  <h3 className="text-xl font-semibold tracking-[-0.025em]">
                    {principle.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-black/55">
                    {principle.text}
                  </p>
                </div>
              ))}

            </div>

          </div>
        </section>

        {/* ============================================================
            VIDEO SHOWCASE PLACEHOLDER
        ============================================================ */}

        <section className="bg-[var(--store-ink)] text-white">
          <div className="store-container py-16 sm:py-20">

            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">

              <div className="max-w-2xl">

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-accent)]">
                  Inside the Studio
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  See how the Lab works.
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/55">
                  From preparation to engraving and finishing, the process
                  behind the product matters.
                </p>

              </div>

              <a
                href="/contact"
                className="
                  inline-flex min-h-11 shrink-0
                  items-center justify-center
                  border border-white/20 px-6
                  text-sm font-semibold
                  transition-all duration-200
                  hover:border-white/50
                  hover:bg-white/10
                "
              >
                Contact the Lab
              </a>

            </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
  {[
    {
      title: "The Making",
      text: "From idea to prepared artwork.",
      src: "/videos/showcase-01.mp4",
    },
    {
      title: "The Detail",
      text: "Precision engraving in progress.",
      src: "/videos/showcase-02.mp4",
    },
    {
      title: "The Finish",
      text: "The final piece ready to go.",
      src: "/videos/showcase-03.mp4",
    },
  ].map((video) => (
    <div
      key={video.title}
      className="
        group
        relative
        aspect-video
        overflow-hidden
        border border-white/10
        bg-white/[0.04]
      "
    >
      <video
        src={video.src}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        className="
          absolute inset-0
          h-full w-full
          object-cover
          transition-transform duration-700
          group-hover:scale-[1.03]
        "
      />

      <div
        className="
          absolute inset-0
          bg-gradient-to-t
          from-black/80
          via-black/20
          to-transparent
        "
      />

      <div className="relative flex h-full flex-col justify-end p-6">
        <p className="text-sm font-semibold text-white">
          {video.title}
        </p>

        <p className="mt-1 text-xs text-white/60">
          {video.text}
        </p>
      </div>
    </div>
  ))}
</div>

          </div>
        </section>

        {/* ============================================================
            FAQ
        ============================================================ */}

        <section className="store-section">
          <div className="store-container">

            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-accent)]">
                  Questions
                </p>

                <h2 className="store-heading mt-3">
                  Before you start.
                </h2>

                <p className="mt-5 max-w-sm text-sm leading-7 text-black/55">
                  Here are a few things customers commonly want to know
                  before sending a project to the Lab.
                </p>

              </div>

              <div className="divide-y divide-[var(--store-line)] border-y border-[var(--store-line)]">

                {faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group"
                  >
                    <summary
                      className="
                        flex cursor-pointer list-none
                        items-center justify-between gap-6
                        py-6 text-sm font-semibold
                      "
                    >
                      <span>{faq.question}</span>

                      <span
                        className="
                          shrink-0 text-xl font-light
                          transition-transform duration-200
                          group-open:rotate-45
                        "
                      >
                        +
                      </span>
                    </summary>

                    <p className="max-w-2xl pb-6 text-sm leading-7 text-black/55">
                      {faq.answer}
                    </p>
                  </details>
                ))}

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
              Ready When You Are
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Find something you like.
              <span className="block text-black/40">
                Then make it yours.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-black/55">
              Browse the catalogue, choose your products and tell us how
              you would like them personalised.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

              <a
                href="/catalogue"
                className="
                  inline-flex min-h-12 items-center justify-center
                  bg-[var(--store-ink)] px-8
                  text-sm font-semibold text-white
                  transition-all duration-200
                  hover:bg-black
                "
              >
                Browse Catalogue
              </a>

              <a
                href="/request-quote"
                className="
                  inline-flex min-h-12 items-center justify-center
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