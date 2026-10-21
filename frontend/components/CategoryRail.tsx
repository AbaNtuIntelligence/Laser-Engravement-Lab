const categories = [
  {
    name: "Gifts",
    symbol: "🎁",
    slug: "Gifts",
  },
  {
    name: "Jewellery",
    symbol: "✦",
    slug: "Jewellery",
  },
  {
    name: "Home",
    symbol: "⌂",
    slug: "Home",
  },
  {
    name: "Leather",
    symbol: "◈",
    slug: "Leather",
  },
  {
    name: "Corporate",
    symbol: "▣",
    slug: "Corporate",
  },
  {
    name: "Weddings",
    symbol: "♡",
    slug: "Weddings",
  },
  {
    name: "Custom",
    symbol: "✎",
    slug: "Custom",
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
              Explore by category
            </h2>

          </div>

          <span className="hidden text-xs text-[var(--store-muted)] sm:block">
            Swipe to explore
          </span>

        </div>


        <div className="store-horizontal-rail">

          {categories.map((category) => (

            <a
              key={category.name}
              href={`/catalogue/?category=${encodeURIComponent(category.slug)}`}
              className="group flex min-w-[132px] flex-col items-center gap-3 rounded-2xl border border-[var(--store-line)] bg-[var(--store-paper)] px-5 py-5 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--store-accent)] hover:shadow-sm"
            >

              <span
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-[var(--store-accent)] shadow-sm transition-transform duration-200 group-hover:scale-105"
                aria-hidden="true"
              >
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