import { Request, Response } from "express";
import { CategorySchema } from "../utils/validation.js";
import { categoryService } from "../services/category.service.js";
import { asyncHandler } from "../middleware/error.middleware.js";

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const validated = CategorySchema.parse(req.body);
    const category = await categoryService.createCategory(validated);
    res.status(201).json(category);
  },
);

export const getAllCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  },
);

export const getCategoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const category = await categoryService.getCategoryById(id);
    res.json(category);
  },
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await categoryService.deleteCategory(id);
    res.status(204).send();
  },
);
