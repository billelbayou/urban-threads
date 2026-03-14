import { Order } from "@/types/order";
import { api, fetchWithTimeout } from "./client";

/* -------------------- ORDERS -------------------- */

/**
 * Creates a new order from the user's cart
 * @returns Order - The created order
 * Response: Order
 */
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

/**
 * @returns Order[] - Array of the current user's orders
 * Response: Order[]
 */
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

/**
 * Admin only - fetches all orders
 * @returns Order[] - Array of all orders
 * Response: Order[]
 */
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

/**
 * Admin only - updates the status of an order
 * @param orderId - The order ID to update
 * @param status - The new status
 * @returns Order - The updated order
 * Response: Order
 */
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

/**
 * Admin only - fetches admin dashboard statistics
 * @returns { totalSales: number; orderCount: number; customerCount: number; productCount: number; orders: Order[]; products: Product[] }
 * Response: { totalSales: number; orderCount: number; customerCount: number; productCount: number; orders: Order[]; products: Product[] }
 */
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
