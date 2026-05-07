import { Order } from "@/types/order";
import { api, fetchWithTimeout, buildHeaders, unwrapData } from "./client";

export const createOrder = async (): Promise<Order> => {
  const res = await fetchWithTimeout(`${api}/orders`, {
    method: "POST",
    headers: await buildHeaders(),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Failed to create order");
  }
  return unwrapData<Order>(json);
};

export const fetchMyOrders = async (): Promise<Order[]> => {
  const res = await fetchWithTimeout(`${api}/orders/mine`, {
    headers: await buildHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch orders");
  }
  const json = await res.json();
  return json.data as Order[];
};

export const fetchAdminOrders = async (): Promise<Order[] | null> => {
  const res = await fetchWithTimeout(`${api}/orders`, {
    headers: await buildHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch orders");
  }
  const json = await res.json();
  return json.data as Order[];
};

export const updateOrderStatus = async (
  orderId: string,
  status: string,
): Promise<Order> => {
  const res = await fetchWithTimeout(`${api}/orders/${orderId}`, {
    method: "PATCH",
    headers: await buildHeaders({ contentType: "application/json" }),
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Failed to update order status");
  }
  return unwrapData<Order>(json);
};

export const fetchAdminStats = async (): Promise<{
  totalSales: number;
  orderCount: number;
  customerCount: number;
  productCount: number;
  orders: Order[];
  products: unknown[];
}> => {
  const headers = await buildHeaders();

  const [ordersRes, productsRes, usersRes] = await Promise.all([
    fetchWithTimeout(`${api}/orders`, {
      headers,
      cache: "no-store",
    }),
    fetchWithTimeout(`${api}/products`, {
      headers,
      cache: "no-store",
    }),
    fetchWithTimeout(`${api}/auth/users`, {
      headers,
      cache: "no-store",
    }),
  ]);

  const ordersJson = ordersRes.ok ? await ordersRes.json() : { data: [] };
  const productsJson = productsRes.ok ? await productsRes.json() : { data: [] };
  const usersJson = usersRes.ok ? await usersRes.json() : { data: [] };

  const orders = ordersJson.data || [];
  const products = productsJson.data || [];
  const users = usersJson.data || [];

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
