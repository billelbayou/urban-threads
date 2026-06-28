import { Category } from "@/types/category";
import { api, fetchWithTimeout, buildHeaders, unwrapData } from "./client";

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetchWithTimeout(`${api}/category`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch categories");
  }
  const json = await res.json();
  return json.data as Category[];
};

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
  const json = await res.json();
  return unwrapData<Category>(json);
};

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
