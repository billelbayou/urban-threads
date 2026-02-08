import { Product } from "@/types/product";
import { User } from "@/types/user";

export const api = process.env.NEXT_PUBLIC_API_URL;
/* -------------------- PRODUCTS -------------------- */

export const fetchProducts = async () => {
  const res = await fetch(`${api}/products`);

  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const fetchProductById = async (productId: string) => {
  const res = await fetch(`${api}/products/${productId}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};

export const createProduct = async (productData: Product, cookie?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cookie) headers["cookie"] = cookie;
  const res = await fetch(`${api}/products`, {
    method: "POST",
    headers,
    credentials: cookie ? undefined : "include",
    body: JSON.stringify(productData),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to create product");
  }
  return res.json();
};

export const deleteProduct = async (productId: string, cookie?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cookie) headers["cookie"] = cookie;
  const res = await fetch(`${api}/products/${productId}`, {
    method: "DELETE",
    headers,
    credentials: cookie ? undefined : "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to delete product");
  }
  return data;
};

/* -------------------- AUTH -------------------- */

export const login = async (email: string, password: string) => {
  const res = await fetch(`${api}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }
  return data;
};

export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) => {
  const res = await fetch(`${api}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ firstName, lastName, email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Registration failed");
  }

  return res.json();
};

export const updatePersonalInfo = async (
  data: { phone?: string; dateOfBirth?: string; gender?: string },
  cookie?: string,
) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cookie) headers["cookie"] = cookie;
  const res = await fetch(`${api}/auth/me/personal-info`, {
    method: "PUT",
    headers,
    credentials: cookie ? undefined : "include",
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || "Failed to update personal info");
  }
  return result;
};

export const updateShippingAddress = async (
  data: {
    country?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    streetAddress?: string;
    apartment?: string;
  },
  cookie?: string,
) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cookie) headers["cookie"] = cookie;
  const res = await fetch(`${api}/auth/me/shipping-address`, {
    method: "PUT",
    headers,
    credentials: cookie ? undefined : "include",
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || "Failed to update shipping address");
  }
  return result;
};

export const logout = async () => {
  const res = await fetch(`${api}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Logout failed");
  }
  return res.json();
};

// lib/fetchers.ts
export const getCurrentUser = async (cookie?: string) => {
  const headers: Record<string, string> = {};

  if (cookie) headers["cookie"] = cookie; // lowercase works too in Node/Edge

  const res = await fetch(`${api}/auth/me`, {
    headers,
    credentials: cookie ? undefined : "include",
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data: User = await res.json();
  return data;
};

/* -------------------- CART -------------------- */

export const fetchCart = async (cookie?: string) => {
  const headers: Record<string, string> = {};
  if (cookie) headers["cookie"] = cookie;
  const res = await fetch(`${api}/cart`, {
    headers,
    credentials: cookie ? undefined : "include",
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data;
};

export const addToCart = async (
  productId: string,
  quantity: number,
  size: string,
  cookie: string,
) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json", // CRITICAL: Tell Express to parse the body
  };
  if (cookie) headers["cookie"] = cookie;
  const res = await fetch(`${api}/cart/add`, {
    method: "POST",
    headers,
    credentials: cookie ? undefined : "include",
    body: JSON.stringify({ productId, quantity, size }),
  });

  const data = await res.json();

  return data;
};

export const removeFromCart = async (itemId: string, cookie: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json", // CRITICAL: Tell Express to parse the body
  };
  if (cookie) headers["cookie"] = cookie;
  const res = await fetch(`${api}/cart/item/${itemId}`, {
    method: "DELETE",
    headers,
    credentials: cookie ? undefined : "include",
  });

  const data = await res.json();

  return data;
};

/* -------------------- CATEGORY -------------------- */

export const fetchCategories = async () => {
  const res = await fetch(`${api}/category`);

  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

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
  const res = await fetch(`${api}/category`, {
    method: "POST",
    headers,
    credentials: cookie ? undefined : "include",
    body: JSON.stringify({ name, slug, parentId }),
  });

  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
};

export const deleteCategory = async (id: string, cookie?: string) => {
  const headers: Record<string, string> = {};
  if (cookie) headers["cookie"] = cookie;
  const res = await fetch(`${api}/category/${id}`, {
    method: "DELETE",
    headers,
    credentials: cookie ? undefined : "include",
  });

  if (!res.ok) throw new Error("Failed to delete category");
};
