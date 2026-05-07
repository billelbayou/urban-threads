import { Cart } from "@/types/cart";
import { api, fetchWithTimeout, buildHeaders, unwrapData } from "./client";

export const fetchCart = async (): Promise<Cart | null> => {
  const res = await fetchWithTimeout(`${api}/cart`, {
    headers: await buildHeaders(),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return unwrapData<Cart>(json);
};

export const addToCart = async (
  productId: string,
  quantity: number,
  size: string,
): Promise<Cart> => {
  const res = await fetchWithTimeout(`${api}/cart/add`, {
    method: "POST",
    headers: await buildHeaders({ contentType: "application/json" }),
    body: JSON.stringify({ productId, quantity, size }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to add to cart");
  }
  const json = await res.json();
  return unwrapData<Cart>(json);
};

export const removeFromCart = async (itemId: string): Promise<Cart> => {
  const res = await fetchWithTimeout(`${api}/cart/item/${itemId}`, {
    method: "DELETE",
    headers: await buildHeaders({ contentType: "application/json" }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to remove from cart");
  }
  const json = await res.json();
  return unwrapData<Cart>(json);
};
