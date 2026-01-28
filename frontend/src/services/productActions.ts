"use server";

import { deleteProduct } from "@/lib/fetchers";
import { Product } from "@/types/types";
import getCookies from "@/utils/cookies";
import { revalidatePath } from "next/cache";

type ActionResponse<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
};

export async function deleteProductAction(
  _previousState: unknown,
  formData: FormData,
): Promise<ActionResponse<Product>> {
  const productId = formData.get("productId") as string;
  const cookie = await getCookies();
  try {
    const message = await deleteProduct(productId, cookie);
    revalidatePath("/admin/products");
    return { success: true, data: message, error: null };
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
