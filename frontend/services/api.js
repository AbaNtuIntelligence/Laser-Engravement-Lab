const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

async function apiRequest(path) {
  const response = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export async function getApiStatus() {
  return apiRequest("/api/status/");
}

let cataloguePromise = null;

export async function getProducts(filters = {}) {
  if (!cataloguePromise) {
    cataloguePromise = fetch("/data/products.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Catalogue unavailable: ${response.status}`
          );
        }
        return response.json();
      })
      .catch((error) => {
        cataloguePromise = null;
        throw error;
      });
  }

  const data = await cataloguePromise;
  let products = Array.isArray(data.products)
    ? data.products
    : [];

  if (filters.category) {
    products = products.filter(
      (product) =>
        product.category?.toLowerCase() ===
        filters.category.toLowerCase()
    );
  }

  if (filters.subcategory) {
    products = products.filter(
      (product) =>
        product.subcategory?.toLowerCase() ===
        filters.subcategory.toLowerCase()
    );
  }

  if (typeof filters.featured === "boolean") {
    products = products.filter(
      (product) => product.featured === filters.featured
    );
  }

  if (typeof filters.new_arrival === "boolean") {
    products = products.filter(
      (product) => product.new_arrival === filters.new_arrival
    );
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();

    products = products.filter((product) =>
      [
        product.name,
        product.description,
        product.category,
        product.subcategory,
        product.sku,
      ].some((value) =>
        String(value || "").toLowerCase().includes(search)
      )
    );
  }

  return {
    ...data,
    products,
  };
}

export async function submitQuote(payload) {
  const response = await fetch(`${API_URL}/api/orders/quotes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Unable to submit quote request.");
  }

  return data;
}
