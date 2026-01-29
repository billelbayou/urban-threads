"use server";

import { createCategory, deleteCategory } from "@/lib/fetchers";
import { CreateCategorySchema } from "@/schemas/categorySchema";
import getCookies from "@/utils/cookies";
import { revalidatePath } from "next/cache";

export async function CreateCategoryAction(
  _initialState: unknown,
  formData: FormData,
) {
  // 1. Validate
  const result = CreateCategorySchema.safeParse({
    name: formData.get("name"),
    parentId: formData.get("parentId"),
  });


  if (!result.success) {
    const errorMessage = result.error.issues.map((i) => i.message).join(", ");
    return { success: false, data: null, error: errorMessage };
  }

  const { name, parentId } = result.data;

  // Normalize slug
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
  const cookie = await getCookies();

  try {
    // 2. Execute DB Logic
    const data = await createCategory({
      name,
      slug,
      parentId: parentId,
      cookie,
    });

    revalidatePath("/admin/categories");
    return { success: true, data, error: null };
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Database failure",
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
