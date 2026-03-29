import { Category } from "@/types/category";
import { api, fetchWithTimeout, buildHeaders } from "./client";

/* -------------------- CATEGORY -------------------- */

/**
 * @returns Category[] - Array of all categories
 * Response: Category[]
 */
export const fetchCategories = async (cookie?: string): Promise<Category[]> => {
  const res = await fetchWithTimeout(`${api}/category`, {
    headers: buildHeaders({ cookie }),
    credentials: cookie ? undefined : "include",
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
  cookie,
}: {
  name: string;
  slug: string;
  parentId?: string;
  cookie?: string;
}): Promise<Category> => {
  const res = await fetchWithTimeout(`${api}/category`, {
    method: "POST",
    headers: buildHeaders({ cookie, contentType: "application/json" }),
    credentials: cookie ? undefined : "include",
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
export const deleteCategory = async (id: string, cookie?: string): Promise<void> => {
  const res = await fetchWithTimeout(`${api}/category/${id}`, {
    method: "DELETE",
    headers: buildHeaders({ cookie }),
    credentials: cookie ? undefined : "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete category");
  }
};
