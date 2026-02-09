import { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import { Product } from "../generated/prisma/client.js";

/** Create order */
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;

    // 1. Fetch user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      res.status(400).json({ error: "Cart is empty" });
      return;
    }

    let total = 0;

    // 2. Map items correctly for Prisma (Remove the full product object)
    const orderItems = cart.items.map((item) => {
      total += item.product.price * item.quantity;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size,
      };
    });

    // 3. Create Order and Clear Cart in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: { product: true }, // This ensures the frontend gets product details
          },
        },
      });

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    // 4. Return the order (which now includes the product object)
    res.status(201).json(order);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Order Creation Error:", error);
    res.status(500).json({ error: message });
  }
};

/** Get my orders */
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
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
