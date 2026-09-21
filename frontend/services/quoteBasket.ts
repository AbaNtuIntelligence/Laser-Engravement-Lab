"use client";

export type QuoteProduct = {
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
  images: string[];
  description: string;
};

export type QuoteItem = {
  product: QuoteProduct;
  quantity: number;
};

const STORAGE_KEY = "laser-engraving-quote-basket";

export function getQuoteBasket(): QuoteItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveQuoteBasket(items: QuoteItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(items)
  );

  window.dispatchEvent(
    new Event("quote-basket-updated")
  );
}

export function addToQuote(
  product: QuoteProduct,
  quantity = 1
) {
  const safeQuantity = Math.max(
    1,
    Math.floor(quantity)
  );

  const basket = getQuoteBasket();

  const existingItem = basket.find(
    (item) => item.product.id === product.id
  );

  if (existingItem) {
    existingItem.quantity += safeQuantity;
  } else {
    basket.push({
      product,
      quantity: safeQuantity,
    });
  }

  saveQuoteBasket(basket);

  return basket;
}

export function updateQuoteQuantity(
  productId: string,
  quantity: number
) {
  const basket = getQuoteBasket();

  const safeQuantity = Math.floor(quantity);

  if (safeQuantity <= 0) {
    const updatedBasket = basket.filter(
      (item) => item.product.id !== productId
    );

    saveQuoteBasket(updatedBasket);

    return updatedBasket;
  }

  const updatedBasket = basket.map((item) => {
    if (item.product.id !== productId) {
      return item;
    }

    return {
      ...item,
      quantity: safeQuantity,
    };
  });

  saveQuoteBasket(updatedBasket);

  return updatedBasket;
}

export function removeFromQuote(
  productId: string
) {
  const basket = getQuoteBasket();

  const updatedBasket = basket.filter(
    (item) => item.product.id !== productId
  );

  saveQuoteBasket(updatedBasket);

  return updatedBasket;
}

export function clearQuoteBasket() {
  saveQuoteBasket([]);
}

export function getQuoteItemCount() {
  return getQuoteBasket().reduce(
    (total, item) => total + item.quantity,
    0
  );
}

export function getQuoteSubtotal() {
  return getQuoteBasket().reduce(
    (total, item) => {
      if (item.product.price === null) {
        return total;
      }

      return (
        total +
        item.product.price * item.quantity
      );
    },
    0
  );
}