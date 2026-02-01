import { Response } from "express";
import { prisma } from "../utils/prisma.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

/**
 * Helper: Always return a full cart with items + products
 */
async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

/**
 * GET /cart
 */
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const cart = await getOrCreateCart(userId);
    res.json(cart);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
    return;
  }
};

/**
 * POST /cart/add
 * body: { productId, quantity, size }
 */
export const addToCart = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { productId, quantity, size } = req.body;

  try {
    const cart = await getOrCreateCart(userId);

    await prisma.cartItem.upsert({
      where: {
        cartId_productId_size: {
          cartId: cart.id,
          productId,
          size,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        cartId: cart.id,
        productId,
        size,
        quantity,
      },
    });

    const updatedCart = await getOrCreateCart(userId);
    res.status(201).json(updatedCart);
    return;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
    return;
  }
};

/**
 * PUT /cart/item/:itemId
 * body: { quantity }
 */
export const updateCartItem = async (req: AuthRequest, res: Response) => {
  const { itemId } = req.params as { itemId: string };
  const { quantity } = req.body;
  const userId = req.user.id;

  if (!quantity || quantity <= 0) {
    res.status(400).json({ error: "Invalid quantity" });
    return;
  }

  try {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    const updatedCart = await getOrCreateCart(userId);
    res.json(updatedCart);
    return;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
    return;
  }
};

/**
 * DELETE /cart/item/:itemId
 */
export const removeCartItem = async (req: AuthRequest, res: Response) => {
  const { itemId } = req.params as { itemId: string };
  const userId = req.user.id;

  try {
    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    const updatedCart = await getOrCreateCart(userId);
    res.json(updatedCart);
    return;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
    return;
  }
};

/**
 * DELETE /cart/clear
 */
export const clearCart = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;

  try {
    const cart = await getOrCreateCart(userId);

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    const updatedCart = await getOrCreateCart(userId);
    res.json(updatedCart);
    return
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
    return;
  }
};
