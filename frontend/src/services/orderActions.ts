"use server";

import { createOrder } from "@/lib/fetchers";
import { Order } from "@/types/order";
import { cookies } from "next/headers";

type ActionResponse<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
};

export async function createOrderAction(
  _prevState: unknown,
): Promise<ActionResponse<Order>> {
  const cookie = (await cookies()).toString();

  try {
    const order = await createOrder(cookie);
    return { success: true, data: order, error: null };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, data: null, error: errorMessage };
  }
}
