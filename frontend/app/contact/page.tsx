"use client";

import { FormEvent, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <Header />

      <main className="bg-white text-[var(--store-ink)]">

        {/* ============================================================
            HERO
        ============================================================ */}

        <section className="border-b border-[var(--store-line)] bg-[var(--store-ink)] text-white">
          <div className="store-container py-20 sm:py-24 lg:py-28">

            <div className="max-w-3xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--store-accent)]">
                Contact the Lab
              </p>

              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                Let&apos;s make something
                <span className="block text-white/55">
                  worth keeping.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
                Have a product you want personalised, a gift idea that needs
                bringing to life, or a larger corporate engraving project?
                Talk to the Laser Engraving Lab.
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="/request-quote"
                className="
                  inline-flex min-h-12 items-center justify-center
                  bg-white px-7 text-sm font-semibold
                  text-[var(--store-ink)]
                  transition-all duration-200
                  hover:bg-[var(--store-accent)]
                  hover:text-white
                "
              >
                Start a Quote
              </a>

              <a
                href="https://wa.me/27716299701"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex min-h-12 items-center justify-center
                  border border-white/20 px-7
                  text-sm font-semibold text-white
                  transition-all duration-200
                  hover:border-white/50
                  hover:bg-white/10
                "
              >
                WhatsApp the Lab
              </a>
            </div>

          </div>
        </section>

        {/* ============================================================
            CONTACT GRID
        ============================================================ */}

        <section className="store-section">
          <div className="store-container">

            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">

              {/* --------------------------------------------------------
                  LAB DETAILS
              -------------------------------------------------------- */}

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-accent)]">
                  Visit the Lab
                </p>

                <h2 className="store-heading mt-3">
                  The Laser Engraving Lab
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-black/60">
                  We create personalised and engraved products for gifts,
                  homes, special occasions, businesses, events and corporate
                  projects.
                </p>

                <div className="mt-9 divide-y divide-[var(--store-line)] border-y border-[var(--store-line)]">

                  {/* Address */}

                  <div className="py-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/40">
                      Address
                    </p>

                    <address className="mt-3 not-italic text-sm leading-6">
                      118 High Street
                      <br />
                      Turffontein
                      <br />
                      Johannesburg
                      <br />
                      Gauteng 2190
                    </address>
                  </div>

                  {/* Phone */}

                  <div className="py-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/40">
                      Telephone
                    </p>

                    <a
                      href="tel:+27116810465"
                      className="mt-3 inline-block text-sm font-semibold transition-colors hover:text-[var(--store-accent)]"
                    >
                      011 681 0465
                    </a>
                  </div>

                  {/* WhatsApp */}

                  <div className="py-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/40">
                      WhatsApp
                    </p>

                    <a
                      href="https://wa.me/27716299701"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm font-semibold transition-colors hover:text-[var(--store-accent)]"
                    >
                      071 629 9701
                    </a>
                  </div>

                </div>

                {/* Quick actions */}

                <div className="mt-7 grid gap-3 sm:grid-cols-2">

                  <a
                    href="tel:+27116810465"
                    className="
                      flex min-h-12 items-center justify-center
                      border border-[var(--store-line)]
                      px-5 text-sm font-semibold
                      transition-all duration-200
                      hover:border-[var(--store-ink)]
                    "
                  >
                    Call the Lab
                  </a>

                  <a
                    href="https://wa.me/27716299701"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex min-h-12 items-center justify-center
                      border border-[var(--store-line)]
                      px-5 text-sm font-semibold
                      transition-all duration-200
                      hover:border-[var(--store-ink)]
                    "
                  >
                    WhatsApp
                  </a>

                </div>

              </div>

              {/* --------------------------------------------------------
                  CONTACT FORM
              -------------------------------------------------------- */}

              <div className="border border-[var(--store-line)] bg-[#fafafa] p-6 sm:p-8 lg:p-10">

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-accent)]">
                  Send an Enquiry
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                  Tell us what you&apos;re working on.
                </h2>

                <p className="mt-3 text-sm leading-6 text-black/55">
                  Give us a few details and we&apos;ll get back to you about
                  your engraving requirements.
                </p>

                {submitted ? (
                  <div className="mt-8 border border-[var(--store-line)] bg-white p-6">
                    <p className="text-sm font-semibold">
                      Thanks — your enquiry has been received.
                    </p>

                    <p className="mt-2 text-sm leading-6 text-black/55">
                      We&apos;ll review your message and get back to you.
                    </p>

                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="
                        mt-5 text-xs font-bold uppercase
                        tracking-[0.14em]
                        text-[var(--store-ink)]
                        underline underline-offset-4
                      "
                    >
                      Send another enquiry
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-5"
                  >

                    {/* Name */}

                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-xs font-semibold"
                      >
                        Name
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Your name"
                        className="
                          h-12 w-full
                          border border-[var(--store-line)]
                          bg-white px-4
                          text-sm outline-none
                          transition-colors
                          placeholder:text-black/30
                          focus:border-[var(--store-ink)]
                        "
                      />
                    </div>

                    {/* Email */}

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-xs font-semibold"
                      >
                        Email
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="
                          h-12 w-full
                          border border-[var(--store-line)]
                          bg-white px-4
                          text-sm outline-none
                          transition-colors
                          placeholder:text-black/30
                          focus:border-[var(--store-ink)]
                        "
                      />
                    </div>

                    {/* Phone */}

                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-xs font-semibold"
                      >
                        Phone / WhatsApp
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="Your contact number"
                        className="
                          h-12 w-full
                          border border-[var(--store-line)]
                          bg-white px-4
                          text-sm outline-none
                          transition-colors
                          placeholder:text-black/30
                          focus:border-[var(--store-ink)]
                        "
                      />
                    </div>

                    {/* Project */}

                    <div>
                      <label
                        htmlFor="project"
                        className="mb-2 block text-xs font-semibold"
                      >
                        What can we engrave?
                      </label>

                      <select
                        id="project"
                        name="project"
                        defaultValue=""
                        className="
                          h-12 w-full
                          border border-[var(--store-line)]
                          bg-white px-4
                          text-sm outline-none
                          transition-colors
                          focus:border-[var(--store-ink)]
                        "
                      >
                        <option value="" disabled>
                          Select an option
                        </option>
                        <option value="personalised-gift">
                          Personalised Gift
                        </option>
                        <option value="home">
                          Home & Lifestyle
                        </option>
                        <option value="jewellery">
                          Jewellery
                        </option>
                        <option value="corporate">
                          Corporate / Business
                        </option>
                        <option value="event">
                          Event / Celebration
                        </option>
                        <option value="custom">
                          Custom Project
                        </option>
                      </select>
                    </div>

                    {/* Message */}

                    <div>
                      <label
                        htmlFor="message"
                        className="mb-2 block text-xs font-semibold"
                      >
                        Message
                      </label>

                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        placeholder="Tell us what you have in mind..."
                        className="
                          w-full resize-y
                          border border-[var(--store-line)]
                          bg-white px-4 py-3
                          text-sm leading-6
                          outline-none
                          transition-colors
                          placeholder:text-black/30
                          focus:border-[var(--store-ink)]
                        "
                      />
                    </div>

                    {/* Submit */}

                    <button
                      type="submit"
                      className="
                        flex min-h-12 w-full
                        items-center justify-center
                        bg-[var(--store-ink)]
                        px-6
                        text-sm font-semibold
                        text-white
                        transition-all duration-200
                        hover:bg-black
                      "
                    >
                      Send Enquiry
                    </button>

                  </form>
                )}

              </div>

            </div>

          </div>
        </section>

        {/* ============================================================
            CUSTOM WORK BANNER
        ============================================================ */}

        <section className="border-y border-[var(--store-line)] bg-[#f7f7f5]">
          <div className="store-container py-16 sm:py-20">

            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">

              <div className="max-w-2xl">

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-accent)]">
                  Custom Work
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  Don&apos;t see what you&apos;re looking for?
                </h2>

                <p className="mt-4 text-sm leading-7 text-black/55 sm:text-base">
                  Our catalogue is only the beginning. If you have your own
                  design, artwork, wording or product idea, send it to us and
                  let&apos;s explore what we can create.
                </p>

              </div>

              <a
                href="/request-quote"
                className="
                  inline-flex min-h-12
                  items-center justify-center
                  bg-[var(--store-ink)]
                  px-7
                  text-sm font-semibold
                  text-white
                  transition-all duration-200
                  hover:bg-black
                "
              >
                Request a Custom Quote
              </a>

            </div>

          </div>
        </section>

        {/* ============================================================
            SERVICE STRIP
        ============================================================ */}

        <section className="bg-white">
          <div className="store-container py-12">

            <div className="grid border-y border-[var(--store-line)] sm:grid-cols-3">

              <div className="border-b border-[var(--store-line)] px-5 py-6 sm:border-b-0 sm:border-r">
                <p className="text-xs font-bold uppercase tracking-[0.12em]">
                  Personalised
                </p>

                <p className="mt-2 text-sm leading-6 text-black/50">
                  Gifts and products made personal.
                </p>
              </div>

              <div className="border-b border-[var(--store-line)] px-5 py-6 sm:border-b-0 sm:border-r">
                <p className="text-xs font-bold uppercase tracking-[0.12em]">
                  Corporate
                </p>

                <p className="mt-2 text-sm leading-6 text-black/50">
                  Branded and engraved business projects.
                </p>
              </div>

              <div className="px-5 py-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em]">
                  Custom
                </p>

                <p className="mt-2 text-sm leading-6 text-black/50">
                  Bring your own idea to the engraving lab.
                </p>
              </div>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}