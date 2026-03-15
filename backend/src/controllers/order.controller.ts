import { Request, Response } from "express";
import { orderService } from "../services/order.service.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { orderStatusSchema } from "../utils/validation.js";

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
  async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    
    const result = await orderService.getAllOrders({ page, limit });
    res.json(result);
  },
);

export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { status } = req.body;

    const validated = orderStatusSchema.parse(status);
    
    const order = await orderService.updateOrderStatus(id, validated);
    res.json(order);
  },
);
