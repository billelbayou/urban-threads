import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

/** Helper: Ensure user has a cart */
async function getOrCreateCart(userId: string) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: { images: true },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
      },
    });
  }

  return cart;
}

/** GET /cart */
export const getCart = async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const cart = await getOrCreateCart(userId);
  res.json(cart);
};

/** POST /cart/add */
export const addToCart = async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const { productId, quantity } = req.body;

  const cart = await getOrCreateCart(userId);

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (existingItem) {
    const updated = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + (quantity || 1) },
    });
    res.json(updated);
    return;
  }

  const newItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity: quantity || 1,
    },
  });

  res.status(201).json(newItem);
};

/** PUT /cart/item/:itemId */
export const updateCartItem = async (req: AuthRequest, res: Response) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    res.status(400).json({ error: "Invalid quantity" });
    return;
  }

  const item = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  res.json(item);
};

/** DELETE /cart/item/:itemId */
export const removeCartItem = async (req: AuthRequest, res: Response) => {
  const { itemId } = req.params;

  await prisma.cartItem.delete({ where: { id: itemId } });

  res.json({ message: "Item removed" });
};

/** DELETE /cart/clear */
export const clearCart = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const cart = await getOrCreateCart(userId);

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  res.json({ message: "Cart cleared" });
};
