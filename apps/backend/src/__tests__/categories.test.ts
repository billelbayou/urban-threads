import { describe, it, expect } from "vitest";
import request from "supertest";
import { app, getAuthCookie } from "./helpers.js";
import { prisma } from "../utils/prisma.js";
import jwt from "jsonwebtoken";

describe("GET /api/category", () => {
  it("returns all categories", async () => {
    await prisma.category.create({
      data: {
        id: "test-cat",
        name: "Test Category",
        slug: "test-category",
      },
    });

    const res = await request(app).get("/api/category");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });
});

describe("GET /api/category/:id", () => {
  it("returns a category by id", async () => {
    await prisma.category.create({
      data: {
        id: "test-cat",
        name: "Test Category",
        slug: "test-category",
      },
    });

    const res = await request(app).get("/api/category/test-cat");

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Test Category");
  });

  it("returns 404 for non-existent category", async () => {
    const res = await request(app).get("/api/category/non-existent");

    expect(res.status).toBe(404);
  });
});

describe("POST /api/category (admin)", () => {
  it("creates a category", async () => {
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

    const res = await request(app)
      .post("/api/category")
      .set("Cookie", getAuthCookie())
      .send({ name: "New Category", slug: "new-category" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});

describe("DELETE /api/category/:id (admin)", () => {
  it("soft-deletes a category", async () => {
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
      data: {
        id: "test-cat",
        name: "Test Category",
        slug: "test-category",
      },
    });

    const res = await request(app)
      .delete("/api/category/test-cat")
      .set("Cookie", getAuthCookie());

    expect(res.status).toBe(200);
  });
});
