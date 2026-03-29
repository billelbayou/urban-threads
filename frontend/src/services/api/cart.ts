import { Cart } from "@/types/cart";
import { api, fetchWithTimeout, buildHeaders } from "./client";

/* -------------------- CART -------------------- */

/**
 * @returns Cart | null - The user's cart or null if not found
 * Response: Cart
 */
export const fetchCart = async (cookie?: string): Promise<Cart | null> => {
  const res = await fetchWithTimeout(`${api}/cart`, {
    headers: buildHeaders({ cookie }),
    credentials: cookie ? undefined : "include",
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data: Cart = await res.json();
  return data;
};

/**
 * @param productId - The product ID to add
 * @param quantity - The quantity to add
 * @param size - The product size
 * @returns Cart - The updated cart
 * Response: Cart
 */
export const addToCart = async (
  productId: string,
  quantity: number,
  size: string,
  cookie: string,
): Promise<Cart> => {
  const res = await fetchWithTimeout(`${api}/cart/add`, {
    method: "POST",
    headers: buildHeaders({ cookie, contentType: "application/json" }),
    credentials: cookie ? undefined : "include",
    body: JSON.stringify({ productId, quantity, size }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to add to cart");
  }
  const data: Cart = await res.json();
  return data;
};

/**
 * @param itemId - The cart item ID to remove
 * @returns Cart - The updated cart
 * Response: Cart
 */
export const removeFromCart = async (itemId: string, cookie: string): Promise<Cart> => {
  const res = await fetchWithTimeout(`${api}/cart/item/${itemId}`, {
    method: "DELETE",
    headers: buildHeaders({ cookie, contentType: "application/json" }),
    credentials: cookie ? undefined : "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to remove from cart");
  }
  const data: Cart = await res.json();
  return data;
};
