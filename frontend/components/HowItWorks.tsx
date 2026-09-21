const steps = [
  {
    number: "01",
    title: "Choose",
    text: "Find a product from our collections.",
  },
  {
    number: "02",
    title: "Personalise",
    text: "Add names, messages, artwork or branding.",
  },
  {
    number: "03",
    title: "We craft",
    text: "Your piece is engraved and prepared with care.",
  },
  {
    number: "04",
    title: "Receive",
    text: "Collect in Johannesburg or arrange delivery.",
  },
];


export default function HowItWorks() {

  return (

    <section className="store-section bg-white">

      <div className="store-container">

        <div className="max-w-2xl">

          <p className="store-eyebrow">
            The process
          </p>

          <h2 className="store-heading">
            From idea to keepsake.
          </h2>

        </div>


        <div className="mt-12 grid gap-px overflow-hidden border border-[var(--store-line)] bg-[var(--store-line)] md:grid-cols-4">

          {steps.map((step) => (

            <div
              key={step.number}
              className="bg-white p-7 md:p-8"
            >

              <span className="text-xs font-bold tracking-[0.15em] text-[var(--store-accent)]">
                {step.number}
              </span>

              <h3 className="mt-12 text-xl font-semibold">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[var(--store-muted)]">
                {step.text}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>

  );
}
