import { Request, Response } from "express";
import { categorySchema } from "../utils/validation";
import { AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../utils/prisma";

/** Get all categories (public) */
export const getCategories = async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    include: {
      products: true, // optional, you can remove if heavy
    },
  });

  res.json(categories);
};

/** Create category (admin only) */
export const createCategory = async (req: AuthRequest, res: Response) => {
  try {

    const validated = categorySchema.parse(req.body);

    const category = await prisma.category.create({
      data: validated,
    });

    res.status(201).json(category);
  } catch (err: any) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

/** Update category name */
export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {

    const validated = categorySchema.partial().parse(req.body);

    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: validated,
    });

    res.json(category);
  } catch (err: any) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

/** Delete category */
export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Category deleted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};