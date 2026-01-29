"use server";

import { addToCart, removeFromCart } from "@/lib/fetchers";
import { AddToCartSchema } from "@/schemas/cartSchema";
import { Cart } from "@/types/cart";
import { cookies } from "next/headers";


type ActionResponse<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
};

export async function addToCartAction(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResponse<Cart>> {
  const rawData = {
    productId: formData.get("productId"),
    quantity: formData.get("quantity"),
    size: formData.get("size"),
  };

  const validatedFields = AddToCartSchema.safeParse(rawData);

  // 3. Handle validation errors
  if (!validatedFields.success) {
    return {
      success: false,
      data: null,
      // flatten() makes the errors easy to read (e.g., errors.size)
      error:
        validatedFields.error.flatten().fieldErrors.size?.[0] ||
        validatedFields.error.flatten().fieldErrors.quantity?.[0] ||
        "Invalid input data",
    };
  }

  const { productId, quantity, size } = validatedFields.data;
  const cookie = (await cookies()).toString()
  try {
    const cart = await addToCart(productId, quantity, size, cookie);
    return { success: true, data: cart, error: null };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, data: null, error: errorMessage };
  }
}

export async function removeFromCartAction(
  _previousState: unknown,
  formData: FormData
): Promise<ActionResponse<Cart>> {
  const cookie = (await cookies()).toString()
  const itemId = formData.get("itemId") as string;
  try {
    const cart = await removeFromCart(itemId, cookie);
    return { success: true, data: cart, error: null };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return {
      success: false,
      data: null,
      error: errorMessage,
    };
  }
}
