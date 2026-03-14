"use server";

import { cookies } from "next/headers";
import {
  addToWishlistFetcher,
  removeFromWishlistFetcher,
  fetchWishlist,
} from "./api/wishlist";
import { Wishlist } from "@/types/wishlist";

type ActionResponse<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
};

export async function addToWishlistAction(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResponse<Wishlist>> {
  const productId = formData.get("productId") as string;

  if (!productId) {
    return { success: false, data: null, error: "Product ID is required" };
  }

  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();
    const wishlist = await addToWishlistFetcher(productId, cookie);
    return { success: true, data: wishlist, error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to add to wishlist";
    return { success: false, data: null, error: message };
  }
}

export async function removeFromWishlistAction(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResponse<Wishlist>> {
  const productId = formData.get("productId") as string;

  if (!productId) {
    return { success: false, data: null, error: "Product ID is required" };
  }

  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();
    const wishlist = await removeFromWishlistFetcher(productId, cookie);
    return { success: true, data: wishlist, error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to remove from wishlist";
    return { success: false, data: null, error: message };
  }
}

export async function getWishlistServer(): Promise<Wishlist | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();
    return await fetchWishlist(cookie);
  } catch {
    return null;
  }
}
