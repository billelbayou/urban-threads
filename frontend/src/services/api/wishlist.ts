import { Wishlist } from "@/types/wishlist";
import { api, fetchWithTimeout, buildHeaders } from "./client";

/* -------------------- WISHLIST -------------------- */

/**
 * @returns Wishlist | null - The user's wishlist or null if not found
 * Response: Wishlist
 */
export const fetchWishlist = async (
  cookie?: string,
): Promise<Wishlist | null> => {
  const res = await fetchWithTimeout(`${api}/wishlist`, {
    headers: buildHeaders({ cookie }),
    credentials: cookie ? undefined : "include",
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
};

/**
 * @param productId - The product ID to add to wishlist
 * @returns Wishlist - The updated wishlist
 * Response: Wishlist
 */
export const addToWishlistFetcher = async (
  productId: string,
  cookie?: string,
): Promise<Wishlist> => {
  const res = await fetchWithTimeout(`${api}/wishlist/add`, {
    method: "POST",
    headers: buildHeaders({ cookie, contentType: "application/json" }),
    credentials: cookie ? undefined : "include",
    body: JSON.stringify({ productId }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to add to wishlist");
  }
  return data;
};

/**
 * @param productId - The product ID to remove from wishlist
 * @returns Wishlist - The updated wishlist
 * Response: Wishlist
 */
export const removeFromWishlistFetcher = async (
  productId: string,
  cookie?: string,
): Promise<Wishlist> => {
  const res = await fetchWithTimeout(`${api}/wishlist/${productId}`, {
    method: "DELETE",
    headers: buildHeaders({ cookie, contentType: "application/json" }),
    credentials: cookie ? undefined : "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to remove from wishlist");
  }
  return data;
};
