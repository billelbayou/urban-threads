import { Category } from "@/types/category";
import { api, fetchWithTimeout } from "./client";

/* -------------------- CATEGORY -------------------- */

/**
 * @returns Category[] - Array of all categories
 * Response: Category[]
 */
export const fetchCategories = async (cookie?: string): Promise<Category[]> => {
  const headers: Record<string, string> = {};
  if (cookie) headers["cookie"] = cookie;

  const res = await fetchWithTimeout(`${api}/category`, {
    headers,
    credentials: cookie ? undefined : "include",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch categories");
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
}) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cookie) headers["cookie"] = cookie;
  const res = await fetchWithTimeout(`${api}/category`, {
    method: "POST",
    headers,
    credentials: cookie ? undefined : "include",
    body: JSON.stringify({ name, slug, parentId }),
  });

  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
};

/**
 * @param id - The category ID to delete
 * @returns void (204 No Content)
 * Response: 204 No Content
 */
export const deleteCategory = async (id: string, cookie?: string) => {
  const headers: Record<string, string> = {};
  if (cookie) headers["cookie"] = cookie;
  const res = await fetchWithTimeout(`${api}/category/${id}`, {
    method: "DELETE",
    headers,
    credentials: cookie ? undefined : "include",
  });

  if (!res.ok) throw new Error("Failed to delete category");
};
