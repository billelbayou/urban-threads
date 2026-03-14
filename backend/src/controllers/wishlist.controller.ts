import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { wishlistService } from "../services/wishlist.service.js";
import { asyncHandler } from "../middleware/error.middleware.js";

export const getWishlist = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const wishlist = await wishlistService.getOrCreateWishlist(userId);
    res.json(wishlist);
  },
);

export const addToWishlist = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { productId } = req.body;
    const updatedWishlist = await wishlistService.addToWishlist(
      userId,
      productId,
    );
    res.status(201).json(updatedWishlist);
  },
);

export const removeFromWishlist = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { productId } = req.params as { productId: string };
    const userId = req.user!.id;
    const updatedWishlist = await wishlistService.removeFromWishlist(
      userId,
      productId,
    );
    res.json(updatedWishlist);
  },
);
