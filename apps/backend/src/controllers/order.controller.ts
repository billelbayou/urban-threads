import { Request, Response } from "express";
import { orderService } from "../services/order.service.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { sendSuccess } from "../utils/response.js";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const order = await orderService.createOrder(userId);
  sendSuccess(res, order, undefined, 201);
});

export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const orders = await orderService.getMyOrders(userId);
  sendSuccess(res, orders);
});

export const getAllOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    
    const result = await orderService.getAllOrders({ page, limit });
    sendSuccess(res, result.data, undefined, 200, result.pagination);
  },
);

export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { status } = req.body;
    
    const order = await orderService.updateOrderStatus(id, status);
    sendSuccess(res, order);
  },
);
