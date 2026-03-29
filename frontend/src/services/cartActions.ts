"use server";

import { addToCart, removeFromCart } from "./api/cart";
import { AddToCartSchema } from "@/schemas/cartSchema";
import { Cart } from "@/types/cart";
import { ActionResponse } from "@/types/action";
import { handleActionError, getRequiredFormValue } from "@/services/utils";
import getCookies from "@/utils/cookies";

export async function addToCartAction(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResponse<Cart>> {
  const rawData = {
    productId: formData.get("productId"),
    quantity: formData.get("quantity"),
    size: formData.get("size"),
  };

  const validatedFields = AddToCartSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      data: null,
      error:
        validatedFields.error.flatten().fieldErrors.size?.[0] ||
        validatedFields.error.flatten().fieldErrors.quantity?.[0] ||
        "Invalid input data",
      message: null,
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { productId, quantity, size } = validatedFields.data;
  const cookie = await getCookies();
  try {
    const cart = await addToCart(productId, quantity, size, cookie);
    return { success: true, data: cart, error: null, message: null, fieldErrors: null };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}

export async function removeFromCartAction(
  _previousState: unknown,
  formData: FormData,
): Promise<ActionResponse<Cart>> {
  const cookie = await getCookies();
  const itemId = getRequiredFormValue(formData, "itemId");
  try {
    const cart = await removeFromCart(itemId, cookie);
    return { success: true, data: cart, error: null, message: null, fieldErrors: null };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}
