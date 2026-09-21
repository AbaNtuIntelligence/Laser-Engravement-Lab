"use client";

type ShowcaseVideo = {
  id: number;
  title: string;
  description: string;
  src: string;
};

const videos: ShowcaseVideo[] = [
  {
    id: 1,
    title: "The Making",
    description:
      "Watch personalised pieces take shape from blank material to finished product.",
    src: "/videos/showcase-01.mp4",
  },
  {
    id: 2,
    title: "The Detail",
    description:
      "Precision engraving brings names, messages and designs to life.",
    src: "/videos/showcase-02.mp4",
  },
  {
    id: 3,
    title: "The Finish",
    description:
      "From individual gifts to corporate pieces, every detail matters.",
    src: "/videos/showcase-03.mp4",
  },
];

export default function VideoShowcase() {
  return (
    <section
      id="video-showcase"
      className="border-y border-[var(--store-line)] bg-[var(--store-dark)] text-white"
    >
      <div className="store-container py-16 md:py-24">

        {/* =====================================================
            SECTION INTRO
        ====================================================== */}

        <div className="max-w-2xl">

          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--store-accent)]">
            Inside the Studio
          </p>

          <h2 className="mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.045em] md:text-6xl">
            Made by hand.
            <br />
            Finished by light.
          </h2>

          <p className="mt-6 text-sm leading-7 text-white/65 md:text-base">
            Take a look behind the scenes and see how our
            personalised pieces are engraved, finished and
            prepared for the people they are made for.
          </p>

        </div>


        {/* =====================================================
            VIDEO GRID
        ====================================================== */}

        <div className="mt-12 grid gap-5 md:grid-cols-3">

          {videos.map((video) => (

            <article
              key={video.id}
              className="group overflow-hidden border border-white/10 bg-black"
            >

              {/* VIDEO */}

              <div className="relative aspect-[4/5] overflow-hidden bg-black">

                <video
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  src={video.src}
                  muted
                  loop
                  autoPlay
                  playsInline
                  preload="metadata"
                />

                {/* TOP LABEL */}

                <div className="absolute left-4 top-4">

                  <span className="bg-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--store-ink)]">
                    0{video.id}
                  </span>

                </div>

              </div>


              {/* VIDEO INFORMATION */}

              <div className="border-t border-white/10 px-5 py-5">

                <h3 className="text-sm font-semibold text-white">
                  {video.title}
                </h3>

                <p className="mt-2 text-xs leading-6 text-white/55">
                  {video.description}
                </p>

              </div>

            </article>

          ))}

        </div>


        {/* =====================================================
            CTA
        ====================================================== */}

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">

          <p className="max-w-xl text-xs leading-6 text-white/50">
            Have something specific in mind? Tell us what you
            want engraved and we will prepare a tailored quote.
          </p>

          <a
            href="/request-quote"
            className="inline-flex h-12 shrink-0 items-center justify-center bg-white px-6 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--store-ink)] transition hover:bg-white/90"
          >
            Request a Quote
          </a>

        </div>

      </div>
    </section>
  );
}