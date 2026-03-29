"use server";

import {
  addToWishlistFetcher,
  removeFromWishlistFetcher,
  fetchWishlist,
} from "./api/wishlist";
import { Wishlist } from "@/types/wishlist";
import { ActionResponse } from "@/types/action";
import { handleActionError, getRequiredFormValue } from "@/services/utils";
import getCookies from "@/utils/cookies";

export async function addToWishlistAction(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResponse<Wishlist>> {
  const productId = getRequiredFormValue(formData, "productId");

  try {
    const cookie = await getCookies();
    const wishlist = await addToWishlistFetcher(productId, cookie);
    return { success: true, data: wishlist, error: null, message: null, fieldErrors: null };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}

export async function removeFromWishlistAction(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResponse<Wishlist>> {
  const productId = getRequiredFormValue(formData, "productId");

  try {
    const cookie = await getCookies();
    const wishlist = await removeFromWishlistFetcher(productId, cookie);
    return { success: true, data: wishlist, error: null, message: null, fieldErrors: null };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}

export async function getWishlistServer(): Promise<Wishlist | null> {
  try {
    const cookie = await getCookies();
    return await fetchWishlist(cookie);
  } catch {
    return null;
  }
}
