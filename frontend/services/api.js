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


export async function getProducts(filters = {}) {

  const params = new URLSearchParams();

  if (filters.category) {
    params.set(
      "category",
      filters.category
    );
  }

  if (filters.subcategory) {
    params.set(
      "subcategory",
      filters.subcategory
    );
  }

  if (typeof filters.featured === "boolean") {
    params.set(
      "featured",
      String(filters.featured)
    );
  }

  if (typeof filters.new_arrival === "boolean") {
    params.set(
      "new_arrival",
      String(filters.new_arrival)
    );
  }

  if (filters.search) {
    params.set(
      "search",
      filters.search
    );
  }

  const query =
    params.toString();

  const path =
    query
      ? `/api/catalogue/products/?${query}`
      : "/api/catalogue/products/";

  return apiRequest(path);
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
    throw new Error(
      data?.error || "Unable to submit quote request."
    );
  }

  return data;
}