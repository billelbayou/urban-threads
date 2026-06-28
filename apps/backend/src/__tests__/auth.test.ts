import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { app, getAuthCookie } from "./helpers.js";
import { prisma } from "../utils/prisma.js";
import jwt from "jsonwebtoken";
import { Mock } from "vitest";

describe("POST /api/auth/register", () => {
  it("registers a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBe("User created successfully");

    const user = await prisma.user.findUnique({
      where: { email: "john@example.com" },
    });
    expect(user).not.toBeNull();
    expect(user!.firstName).toBe("John");
  });

  it("rejects duplicate email", async () => {
    await prisma.user.create({
      data: {
        firstName: "Existing",
        lastName: "User",
        email: "existing@example.com",
        password: "hashed-password",
      },
    });

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "existing@example.com",
        password: "password123",
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe("Email is already in use");
  });
});

describe("POST /api/auth/login", () => {
  it("logs in with valid credentials", async () => {
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
      .post("/api/auth/login")
      .send({ email: "john@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBe("You are logged in");
  });

  it("rejects invalid email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "wrong@example.com", password: "password123" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe("GET /api/auth/me", () => {
  it("returns current user when authenticated", async () => {
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
      .get("/api/auth/me")
      .set("Cookie", getAuthCookie());

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("john@example.com");
  });

  it("returns 401 when not authenticated", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe("POST /api/auth/logout", () => {
  it("logs out successfully", async () => {
    const res = await request(app).post("/api/auth/logout");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
