"use server";

import { deleteProduct } from "@/lib/fetchers";
import { CreateProductSchema } from "@/schemas/productShema";
import { Product } from "@/types/product";
import getCookies from "@/utils/cookies";
import { revalidatePath } from "next/cache";

export type ValidationErrors = {
  name?: string[];
  categoryId?: string[];
  price?: string[];
  stock?: string[];
  description?: string[];
  images?: string[];
  infoSections?: string[];
  tags?: string[];
};

type ActionResponse<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
};

export async function CreateProductAction(
  _initialState: unknown,
  formData: FormData,
) {
  const productData = formData.get("product");
  const cookie = await getCookies();
  const validatedData = CreateProductSchema.safeParse(
    JSON.parse(productData as string),
  );

  if (!validatedData.success) {
    const errorMessage: ValidationErrors =
      validatedData.error.flatten().fieldErrors;
    return { success: false, data: null, errors: { ...errorMessage } };
  }
  // try {
  revalidatePath("/admin/products");
  return { success: true, data: null, errors: null };
  // } catch (error: unknown) {
  //   const errorMessage =
  //     error instanceof Error ? error.message : "An unexpected error occurred";
  //   return {
  //     success: false,
  //     data: null,
  //     errors: errorMessage,
  //   };
  // }
}

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
