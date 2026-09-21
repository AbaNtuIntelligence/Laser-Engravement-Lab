export default function CraftSection() {

  return (

    <section className="store-section">

      <div className="store-container grid overflow-hidden rounded-[2rem] bg-stone-200 md:grid-cols-2">

        <div className="flex min-h-[420px] items-end bg-gradient-to-br from-stone-700 via-stone-500 to-stone-300 p-8 md:p-12">

          <div className="text-white">

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em]">
              Behind the craft
            </p>

            <h2 className="max-w-md text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
              Precision in every detail.
            </h2>

          </div>

        </div>


        <div className="flex items-center bg-[var(--store-ink)] p-8 text-white md:p-12">

          <div className="max-w-lg">

            <p className="text-base leading-8 text-white/60">
              Every engraved piece starts with an idea.
              We combine digital precision with hands-on
              finishing to create products that feel personal,
              considered and lasting.
            </p>

            <a
              href="#"
              className="mt-8 inline-flex text-sm font-bold underline underline-offset-8"
            >
              Discover our craft
            </a>

          </div>

        </div>

      </div>

    </section>

  );
}
