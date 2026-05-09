import { describe, it, expect } from "vitest";
import request from "supertest";
import { app, getAuthCookie } from "./helpers.js";
import { prisma } from "../utils/prisma.js";
import jwt from "jsonwebtoken";

describe("GET /api/products", () => {
  it("returns paginated products", async () => {
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
        images: [{ path: "test-path", url: "https://test.url/image.webp" }],
        infoSections: [],
        tags: ["test"],
      },
    });

    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination).toBeDefined();
  });
});

describe("GET /api/products/:id", () => {
  it("returns a product by id", async () => {
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
        images: [{ path: "test-path", url: "https://test.url/image.webp" }],
        infoSections: [],
        tags: ["test"],
      },
    });

    const res = await request(app).get("/api/products/product-1");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Test Product");
  });

  it("returns 404 for non-existent product", async () => {
    const res = await request(app).get("/api/products/non-existent");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe("POST /api/products (admin)", () => {
  it("creates a product", async () => {
    (jwt.verify as any).mockReturnValue({ id: "admin-id", role: "ADMIN" });

    await prisma.user.create({
      data: {
        id: "admin-id",
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        password: "hashed-password",
        role: "ADMIN",
      },
    });
    await prisma.category.create({
      data: { id: "11111111-1111-1111-1111-111111111111", name: "Test Cat", slug: "test-cat" },
    });

    const res = await request(app)
      .post("/api/products")
      .set("Cookie", getAuthCookie())
      .field(
        "product",
        JSON.stringify({
          name: "New Product",
          description: "Description",
          price: 29.99,
          stock: 5,
          categoryId: "11111111-1111-1111-1111-111111111111",
          tags: ["new"],
          infoSections: [{ title: "Care", content: "Hand wash" }],
        }),
      )
      .attach("images", Buffer.from("fake-image"), "test.webp");

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("rejects unauthenticated request", async () => {
    const res = await request(app).post("/api/products");

    expect(res.status).toBe(401);
  });
});

describe("DELETE /api/products/:id (admin)", () => {
  it("soft-deletes a product", async () => {
    (jwt.verify as any).mockReturnValue({ id: "admin-id", role: "ADMIN" });

    await prisma.user.create({
      data: {
        id: "admin-id",
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        password: "hashed-password",
        role: "ADMIN",
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
        images: [{ path: "test-path", url: "https://test.url/image.webp" }],
        infoSections: [],
        tags: ["test"],
      },
    });

    const res = await request(app)
      .delete("/api/products/product-1")
      .set("Cookie", getAuthCookie());

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const product = await prisma.product.findUnique({
      where: { id: "product-1" },
    });
    expect(product!.deletedAt).not.toBeNull();
  });
});
