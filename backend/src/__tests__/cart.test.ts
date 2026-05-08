import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "./setup.js";
import { prisma } from "../utils/prisma.js";
import { getAuthCookie } from "./helpers.js";

describe("Cart API", () => {
  it("GET /api/cart returns cart", async () => {
    await prisma.user.create({
      data: {
        id: "test-user-id",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "hashed-password",
      },
    });

    const res = await request(app)
      .get("/api/cart")
      .set("Cookie", getAuthCookie());

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("POST /api/cart/add adds item", async () => {
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
        price: 49.99,
        stock: 10,
        categoryId: category.id,
        images: [],
        infoSections: [],
        tags: ["test"],
      },
    });

    const res = await request(app)
      .post("/api/cart/add")
      .set("Cookie", getAuthCookie())
      .send({ productId: "product-1", quantity: 1, size: "M" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("DELETE /api/cart/item/:id removes item", async () => {
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
        price: 49.99,
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
    const item = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: "product-1",
        quantity: 1,
        size: "M",
      },
    });

    const res = await request(app)
      .delete(`/api/cart/item/${item.id}`)
      .set("Cookie", getAuthCookie());

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("returns 401 when not authenticated", async () => {
    const res = await request(app).get("/api/cart");

    expect(res.status).toBe(401);
  });
});
