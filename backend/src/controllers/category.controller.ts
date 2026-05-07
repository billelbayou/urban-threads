import { Request, Response } from "express";
import { categoryService } from "../services/category.service.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { sendSuccess } from "../utils/response.js";

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await categoryService.createCategory(req.body);
    sendSuccess(res, category, undefined, 201);
  },
);

export const getAllCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await categoryService.getAllCategories();
    sendSuccess(res, categories);
  },
);

export const getCategoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const category = await categoryService.getCategoryById(id);
    sendSuccess(res, category);
  },
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await categoryService.deleteCategory(id);
    sendSuccess(res, undefined, "Category deleted successfully");
  },
);
