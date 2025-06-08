import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import { setAuthCookie, clearAuthCookie } from "../utils/cookie.utils";

// Login controller
export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await AuthService.login(email, password);

    setAuthCookie(res, token);

    res.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message || "Invalid credentials" });
  }
};

// Register controller
export const registerHandler = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const { user, token } = await AuthService.register({
      email,
      password,
      name,
    });

    setAuthCookie(res, token);

    res.status(201).json({
      message: "Registration successful",
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Registration failed" });
  }
};

// Logout controller
export const logoutHandler = (req: Request, res: Response) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out successfully" });
};

// Get current user controller
export const getCurrentUserHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const user = await AuthService.getCurrentUser(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
