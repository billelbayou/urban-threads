import { Request, Response } from "express";
import { orderService } from "../services/order.service.js";
import { asyncHandler } from "../middleware/error.middleware.js";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const order = await orderService.createOrder(userId);
  res.status(201).json(order);
});

export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const orders = await orderService.getMyOrders(userId);
  res.json(orders);
});

export const getAllOrders = asyncHandler(
  async (_req: Request, res: Response) => {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  },
);

export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(id, status);
    res.json(order);
  },
);
