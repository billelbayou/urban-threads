import { Cart } from "@/types/cart";
import { api, fetchWithTimeout } from "./client";

/* -------------------- CART -------------------- */

/**
 * @returns Cart | null - The user's cart or null if not found
 * Response: Cart
 */
export const fetchCart = async (cookie?: string): Promise<Cart | null> => {
  const headers: Record<string, string> = {};
  if (cookie) headers["cookie"] = cookie;
  const res = await fetchWithTimeout(`${api}/cart`, {
    headers,
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
) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cookie) headers["cookie"] = cookie;
  const res = await fetchWithTimeout(`${api}/cart/add`, {
    method: "POST",
    headers,
    credentials: cookie ? undefined : "include",
    body: JSON.stringify({ productId, quantity, size }),
  });

  const data = await res.json();
  return data;
};

/**
 * @param itemId - The cart item ID to remove
 * @returns Cart - The updated cart
 * Response: Cart
 */
export const removeFromCart = async (itemId: string, cookie: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cookie) headers["cookie"] = cookie;
  const res = await fetchWithTimeout(`${api}/cart/item/${itemId}`, {
    method: "DELETE",
    headers,
    credentials: cookie ? undefined : "include",
  });

  const data = await res.json();
  return data;
};
