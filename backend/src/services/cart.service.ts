import { prisma } from "../utils/prisma.js";

export class CartService {
  async getOrCreateCart(userId: string) {
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
      throw new Error("Cart item not found");
    }

    if (cartItem.cart.userId !== userId) {
      throw new Error("Forbidden");
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
      throw new Error("Cart item not found");
    }

    if (cartItem.cart.userId !== userId) {
      throw new Error("Forbidden");
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
