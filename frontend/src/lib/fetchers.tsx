import { Product } from "@/types/product";
import { User } from "@/types/user";
import { Wishlist } from "@/types/wishlist";
import { Category } from "@/types/category";
import { Order } from "@/types/order";
import { Cart } from "@/types/cart";

export const api = process.env.NEXT_PUBLIC_API_URL;

// Default timeout for fetch requests (in milliseconds)
const DEFAULT_TIMEOUT = 10000;

// Helper function to create fetch with timeout
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout: number = DEFAULT_TIMEOUT,
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
};

/* -------------------- PRODUCTS -------------------- */

export const fetchProducts = async (cookie?: string): Promise<Product[]> => {
  const headers: Record<string, string> = {};
  if (cookie) headers["cookie"] = cookie;

  const res = await fetchWithTimeout(`${api}/products`, {
    headers,
    credentials: cookie ? undefined : "include",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

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

export const createProduct = async (productData: Product, cookie?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cookie) headers["cookie"] = cookie;
  const res = await fetchWithTimeout(`${api}/products`, {
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
  const res = await fetchWithTimeout(`${api}/products/${productId}`, {
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

export const updateProduct = async (
  productId: string,
  productData: Product,
  cookie?: string,
) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cookie) headers["cookie"] = cookie;
  const res = await fetchWithTimeout(`${api}/products/${productId}`, {
    method: "PATCH",
    headers,
    credentials: cookie ? undefined : "include",
    body: JSON.stringify(productData),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to update product");
  }
  return res.json();
};

/**
 * Upload image to Supabase Storage via backend API using FormData
 */
export const uploadImage = async (file: File, folder: string = "products") => {
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
  return res.json();
};

/* -------------------- AUTH -------------------- */

export const login = async (email: string, password: string) => {
  const res = await fetchWithTimeout(`${api}/auth/login`, {
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
  const res = await fetchWithTimeout(`${api}/auth/register`, {
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
  const res = await fetchWithTimeout(`${api}/auth/me/personal-info`, {
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
  const res = await fetchWithTimeout(`${api}/auth/me/shipping-address`, {
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
  const res = await fetchWithTimeout(`${api}/auth/logout`, {
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
export const getCurrentUser = async (cookie?: string): Promise<User | null> => {
  const headers: Record<string, string> = {};

  if (cookie) headers["cookie"] = cookie; // lowercase works too in Node/Edge

  const res = await fetchWithTimeout(`${api}/auth/me`, {
    headers,
    credentials: cookie ? undefined : "include",
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data: User = await res.json();
  return data;
};

/* -------------------- CART -------------------- */

export const fetchCart = async (cookie?: string): Promise<Cart | null> => {
  const headers: Record<string, string> = {};
  if (cookie) headers["cookie"] = cookie;
  const res = await fetchWithTimeout(`${api}/cart`, {
    headers,
    credentials: cookie ? undefined : "include",
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data: Cart = await res.json();
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
  const res = await fetchWithTimeout(`${api}/cart/add`, {
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
  const res = await fetchWithTimeout(`${api}/cart/item/${itemId}`, {
    method: "DELETE",
    headers,
    credentials: cookie ? undefined : "include",
  });

  const data = await res.json();

  return data;
};

/* -------------------- CATEGORY -------------------- */

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

/* -------------------- ORDERS -------------------- */

export const createOrder = async (cookie?: string): Promise<Order> => {
  const headers: Record<string, string> = {};
  if (cookie) headers["cookie"] = cookie;
  const res = await fetchWithTimeout(`${api}/orders`, {
    method: "POST",
    headers,
    credentials: cookie ? undefined : "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to create order");
  }
  return data;
};

export const fetchMyOrders = async (cookie?: string): Promise<Order[]> => {
  const headers: Record<string, string> = {};
  if (cookie) headers["cookie"] = cookie;
  const res = await fetchWithTimeout(`${api}/orders/mine`, {
    headers,
    credentials: cookie ? undefined : "include",
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
};

export const fetchAdminOrders = async (cookie?: string): Promise<Order[]> => {
  const headers: Record<string, string> = {};
  if (cookie) headers["cookie"] = cookie;
  const res = await fetchWithTimeout(`${api}/orders`, {
    headers,
    credentials: cookie ? undefined : "include",
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
};

export const updateOrderStatus = async (
  orderId: string,
  status: string,
  cookie?: string,
) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cookie) headers["cookie"] = cookie;
  const res = await fetchWithTimeout(`${api}/orders/${orderId}`, {
    method: "PATCH",
    headers,
    credentials: cookie ? undefined : "include",
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to update order status");
  }
  return data;
};

export const fetchAdminStats = async (cookie?: string) => {
  const headers: Record<string, string> = {};
  if (cookie) headers["cookie"] = cookie;

  // Fetch all required data in parallel
  const [ordersRes, productsRes, usersRes] = await Promise.all([
    fetchWithTimeout(`${api}/orders`, {
      headers,
      credentials: cookie ? undefined : "include",
      cache: "no-store",
    }),
    fetchWithTimeout(`${api}/products`, {
      headers,
      credentials: cookie ? undefined : "include",
      cache: "no-store",
    }),
    fetchWithTimeout(`${api}/auth/users`, {
      headers,
      credentials: cookie ? undefined : "include",
      cache: "no-store",
    }),
  ]);

  const orders = ordersRes.ok ? await ordersRes.json() : [];
  const products = productsRes.ok ? await productsRes.json() : [];
  const users = usersRes.ok ? await usersRes.json() : [];

  const totalSales = orders.reduce(
    (sum: number, order: { total: number }) => sum + order.total,
    0,
  );
  const orderCount = orders.length;
  const customerCount = users.length;
  const productCount = products.length;

  return {
    totalSales,
    orderCount,
    customerCount,
    productCount,
    orders,
    products,
  };
};

/* -------------------- WISHLIST -------------------- */

export const fetchWishlist = async (
  cookie?: string,
): Promise<Wishlist | null> => {
  const headers: Record<string, string> = {};
  if (cookie) headers["cookie"] = cookie;
  const res = await fetchWithTimeout(`${api}/wishlist`, {
    headers,
    credentials: cookie ? undefined : "include",
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
};

export const addToWishlistFetcher = async (
  productId: string,
  cookie?: string,
): Promise<Wishlist> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cookie) headers["cookie"] = cookie;
  const res = await fetchWithTimeout(`${api}/wishlist/add`, {
    method: "POST",
    headers,
    credentials: cookie ? undefined : "include",
    body: JSON.stringify({ productId }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to add to wishlist");
  }
  return data;
};

export const removeFromWishlistFetcher = async (
  productId: string,
  cookie?: string,
): Promise<Wishlist> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cookie) headers["cookie"] = cookie;
  const res = await fetchWithTimeout(`${api}/wishlist/${productId}`, {
    method: "DELETE",
    headers,
    credentials: cookie ? undefined : "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to remove from wishlist");
  }
  return data;
};

/* -------------------- DELETE ACCOUNT -------------------- */

export const deleteAccount = async (cookie?: string) => {
  const headers: Record<string, string> = {};
  if (cookie) headers["cookie"] = cookie;
  const res = await fetchWithTimeout(`${api}/auth/account`, {
    method: "DELETE",
    headers,
    credentials: cookie ? undefined : "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to delete account");
  }
  return data;
};
