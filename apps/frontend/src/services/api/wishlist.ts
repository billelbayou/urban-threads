import { Wishlist } from "@/types/wishlist";
import { api, fetchWithTimeout, buildHeaders, unwrapData } from "./client";

export const fetchWishlist = async (): Promise<Wishlist | null> => {
  const res = await fetchWithTimeout(`${api}/wishlist`, {
    headers: await buildHeaders(),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return unwrapData<Wishlist>(json);
};

export const addToWishlistFetcher = async (
  productId: string,
): Promise<Wishlist> => {
  const res = await fetchWithTimeout(`${api}/wishlist/add`, {
    method: "POST",
    headers: await buildHeaders({ contentType: "application/json" }),
    body: JSON.stringify({ productId }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Failed to add to wishlist");
  }
  return unwrapData<Wishlist>(json);
};

export const removeFromWishlistFetcher = async (
  productId: string,
): Promise<Wishlist> => {
  const res = await fetchWithTimeout(`${api}/wishlist/${productId}`, {
    method: "DELETE",
    headers: await buildHeaders({ contentType: "application/json" }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Failed to remove from wishlist");
  }
  return unwrapData<Wishlist>(json);
};
