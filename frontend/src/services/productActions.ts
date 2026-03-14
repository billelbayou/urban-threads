"use server";

import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/services/api/product";
import { CreateProductSchema } from "@/schemas/productSchema";
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

export async function createProductAction(
  _initialState: unknown,
  formData: FormData,
) {
  // ---------------------------
  // Decode payload safely
  // ---------------------------
  let product: unknown;

  try {
    const raw = formData.get("product");
    if (!raw || typeof raw !== "string") {
      return {
        success: false,
        data: null,
        fieldErrors: null,
        message: "Invalid form payload",
      };
    }

    product = JSON.parse(raw);
  } catch {
    return {
      success: false,
      data: null,
      fieldErrors: null,
      message: "Malformed product data",
    };
  }

  const validated = CreateProductSchema.safeParse(product);

  if (!validated.success) {
    const fieldErrors: ValidationErrors = validated.error.flatten().fieldErrors;

    return {
      success: false,
      data: null,
      fieldErrors,
      message: null,
    };
  }

  try {
    const cookie = await getCookies();
    // Update formData with validated/transformed data
    formData.set("product", JSON.stringify(validated.data));
    const res = await createProduct(formData, cookie);

    revalidatePath("/admin/products");

    return {
      success: true,
      data: res.product,
      fieldErrors: null,
      message: res.message,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      data: null,
      fieldErrors: null,
      message,
    };
  }
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

export async function updateProductAction(
  _initialState: unknown,
  formData: FormData,
) {
  // Decode payload safely
  let product: unknown;

  try {
    const raw = formData.get("product");
    if (!raw || typeof raw !== "string") {
      return {
        success: false,
        data: null,
        fieldErrors: null,
        message: "Invalid form payload",
      };
    }

    product = JSON.parse(raw);
  } catch {
    return {
      success: false,
      data: null,
      fieldErrors: null,
      message: "Malformed product data",
    };
  }

  const productId = formData.get("productId") as string;
  if (!productId) {
    return {
      success: false,
      data: null,
      fieldErrors: null,
      message: "Product ID is required",
    };
  }

  const validated = CreateProductSchema.safeParse(product);

  if (!validated.success) {
    const fieldErrors: ValidationErrors = validated.error.flatten().fieldErrors;

    return {
      success: false,
      data: null,
      fieldErrors,
      message: null,
    };
  }

  try {
    const cookie = await getCookies();
    // Update formData with validated/transformed data
    formData.set("product", JSON.stringify(validated.data));
    const res = await updateProduct(productId, formData, cookie);

    revalidatePath("/admin/products");

    return {
      success: true,
      data: res.product,
      fieldErrors: null,
      message: res.message,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      data: null,
      fieldErrors: null,
      message,
    };
  }
}
