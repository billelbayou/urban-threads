import { prisma } from "../utils/prisma.js";
import { NotFoundError, ConflictError, AppError } from "../errors/index.js";

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
      throw new AppError("Product ID is required", 400);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError("Product");
    }

    const wishlist = await this.getOrCreateWishlist(userId);

    const exists = await prisma.wishlist.findFirst({
      where: {
        id: wishlist.id,
        products: { some: { id: productId } },
      },
    });

    if (exists) {
      throw new ConflictError("Product already in wishlist");
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
      throw new NotFoundError("Wishlist");
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
