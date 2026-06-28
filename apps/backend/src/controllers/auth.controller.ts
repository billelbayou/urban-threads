import { Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { sendSuccess } from "../utils/response.js";
import { NotFoundError } from "../errors/index.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  sendSuccess(res, result, undefined, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body, res);
  sendSuccess(res, result);
});

export const getUserInfos = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const user = await authService.getUserById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }
    sendSuccess(res, user);
  },
);

export const updatePersonalInfo = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const user = await authService.updatePersonalInfo(userId, req.body);
    sendSuccess(res, user, "Personal info updated");
  },
);

export const updateShippingAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const user = await authService.updateShippingAddress(userId, req.body);
    sendSuccess(res, user, "Shipping address updated");
  },
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.logout(res);
  sendSuccess(res, result);
});

export const getAllUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    
    const result = await authService.getAllUsers({ page, limit });
    sendSuccess(res, result.data, undefined, 200, result.pagination);
  },
);

export const deleteAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const result = await authService.deleteAccount(userId, res);
    sendSuccess(res, result);
  },
);
