import { Product } from "@/types/product";
import { api, fetchWithTimeout, buildHeaders, unwrapData } from "./client";

export const fetchProducts = async (sort?: "newest" | "bestSelling"): Promise<Product[]> => {
  const url = sort ? `${api}/products?sort=${sort}` : `${api}/products`;
  const res = await fetchWithTimeout(url, {
    headers: await buildHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to fetch products");
  }
  const result = await res.json();
  const products: Product[] = result.data;
  return products;
};

export const fetchProductById = async (
  productId: string,
): Promise<Product | null> => {
  const res = await fetchWithTimeout(`${api}/products/${productId}`, {
    headers: await buildHeaders(),
    cache: "no-store",
  });

  if (!res.ok) return null;
  const json = await res.json();
  return unwrapData<Product>(json);
};

export const createProduct = async (
  formData: FormData,
): Promise<{ message: string; product: Product }> => {
  const res = await fetchWithTimeout(`${api}/products`, {
    method: "POST",
    headers: await buildHeaders(),
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to create product");
  }
  const json = await res.json();
  const product = unwrapData<Product>(json);
  return { message: json.message || "", product };
};

export const deleteProduct = async (
  productId: string,
): Promise<{ message: string }> => {
  const res = await fetchWithTimeout(`${api}/products/${productId}`, {
    method: "DELETE",
    headers: await buildHeaders({ contentType: "application/json" }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to delete product");
  }
  const json = await res.json();
  return { message: json.message || "" };
};

export const updateProduct = async (
  productId: string,
  formData: FormData,
): Promise<{ message: string; product: Product }> => {
  const res = await fetchWithTimeout(`${api}/products/${productId}`, {
    method: "PATCH",
    headers: await buildHeaders(),
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to update product");
  }
  const json = await res.json();
  const product = unwrapData<Product>(json);
  return { message: json.message || "", product };
};

export const uploadImage = async (
  file: File,
  folder: string = "products",
): Promise<{ url: string; path: string }> => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);

  const res = await fetchWithTimeout(`${api}/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to upload image");
  }
  const data: { url: string; path: string } = await res.json();
  return data;
};
