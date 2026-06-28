"use server";

import { createOrder, updateOrderStatus } from "./api/order";
import { Order } from "@/types/order";
import { ActionResponse } from "@/types/action";
import { handleActionError } from "@/services/utils";

export async function createOrderAction(
  _prevState: unknown,
): Promise<ActionResponse<Order>> {
  try {
    const order = await createOrder();
    return { success: true, data: order, error: null, message: null, fieldErrors: null };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}

export async function updateOrderStatusAction(
  orderId: string,
  status: string,
): Promise<ActionResponse<Order>> {
  try {
    const order = await updateOrderStatus(orderId, status);
    return { success: true, data: order, error: null, message: null, fieldErrors: null };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}
