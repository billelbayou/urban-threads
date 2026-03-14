import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { cartService } from "../services/cart.service.js";
import { asyncHandler } from "../middleware/error.middleware.js";

export const getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const cart = await cartService.getOrCreateCart(userId);
  res.json(cart);
});

export const addToCart = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { productId, quantity, size } = req.body;
    const updatedCart = await cartService.addToCart(
      userId,
      productId,
      quantity,
      size,
    );
    res.status(201).json(updatedCart);
  },
);

export const updateCartItem = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { itemId } = req.params as { itemId: string };
    const { quantity } = req.body;
    const userId = req.user!.id;

    if (!quantity || quantity <= 0) {
      res.status(400).json({ error: "Invalid quantity" });
      return;
    }

    const updatedCart = await cartService.updateCartItem(
      userId,
      itemId,
      quantity,
    );
    res.json(updatedCart);
  },
);

export const removeCartItem = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { itemId } = req.params as { itemId: string };
    const userId = req.user!.id;
    const updatedCart = await cartService.removeCartItem(userId, itemId);
    res.json(updatedCart);
  },
);

export const clearCart = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const updatedCart = await cartService.clearCart(userId);
    res.json(updatedCart);
  },
);
