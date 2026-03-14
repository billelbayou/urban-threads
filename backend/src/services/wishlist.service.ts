import { prisma } from "../utils/prisma.js";

export class WishlistService {
  async getOrCreateWishlist(userId: string) {
    return prisma.wishlist.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: {
        products: true,
      },
    });
  }

  async addToWishlist(userId: string, productId: string) {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const wishlist = await this.getOrCreateWishlist(userId);

    // Check if product is already in wishlist
    const exists = await prisma.wishlist.findFirst({
      where: {
        id: wishlist.id,
        products: { some: { id: productId } },
      },
    });

    if (exists) {
      throw new Error("Product already in wishlist");
    }

    await prisma.wishlist.update({
      where: { id: wishlist.id },
      data: {
        products: { connect: { id: productId } },
      },
    });

    return await this.getOrCreateWishlist(userId);
  }

  async removeFromWishlist(userId: string, productId: string) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      throw new Error("Wishlist not found");
    }

    await prisma.wishlist.update({
      where: { id: wishlist.id },
      data: {
        products: { disconnect: { id: productId } },
      },
    });

    return await this.getOrCreateWishlist(userId);
  }
}

export const wishlistService = new WishlistService();
