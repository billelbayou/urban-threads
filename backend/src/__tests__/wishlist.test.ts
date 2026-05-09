import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "./setup.js";
import { prisma } from "../utils/prisma.js";
import { getAuthCookie } from "./helpers.js";

describe("Wishlist API", () => {
  it("GET /api/wishlist returns wishlist", async () => {
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
      .get("/api/wishlist")
      .set("Cookie", getAuthCookie());

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("POST /api/wishlist/add adds product", async () => {
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
      .post("/api/wishlist/add")
      .set("Cookie", getAuthCookie())
      .send({ productId: "product-1" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("DELETE /api/wishlist/:productId removes product", async () => {
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
    await prisma.wishlist.create({
      data: {
        userId: "test-user-id",
        products: { connect: { id: "product-1" } },
      },
    });

    const res = await request(app)
      .delete("/api/wishlist/product-1")
      .set("Cookie", getAuthCookie());

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
