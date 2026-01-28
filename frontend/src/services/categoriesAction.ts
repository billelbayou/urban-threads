"use server";

import {
  createCategory,
  deleteCategory,
  fetchCategories,
} from "@/lib/fetchers";
import { Category } from "@/types/category";
import getCookies from "@/utils/cookies";
import { revalidatePath } from "next/cache";

export async function ReloadAction(initialState: unknown, formData: FormData) {
  try {
    const categories: Category[] = await fetchCategories();
    return { success: true, data: categories, error: null };
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

export async function CreateCategoryAction(
  _initialState: unknown,
  formData: FormData,
) {
  const name = formData.get("name") as string;
  const parentId = formData.get("parentId") as string;
  // Generate simple slug from name
  const slug = name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
  const cookie = await getCookies();
  try {
    const data = await createCategory({ name, slug, parentId, cookie });
    revalidatePath("/admin/categories");
    return { success: true, data: data, error: null };
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

export async function DeleteCategoryAction(
  _initialState: unknown,
  formData: FormData,
) {
  const categoryId = formData.get("categoryId") as string;
  const cookie = await getCookies();
  try {
    const data = await deleteCategory(categoryId, cookie);
    revalidatePath("/admin/categories");
    return { success: true, data: data, error: null };
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
