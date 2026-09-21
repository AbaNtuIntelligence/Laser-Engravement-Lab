export default function CustomOrderBanner() {

  return (

    <section
      id="custom-order"
      className="store-section"
    >

      <div className="store-container">

        <div className="relative overflow-hidden rounded-[2rem] bg-[var(--store-ink)] px-7 py-14 text-white md:px-16 md:py-20">

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[var(--store-accent)] opacity-20 blur-3xl" />

          <div className="relative max-w-2xl">

            <p className="store-eyebrow">
              Create something personal
            </p>

            <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
              Don&apos;t just buy it.
              <span className="block text-white/50">
                Make it yours.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/60">
              Have a name, message, logo or design in mind?
              Let us turn your idea into a personalised piece.
            </p>

            <a
              href="#"
              className="store-button mt-8 bg-white text-[var(--store-ink)]"
            >
              Start a custom order
            </a>

          </div>

        </div>

      </div>

    </section>

  );
}
