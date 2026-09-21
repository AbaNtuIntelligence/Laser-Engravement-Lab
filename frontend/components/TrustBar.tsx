const trustItems = [
  "Premium craftsmanship",
  "Custom engraving",
  "Johannesburg based",
  "WhatsApp support",
  "Collection & delivery",
];


export default function TrustBar() {

  return (

    <section className="border-y border-[var(--store-line)] bg-white">

      <div className="store-container grid divide-y divide-[var(--store-line)] md:grid-cols-5 md:divide-x md:divide-y-0">

        {trustItems.map((item) => (

          <div
            key={item}
            className="flex items-center justify-center px-4 py-5 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--store-muted)]"
          >
            {item}
          </div>

        ))}

      </div>

    </section>

  );
}
