import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "./setup.js";
import { prisma } from "../utils/prisma.js";
import { getAuthCookie } from "./helpers.js";

describe("Order API", () => {
  it("POST /api/orders creates order from cart", async () => {
    await prisma.user.create({
      data: {
        id: "test-user-id",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "hashed-password",
      },
    });
    const category = await prisma.category.create({
      data: { id: "test-cat", name: "Test Cat", slug: "test-cat" },
    });
    await prisma.product.create({
      data: {
        id: "product-1",
        name: "Test Product",
        description: "A test product",
        price: 25.0,
        stock: 10,
        categoryId: category.id,
        images: [],
        infoSections: [],
        tags: ["test"],
      },
    });
    const cart = await prisma.cart.create({
      data: { userId: "test-user-id" },
    });
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: "product-1",
        quantity: 2,
        size: "L",
      },
    });

    const res = await request(app)
      .post("/api/orders")
      .set("Cookie", getAuthCookie());

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("returns 400 when cart is empty", async () => {
    await prisma.user.create({
      data: {
        id: "test-user-id",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "hashed-password",
      },
    });
    await prisma.cart.create({
      data: { userId: "test-user-id" },
    });

    const res = await request(app)
      .post("/api/orders")
      .set("Cookie", getAuthCookie());

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/orders/mine returns user orders", async () => {
    await prisma.user.create({
      data: {
        id: "test-user-id",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "hashed-password",
      },
    });
    await prisma.order.create({
      data: {
        userId: "test-user-id",
        total: 49.99,
      },
    });

    const res = await request(app)
      .get("/api/orders/mine")
      .set("Cookie", getAuthCookie());

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });
});
