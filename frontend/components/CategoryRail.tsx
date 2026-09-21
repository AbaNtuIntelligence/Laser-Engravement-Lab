const categories = [
  {
    name: "Gifts",
    symbol: "?",
  },
  {
    name: "Jewellery",
    symbol: "?",
  },
  {
    name: "Home",
    symbol: "¦",
  },
  {
    name: "Leather",
    symbol: "?",
  },
  {
    name: "Corporate",
    symbol: "?",
  },
  {
    name: "Weddings",
    symbol: "?",
  },
  {
    name: "Custom",
    symbol: "?",
  },
];


export default function CategoryRail() {

  return (

    <section className="border-b border-[var(--store-line)] bg-white py-8">

      <div className="store-container">

        <div className="mb-5 flex items-end justify-between">

          <div>

            <p className="store-eyebrow">
              Explore
            </p>

            <h2 className="text-xl font-semibold tracking-tight">
              Shop by category
            </h2>

          </div>

          <span className="hidden text-xs text-[var(--store-muted)] sm:block">
            Swipe to explore ?
          </span>

        </div>


        <div className="store-horizontal-rail">

          {categories.map((category) => (

            <a
              key={category.name}
              href="#"
              className="group flex min-w-[112px] flex-col items-center gap-3 rounded-2xl border border-[var(--store-line)] bg-[var(--store-paper)] px-5 py-5 transition-all hover:-translate-y-1 hover:border-[var(--store-accent)]"
            >

              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl text-[var(--store-accent)] shadow-sm">
                {category.symbol}
              </span>

              <span className="whitespace-nowrap text-xs font-semibold">
                {category.name}
              </span>

            </a>

          ))}

        </div>

      </div>

    </section>

  );
}
