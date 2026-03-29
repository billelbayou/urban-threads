"use server";

import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/services/api/product";
import { CreateProductSchema } from "@/schemas/productSchema";
import { Product } from "@/types/product";
import { ActionResponse } from "@/types/action";
import { handleActionError, getRequiredFormValue } from "@/services/utils";
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

export async function createProductAction(
  _initialState: unknown,
  formData: FormData,
): Promise<ActionResponse<Product>> {
  let product: unknown;

  try {
    const raw = formData.get("product");
    if (!raw || typeof raw !== "string") {
      return {
        success: false,
        data: null,
        fieldErrors: null,
        message: "Invalid form payload",
        error: null,
      };
    }

    product = JSON.parse(raw);
  } catch {
    return {
      success: false,
      data: null,
      fieldErrors: null,
      message: "Malformed product data",
      error: null,
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
      error: null,
    };
  }

  try {
    const cookie = await getCookies();
    formData.set("product", JSON.stringify(validated.data));
    const res = await createProduct(formData, cookie);

    revalidatePath("/admin/products");

    return {
      success: true,
      data: res.product,
      fieldErrors: null,
      message: res.message,
      error: null,
    };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}

export async function deleteProductAction(
  _previousState: unknown,
  formData: FormData,
): Promise<ActionResponse<{ message: string }>> {
  const productId = getRequiredFormValue(formData, "productId");
  const cookie = await getCookies();
  try {
    const message = await deleteProduct(productId, cookie);
    revalidatePath("/admin/products");
    return { success: true, data: message, error: null, message: null, fieldErrors: null };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}

export async function updateProductAction(
  _initialState: unknown,
  formData: FormData,
): Promise<ActionResponse<Product>> {
  let product: unknown;

  try {
    const raw = formData.get("product");
    if (!raw || typeof raw !== "string") {
      return {
        success: false,
        data: null,
        fieldErrors: null,
        message: "Invalid form payload",
        error: null,
      };
    }

    product = JSON.parse(raw);
  } catch {
    return {
      success: false,
      data: null,
      fieldErrors: null,
      message: "Malformed product data",
      error: null,
    };
  }

  const productId = getRequiredFormValue(formData, "productId");

  const validated = CreateProductSchema.safeParse(product);

  if (!validated.success) {
    const fieldErrors: ValidationErrors = validated.error.flatten().fieldErrors;

    return {
      success: false,
      data: null,
      fieldErrors,
      message: null,
      error: null,
    };
  }

  try {
    const cookie = await getCookies();
    formData.set("product", JSON.stringify(validated.data));
    const res = await updateProduct(productId, formData, cookie);

    revalidatePath("/admin/products");

    return {
      success: true,
      data: res.product,
      fieldErrors: null,
      message: res.message,
      error: null,
    };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}
