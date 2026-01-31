import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { registerSchema, loginSchema } from "../utils/validation";
import { generateToken } from "../utils/jwt";
import { setAuthCookie, clearAuthCookie } from "../utils/cookies";
import { prisma } from "../utils/prisma";

export const register = async (req: Request, res: Response) => {
  try {
    // 1. Validate request body
    const validated = registerSchema.parse(req.body);

    // 2. Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Email is already in use",
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // 4. Create user in database
    const user = await prisma.user.create({
      data: { ...validated, password: hashedPassword },
    });

    res.status(201).json({ message: "User created successfully", userId: user.id });
  } catch (err: any) {
    res.status(400).json({ error: err.errors || err.message });
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
  } catch (err: any) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

export const getUserInfos = async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  res.json(user);
};

/**
 * Logout a user (clear auth cookie)
 */
export const logout = (req: Request, res: Response) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out successfully" });
};
