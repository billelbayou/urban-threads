import { Request, Response } from "express";
import {
  registerSchema,
  loginSchema,
  updatePersonalInfoSchema,
  updateShippingAddressSchema,
} from "../utils/validation.js";
import { authService } from "../services/auth.service.js";
import { asyncHandler } from "../middleware/error.middleware.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const validated = registerSchema.parse(req.body);
  const result = await authService.register(validated);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const validated = loginSchema.parse(req.body);
  const result = await authService.login(validated, res);
  res.json(result);
});

export const getUserInfos = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const user = await authService.getUserById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  },
);

export const updatePersonalInfo = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const validated = updatePersonalInfoSchema.parse(req.body);
    const user = await authService.updatePersonalInfo(userId, validated);
    res.json({ message: "Personal info updated", user });
  },
);

export const updateShippingAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const validated = updateShippingAddressSchema.parse(req.body);
    const user = await authService.updateShippingAddress(userId, validated);
    res.json({ message: "Shipping address updated", user });
  },
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.logout(res);
  res.json(result);
});

export const getAllUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    
    const result = await authService.getAllUsers({ page, limit });
    res.json(result);
  },
);

export const deleteAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const result = await authService.deleteAccount(userId, res);
    res.json(result);
  },
);
