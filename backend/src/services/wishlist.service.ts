import { prisma } from "../utils/prisma.js";
import { NotFoundError, ConflictError, AppError } from "../errors/index.js";
import { getProductImageUrl } from "./storage.service.js";

export class WishlistService {
  private async resolveProductImages(wishlist: any): Promise<void> {
    if (!wishlist?.products) return;
    await Promise.all(
      wishlist.products.map(async (product: any) => {
        if (!product?.images) return;
        product.images = await Promise.all(
          product.images.map(async (img: any) => {
            if (img.original) {
              const variants = ["original", "thumbnail", "mobile", "desktop"];
              const resolved: any = {};
              await Promise.all(
                variants.map(async (v) => {
                  if (img[v]) {
                    resolved[v] = {
                      url: await getProductImageUrl(img[v].path),
                      path: img[v].path,
                    };
                  }
                }),
              );
              return resolved;
            }
            if (img.path) {
              return {
                url: await getProductImageUrl(img.path),
                path: img.path,
              };
            }
            return img;
          }),
        );
      }),
    );
  }

  async getOrCreateWishlist(userId: string) {
    const wishlist = await prisma.wishlist.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: {
        products: true,
      },
    });
    await this.resolveProductImages(wishlist);
    return wishlist;
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
