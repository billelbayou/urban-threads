import { Request, Response } from "express";
import { orderSchema } from "../utils/validation.js";
import { prisma } from "../utils/prisma.js";
import { Product } from "../generated/prisma/client.js";

/** Create order */
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;

    const validated = orderSchema.parse(req.body);

    // Fetch products to calculate total
    const productIds = validated.items.map((i) => i.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== validated.items.length) {
      res.status(400).json({ error: "One or more products do not exist" });
      return;
    }

    let total = 0;

    const orderItems = validated.items.map((item) => {
      const product = products.find((p: Product) => p.id === item.productId)!;
      total += product.price * item.quantity;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        size: item.size,
      };
    });

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    });

    res.status(201).json(order);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
    return;
  }
};

/** Get my orders */
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
    });

    res.json(orders);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
    return;
  }
};

/** Admin: get all orders */
export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: true,
      },
    });

    res.json(orders);
    return;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
    return;
  }
};

/** Admin: update order status */
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: id },
      data: { status },
    });

    res.json(order);
    return;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
    return;
  }
};
