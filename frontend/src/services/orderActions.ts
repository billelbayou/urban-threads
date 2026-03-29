"use server";

import { createOrder, fetchAdminOrders, updateOrderStatus } from "./api/order";
import { Order } from "@/types/order";
import { ActionResponse } from "@/types/action";
import { handleActionError } from "@/services/utils";
import getCookies from "@/utils/cookies";

export async function createOrderAction(
  _prevState: unknown,
): Promise<ActionResponse<Order>> {
  const cookie = await getCookies();

  try {
    const order = await createOrder(cookie);
    return { success: true, data: order, error: null, message: null, fieldErrors: null };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}

export async function getAdminOrdersAction(): Promise<ActionResponse<Order[]>> {
  const cookie = await getCookies();

  try {
    const orders = await fetchAdminOrders(cookie);
    return { success: true, data: orders, error: null, message: null, fieldErrors: null };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}

export async function updateOrderStatusAction(
  orderId: string,
  status: string,
): Promise<ActionResponse<Order>> {
  const cookie = await getCookies();

  try {
    const order = await updateOrderStatus(orderId, status, cookie);
    return { success: true, data: order, error: null, message: null, fieldErrors: null };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}
