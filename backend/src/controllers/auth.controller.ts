import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { registerSchema, loginSchema } from "../utils/validation.js";
import { generateToken } from "../utils/jwt.js";
import { setAuthCookie, clearAuthCookie } from "../utils/cookies.js";
import { prisma } from "../utils/prisma.js";

export const register = async (req: Request, res: Response) => {
  try {
    // 1. Validate request body
    const validated = registerSchema.parse(req.body);

    // 2. Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      res.status(400).json({
        error: "Email is already in use",
      });
      return;
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // 4. Create user in database
    const user = await prisma.user.create({
      data: { ...validated, password: hashedPassword },
    });

    res
      .status(201)
      .json({ message: "User created successfully", userId: user.id });
    return;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
    return;
  }
};

/**
 * Login a user and set auth cookie
 */
export const login = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { email, password } = loginSchema.parse(req.body);

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: "Invalid credentials" });
      return;
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Generate JWT
    const token = generateToken(user.id, user.role);

    // Set cookie
    setAuthCookie(res, token);

    res.json({ message: "You are logged in", user });
    return;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const getUserInfos = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    res.json(user);
    return;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

/**
 * Logout a user (clear auth cookie)
 */
export const logout = (req: Request, res: Response) => {
  try {
    clearAuthCookie(res);
    res.json({ message: "Logged out successfully" });
    return;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
    return;
  }
};
