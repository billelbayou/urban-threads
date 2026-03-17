import { Product } from "@/types/product";
import { api, fetchWithTimeout } from "./client";

/* -------------------- PRODUCTS -------------------- */

/**
 * @returns Product[] - Array of all products
 * Response: Product[]
 */
export const fetchProducts = async (cookie?: string): Promise<Product[]> => {
  const headers: Record<string, string> = {};
  if (cookie) headers["cookie"] = cookie;

  const res = await fetchWithTimeout(`${api}/products`, {
    headers,
    credentials: cookie ? undefined : "include",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  const products: Product[] = data.data;
  return products;
};

/**
 * @param productId - The product ID
 * @returns Product - The product object
 * Response: Product
 */
export const fetchProductById = async (
  productId: string,
  cookie?: string,
): Promise<Product> => {
  const headers: Record<string, string> = {};
  if (cookie) headers["cookie"] = cookie;

  const res = await fetchWithTimeout(`${api}/products/${productId}`, {
    headers,
    credentials: cookie ? undefined : "include",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};

/**
 * @param formData - FormData containing product data and images
 * @returns { message: string; product: Product }
 * Response: { message: string; product: Product }
 */
export const createProduct = async (
  formData: FormData,
  cookie?: string,
): Promise<{ message: string; product: Product }> => {
  const headers: Record<string, string> = {};
  if (cookie) headers["cookie"] = cookie;
  const res = await fetchWithTimeout(`${api}/products`, {
    method: "POST",
    headers,
    credentials: cookie ? undefined : "include",
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to create product");
  }
  const data: { message: string; product: Product } = await res.json();
  return data;
};

/**
 * @param productId - The product ID to delete
 * @returns { message: string }
 * Response: { message: string }
 */
export const deleteProduct = async (
  productId: string,
  cookie?: string,
): Promise<{ message: string }> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cookie) headers["cookie"] = cookie;
  const res = await fetchWithTimeout(`${api}/products/${productId}`, {
    method: "DELETE",
    headers,
    credentials: cookie ? undefined : "include",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to delete product");
  }
  const data: { message: string } = await res.json();
  return data;
};

/**
 * @param productId - The product ID to update
 * @param formData - FormData containing product data and optional new images
 * @returns { message: string; product: Product }
 * Response: { message: string; product: Product }
 */
export const updateProduct = async (
  productId: string,
  formData: FormData,
  cookie?: string,
): Promise<{ message: string; product: Product }> => {
  const headers: Record<string, string> = {};
  if (cookie) headers["cookie"] = cookie;
  const res = await fetchWithTimeout(`${api}/products/${productId}`, {
    method: "PATCH",
    headers,
    credentials: cookie ? undefined : "include",
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to update product");
  }
  const data: { message: string; product: Product } = await res.json();
  return data;
};

/**
 * Upload image to Supabase Storage via backend API using FormData
 * @param file - The image file to upload
 * @param folder - The folder name in storage (default: "products")
 * @returns { url: string; path: string }
 * Response: { url: string; path: string }
 */
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
    const data = await res.json();
    throw new Error(data.error || "Failed to upload image");
  }
  const data: { url: string; path: string } = await res.json();
  return data;
};
