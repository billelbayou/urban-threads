import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { cartService } from "../services/cart.service.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { sendSuccess } from "../utils/response.js";
import { AppError } from "../errors/index.js";

export const getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const cart = await cartService.getOrCreateCart(userId);
  sendSuccess(res, cart);
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
    sendSuccess(res, updatedCart, undefined, 201);
  },
);

export const updateCartItem = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { itemId } = req.params as { itemId: string };
    const { quantity } = req.body;
    const userId = req.user!.id;

    if (!quantity || quantity <= 0) {
      throw new AppError("Invalid quantity", 400);
    }

    const updatedCart = await cartService.updateCartItem(
      userId,
      itemId,
      quantity,
    );
    sendSuccess(res, updatedCart);
  },
);

export const removeCartItem = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { itemId } = req.params as { itemId: string };
    const userId = req.user!.id;
    const updatedCart = await cartService.removeCartItem(userId, itemId);
    sendSuccess(res, updatedCart);
  },
);

export const clearCart = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const updatedCart = await cartService.clearCart(userId);
    sendSuccess(res, updatedCart);
  },
);
