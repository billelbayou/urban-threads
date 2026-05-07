import { Category } from "@/types/category";
import { api, fetchWithTimeout, buildHeaders } from "./client";

/* -------------------- CATEGORY -------------------- */

/**
 * @returns Category[] - Array of all categories
 * Response: Category[]
 */
export const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetchWithTimeout(`${api}/category`, {
    headers: await buildHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch categories");
  }
  return res.json();
};

/**
 * @param name - Category name
 * @param slug - Category slug
 * @param parentId - Optional parent category ID
 * @returns Category - The created category
 * Response: Category
 */
export const createCategory = async ({
  name,
  slug,
  parentId,
}: {
  name: string;
  slug: string;
  parentId?: string;
}): Promise<Category> => {
  const res = await fetchWithTimeout(`${api}/category`, {
    method: "POST",
    headers: await buildHeaders({ contentType: "application/json" }),
    body: JSON.stringify({ name, slug, parentId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create category");
  }
  return res.json();
};

/**
 * @param id - The category ID to delete
 * @returns void (204 No Content)
 * Response: 204 No Content
 */
export const deleteCategory = async (id: string): Promise<void> => {
  const res = await fetchWithTimeout(`${api}/category/${id}`, {
    method: "DELETE",
    headers: await buildHeaders(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete category");
  }
};
