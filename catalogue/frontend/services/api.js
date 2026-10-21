const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";


async function apiRequest(path) {
  const response = await fetch(
    `${API_URL}${path}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status}`
    );
  }

  return response.json();
}


export async function getApiStatus() {
  return apiRequest("/api/status/");
}


let cataloguePromise;
let catalogueExpiresAt = 0;

export async function getProducts(filters = {}) {
  // All homepage rails and the catalogue share the same complete response.
  if (!cataloguePromise || Date.now() >= catalogueExpiresAt) {
    catalogueExpiresAt = Date.now() + 120_000;
    cataloguePromise = apiRequest("/api/catalogue/products/").catch((error) => {
      cataloguePromise = undefined;
      catalogueExpiresAt = 0;
      throw error;
    });
  }

  const data = await cataloguePromise;
  const matches = (actual, expected) =>
    String(actual ?? "").trim().toLowerCase() ===
    String(expected).trim().toLowerCase();
  const products = (data.products || []).filter((product) => {
    if (filters.category && !matches(product.category, filters.category)) return false;
    if (filters.subcategory && !matches(product.subcategory, filters.subcategory)) return false;
    if (typeof filters.featured === "boolean" && product.featured !== filters.featured) return false;
    if (typeof filters.new_arrival === "boolean" && product.new_arrival !== filters.new_arrival) return false;
    if (filters.search) {
      const term = String(filters.search).trim().toLowerCase();
      if (![product.name, product.category, product.sku, product.description]
        .some((field) => String(field ?? "").toLowerCase().includes(term))) return false;
    }
    return true;
  });
  return { ...data, count: products.length, products };
}
export async function submitQuote(payload) {
  const response = await fetch("/api/quote.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error || "Unable to submit quote request."
    );
  }

  return data;
}
