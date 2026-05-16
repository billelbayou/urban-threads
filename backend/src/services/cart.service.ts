import { prisma } from "../utils/prisma.js";
import { NotFoundError, ForbiddenError } from "../errors/index.js";
import { getProductImageUrl } from "./storage.service.js";

async function resolveProductImages(product: any): Promise<void> {
  if (!product || !product.images) return;

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
}

export class CartService {
  async getOrCreateCart(userId: string) {
    const cart = await prisma.cart.upsert({
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

    await Promise.all(
      cart.items.map((item) => resolveProductImages(item.product)),
    );

    return cart;
  }

  async addToCart(
    userId: string,
    productId: string,
    quantity: number,
    size: string,
  ) {
    const cart = await this.getOrCreateCart(userId);

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

    return await this.getOrCreateCart(userId);
  }

  async updateCartItem(userId: string, itemId: string, quantity: number) {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!cartItem) {
      throw new NotFoundError("Cart item");
    }

    if (cartItem.cart.userId !== userId) {
      throw new ForbiddenError();
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return await this.getOrCreateCart(userId);
  }

  async removeCartItem(userId: string, itemId: string) {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!cartItem) {
      throw new NotFoundError("Cart item");
    }

    if (cartItem.cart.userId !== userId) {
      throw new ForbiddenError();
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return await this.getOrCreateCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return await this.getOrCreateCart(userId);
  }
}

export const cartService = new CartService();
