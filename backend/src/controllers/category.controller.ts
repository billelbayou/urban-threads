import { Request, Response } from "express";
import { categoryService } from "../services/category.service.js";
import { asyncHandler } from "../middleware/error.middleware.js";

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await categoryService.createCategory(req.body);
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
