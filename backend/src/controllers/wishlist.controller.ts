import { Response } from "express";
import { prisma } from "../utils/prisma.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

/**
 * Helper: Always return a full wishlist with products
 */
async function getOrCreateWishlist(userId: string) {
  return prisma.wishlist.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: {
      products: true,
    },
  });
}

/**
 * GET /api/wishlist
 */
export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const wishlist = await getOrCreateWishlist(userId);
    res.json(wishlist);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
    return;
  }
};

/**
 * POST /api/wishlist/add
 * body: { productId }
 */
export const addToWishlist = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { productId } = req.body;

  if (!productId) {
    res.status(400).json({ error: "Product ID is required" });
    return;
  }

  try {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const wishlist = await getOrCreateWishlist(userId);

    // Check if product is already in wishlist
    const existingItem = await prisma.wishlist.findFirst({
      where: {
        id: wishlist.id,
        products: {
          some: {
            id: productId,
          },
        },
      },
    });

    if (existingItem) {
      res.status(400).json({ error: "Product already in wishlist" });
      return;
    }

    // Add product to wishlist
    await prisma.wishlist.update({
      where: { id: wishlist.id },
      data: {
        products: {
          connect: { id: productId },
        },
      },
    });

    const updatedWishlist = await getOrCreateWishlist(userId);
    res.status(201).json(updatedWishlist);
    return;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
    return;
  }
};

/**
 * DELETE /api/wishlist/:productId
 */
export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  const { productId } = req.params as { productId: string };
  const userId = req.user!.id;

  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      res.status(404).json({ error: "Wishlist not found" });
      return;
    }

    // Remove product from wishlist
    await prisma.wishlist.update({
      where: { id: wishlist.id },
      data: {
        products: {
          disconnect: { id: productId },
        },
      },
    });

    const updatedWishlist = await getOrCreateWishlist(userId);
    res.json(updatedWishlist);
    return;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
    return;
  }
};
