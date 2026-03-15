import { z } from "zod";
import { OrderStatus } from "../generated/prisma/enums.js";

export const orderStatusSchema = z.nativeEnum(OrderStatus, {
  errorMap: () => ({ message: "Invalid order status" }),
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
});

export const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  size: z.enum(["XS", "S", "M", "L", "XL", "XXL"]),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
