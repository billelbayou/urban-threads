"use server";

import { createCategory, deleteCategory } from "./api/category";
import { CreateCategorySchema } from "@/schemas/categorySchema";
import { ActionResponse } from "@/types/action";
import { handleActionError, getRequiredFormValue } from "@/services/utils";
import getCookies from "@/utils/cookies";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(
  _initialState: unknown,
  formData: FormData,
): Promise<ActionResponse<unknown>> {
  const result = CreateCategorySchema.safeParse({
    name: formData.get("name"),
    parentId: formData.get("parentId"),
  });

  if (!result.success) {
    const errorMessage = result.error.issues.map((i) => i.message).join(", ");
    return {
      success: false,
      data: null,
      error: errorMessage,
      message: null,
      fieldErrors: null,
    };
  }

  const { name, parentId } = result.data;

  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
  const cookie = await getCookies();

  try {
    const data = await createCategory({
      name,
      slug,
      parentId: parentId,
      cookie,
    });

    revalidatePath("/admin/categories");
    return { success: true, data, error: null, message: null, fieldErrors: null };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}

export async function deleteCategoryAction(
  _initialState: unknown,
  formData: FormData,
): Promise<ActionResponse<unknown>> {
  const categoryId = getRequiredFormValue(formData, "categoryId");
  const cookie = await getCookies();
  try {
    const data = await deleteCategory(categoryId, cookie);
    revalidatePath("/admin/categories");
    return { success: true, data, error: null, message: null, fieldErrors: null };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}
