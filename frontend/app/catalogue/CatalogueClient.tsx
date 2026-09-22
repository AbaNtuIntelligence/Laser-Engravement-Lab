"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/services/api";

type Product = {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  brand: string | null;
  sku: string;
  slug: string;
  unit: string;
  price: number | null;
  compare_price: number | null;
  featured: boolean;
  new_arrival: boolean;
  active: boolean;
  stock: number;
  images: string[];
  description: string;
  features: string[];
};

const CATEGORY_ORDER = [
  "Corporate",
  "Custom",
  "Gifts",
  "Home",
  "Jewellery",
];

export default function CataloguePage() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [selectedSubcategory, setSelectedSubcategory] =
    useState("All");

  const [selectedNewArrival, setSelectedNewArrival] =
    useState(false);

  const [search, setSearch] = useState("");

  /*
   * ============================================================
   * READ FILTERS FROM URL
   * ============================================================
   *
   * Supported URLs:
   *
   * /catalogue
   * /catalogue?category=Gifts
   * /catalogue?category=Jewellery
   * /catalogue?category=Home
   * /catalogue?category=Corporate
   * /catalogue?new_arrival=true
   *
   */

  useEffect(() => {
    const categoryParam =
      searchParams.get("category");

    const newArrivalParam =
      searchParams.get("new_arrival");

    if (categoryParam) {
      const matchingCategory =
        CATEGORY_ORDER.find(
          (category) =>
            category.toLowerCase() ===
            categoryParam.toLowerCase()
        );

      if (matchingCategory) {
        setSelectedCategory(matchingCategory);
      } else {
        setSelectedCategory("All");
      }
    } else {
      setSelectedCategory("All");
    }

    setSelectedSubcategory("All");

    setSelectedNewArrival(
      newArrivalParam?.toLowerCase() === "true"
    );
  }, [searchParams]);

  /*
   * ============================================================
   * LOAD PRODUCTS
   * ============================================================
   */

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        if (mounted) {
          setProducts(data.products || []);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load the catalogue."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * ============================================================
   * BUILD CATEGORY LIST
   * ============================================================
   */

  const categories = useMemo(() => {
    const available = new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    );

    const ordered = CATEGORY_ORDER.filter((category) =>
      available.has(category)
    );

    const additional = Array.from(available)
      .filter(
        (category) =>
          !CATEGORY_ORDER.includes(category)
      )
      .sort();

    return [...ordered, ...additional];
  }, [products]);

  /*
   * ============================================================
   * BUILD SUBCATEGORY LIST
   * ============================================================
   */

  const subcategories = useMemo(() => {
    const source =
      selectedCategory === "All"
        ? products
        : products.filter(
            (product) =>
              product.category === selectedCategory
          );

    return Array.from(
      new Set(
        source
          .map((product) => product.subcategory)
          .filter(
            (subcategory): subcategory is string =>
              Boolean(subcategory)
          )
      )
    ).sort();
  }, [products, selectedCategory]);

  /*
   * ============================================================
   * FILTER PRODUCTS
   * ============================================================
   */

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const categoryMatch =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const subcategoryMatch =
        selectedSubcategory === "All" ||
        product.subcategory === selectedSubcategory;

      const newArrivalMatch =
        !selectedNewArrival ||
        product.new_arrival === true;

      const searchMatch =
        !query ||
        [
          product.name,
          product.category,
          product.subcategory,
          product.brand,
          product.sku,
          product.description,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(query)
          );

      return (
        categoryMatch &&
        subcategoryMatch &&
        newArrivalMatch &&
        searchMatch
      );
    });
  }, [
    products,
    selectedCategory,
    selectedSubcategory,
    selectedNewArrival,
    search,
  ]);

  /*
   * ============================================================
   * UPDATE URL
   * ============================================================
   */

  function updateUrl(
    category: string = "All",
    newArrival: boolean = false
  ) {
    const params = new URLSearchParams();

    if (category !== "All") {
      params.set("category", category);
    }

    if (newArrival) {
      params.set("new_arrival", "true");
    }

    const query = params.toString();

    window.history.pushState(
      {},
      "",
      query
        ? `/catalogue?${query}`
        : "/catalogue"
    );
  }

  /*
   * ============================================================
   * CATEGORY CHANGE
   * ============================================================
   */

  function handleCategoryChange(category: string) {
    setSelectedCategory(category);
    setSelectedSubcategory("All");
    setSelectedNewArrival(false);

    updateUrl(category, false);
  }

  /*
   * ============================================================
   * NEW ARRIVALS
   * ============================================================
   */

  function handleNewArrivals() {
    setSelectedCategory("All");
    setSelectedSubcategory("All");
    setSelectedNewArrival(true);

    updateUrl("All", true);
  }

  /*
   * ============================================================
   * CLEAR ALL
   * ============================================================
   */

  function clearAllFilters() {
    setSelectedCategory("All");
    setSelectedSubcategory("All");
    setSelectedNewArrival(false);
    setSearch("");

    updateUrl("All", false);
  }

  return (
    <>
      <Header />

      <main className="bg-[var(--store-paper)]">

        {/* =====================================================
            CATALOGUE HERO
        ====================================================== */}

        <section className="border-b border-[var(--store-line)] bg-[var(--store-dark)] text-white">

          <div className="store-container py-16 md:py-24">

            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--store-accent)]">
              Laser Engraving Store
            </p>

            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] md:text-7xl">
              Product Catalogue
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
              Explore our collection of personalised gifts,
              engraved products, corporate pieces and custom
              designs. Every piece can be prepared as part of
              a tailored quote.
            </p>

          </div>

        </section>

        {/* =====================================================
            CATALOGUE CONTENT
        ====================================================== */}

        <section className="store-container py-10 md:py-14">

          {/* SEARCH + DOWNLOAD */}

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative w-full lg:max-w-xl">

              <label
                htmlFor="catalogue-search"
                className="sr-only"
              >
                Search products
              </label>

              <input
                id="catalogue-search"
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search products, categories or SKU..."
                className="
                  h-12
                  w-full
                  border
                  border-[var(--store-line)]
                  bg-white
                  px-4
                  text-sm
                  text-[var(--store-ink)]
                  outline-none
                  transition
                  placeholder:text-[var(--store-muted)]
                  focus:border-[var(--store-ink)]
                "
              />

            </div>

            <a
              href={`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/catalogue/download/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 shrink-0 items-center justify-center border border-[var(--store-ink)] bg-[var(--store-ink)] px-6 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-black"
            >
              Download Catalogue
            </a>

          </div>

          {/* =================================================
              CATEGORY NAVIGATION
          ================================================== */}

          <div className="mt-10">

            <div className="mb-4 flex items-center justify-between gap-4">

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--store-muted)]">
                Browse by category
              </p>

              <span className="text-xs text-[var(--store-muted)]">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? "product"
                  : "products"}
              </span>

            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">

              <button
                type="button"
                onClick={() =>
                  handleCategoryChange("All")
                }
                className={`
                  shrink-0
                  border
                  px-5
                  py-3
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  transition
                  ${
                    selectedCategory === "All" &&
                    !selectedNewArrival
                      ? "border-[var(--store-ink)] bg-[var(--store-ink)] text-white"
                      : "border-[var(--store-line)] bg-white text-[var(--store-ink)] hover:border-[var(--store-ink)]"
                  }
                `}
              >
                All Products
              </button>

              {categories.map((category) => (

                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    handleCategoryChange(category)
                  }
                  className={`
                    shrink-0
                    border
                    px-5
                    py-3
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    transition
                    ${
                      selectedCategory === category &&
                      !selectedNewArrival
                        ? "border-[var(--store-ink)] bg-[var(--store-ink)] text-white"
                        : "border-[var(--store-line)] bg-white text-[var(--store-ink)] hover:border-[var(--store-ink)]"
                    }
                  `}
                >
                  {category}
                </button>

              ))}

              <button
                type="button"
                onClick={handleNewArrivals}
                className={`
                  shrink-0
                  border
                  px-5
                  py-3
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  transition
                  ${
                    selectedNewArrival
                      ? "border-[var(--store-ink)] bg-[var(--store-ink)] text-white"
                      : "border-[var(--store-line)] bg-white text-[var(--store-ink)] hover:border-[var(--store-ink)]"
                  }
                `}
              >
                New Arrivals
              </button>

            </div>

          </div>

          {/* =================================================
              SUBCATEGORY NAVIGATION
          ================================================== */}

          {subcategories.length > 0 &&
            !selectedNewArrival && (

            <div className="mt-5">

              <div className="flex gap-2 overflow-x-auto pb-2">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedSubcategory("All")
                  }
                  className={`
                    shrink-0
                    rounded-full
                    border
                    px-4
                    py-2
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    transition
                    ${
                      selectedSubcategory === "All"
                        ? "border-[var(--store-accent)] bg-[var(--store-accent)] text-white"
                        : "border-[var(--store-line)] bg-white text-[var(--store-muted)] hover:border-[var(--store-accent)]"
                    }
                  `}
                >
                  All
                </button>

                {subcategories.map(
                  (subcategory) => (

                    <button
                      key={subcategory}
                      type="button"
                      onClick={() =>
                        setSelectedSubcategory(
                          subcategory
                        )
                      }
                      className={`
                        shrink-0
                        rounded-full
                        border
                        px-4
                        py-2
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        transition
                        ${
                          selectedSubcategory ===
                          subcategory
                            ? "border-[var(--store-accent)] bg-[var(--store-accent)] text-white"
                            : "border-[var(--store-line)] bg-white text-[var(--store-muted)] hover:border-[var(--store-accent)]"
                        }
                      `}
                    >
                      {subcategory}
                    </button>

                  )
                )}

              </div>

            </div>

          )}

          {/* =================================================
              ACTIVE FILTER
          ================================================== */}

          {(selectedCategory !== "All" ||
            selectedSubcategory !== "All" ||
            selectedNewArrival ||
            search) && (

            <div className="mt-8 flex flex-wrap items-center gap-3">

              <span className="text-xs text-[var(--store-muted)]">
                Showing:
              </span>

              {selectedCategory !== "All" && (
                <button
                  type="button"
                  onClick={() =>
                    handleCategoryChange("All")
                  }
                  className="border border-[var(--store-line)] bg-white px-3 py-2 text-xs text-[var(--store-ink)]"
                >
                  {selectedCategory} ×
                </button>
              )}

              {selectedNewArrival && (
                <button
                  type="button"
                  onClick={() =>
                    clearAllFilters()
                  }
                  className="border border-[var(--store-line)] bg-white px-3 py-2 text-xs text-[var(--store-ink)]"
                >
                  New Arrivals ×
                </button>
              )}

              {selectedSubcategory !== "All" && (
                <button
                  type="button"
                  onClick={() =>
                    setSelectedSubcategory("All")
                  }
                  className="border border-[var(--store-line)] bg-white px-3 py-2 text-xs text-[var(--store-ink)]"
                >
                  {selectedSubcategory} ×
                </button>
              )}

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="border border-[var(--store-line)] bg-white px-3 py-2 text-xs text-[var(--store-ink)]"
                >
                  Search: {search} ×
                </button>
              )}

              <button
                type="button"
                onClick={clearAllFilters}
                className="px-2 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--store-muted)] underline underline-offset-4"
              >
                Clear all
              </button>

            </div>

          )}

          {/* =================================================
              LOADING
          ================================================== */}

          {loading && (

            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">

              {[1, 2, 3, 4, 5, 6, 7, 8].map(
                (item) => (

                  <div key={item}>

                    <div className="aspect-[4/5] animate-pulse bg-[var(--store-soft)]" />

                    <div className="mt-4 h-2 w-20 animate-pulse bg-[var(--store-soft)]" />

                    <div className="mt-2 h-4 w-4/5 animate-pulse bg-[var(--store-soft)]" />

                    <div className="mt-3 h-4 w-24 animate-pulse bg-[var(--store-soft)]" />

                  </div>

                )
              )}

            </div>

          )}

          {/* =================================================
              ERROR
          ================================================== */}

          {!loading && error && (

            <div className="mt-12 border border-[var(--store-line)] bg-white px-6 py-12 text-center">

              <p className="text-sm font-semibold text-[var(--store-ink)]">
                Catalogue unavailable
              </p>

              <p className="mt-2 text-xs text-[var(--store-muted)]">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="mt-6 border border-[var(--store-ink)] bg-[var(--store-ink)] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white"
              >
                Try again
              </button>

            </div>

          )}

          {/* =================================================
              EMPTY
          ================================================== */}

          {!loading &&
            !error &&
            filteredProducts.length === 0 && (

              <div className="mt-12 border border-[var(--store-line)] bg-white px-6 py-16 text-center">

                <p className="text-sm font-semibold text-[var(--store-ink)]">
                  No products found
                </p>

                <p className="mt-2 text-xs text-[var(--store-muted)]">
                  Try another search or browse a
                  different category.
                </p>

                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-6 border border-[var(--store-ink)] bg-[var(--store-ink)] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white"
                >
                  View all products
                </button>

              </div>

            )}

          {/* =================================================
              PRODUCT GRID
          ================================================== */}

          {!loading &&
            !error &&
            filteredProducts.length > 0 && (

              <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-14">

                {filteredProducts.map((product) => (

                  <ProductCard
                    key={product.id}
                    product={product}
                  />

                ))}

              </div>

            )}

        </section>

      </main>

      <Footer />
    </>
  );
}