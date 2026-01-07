// controllers/category.controller.ts
import { Request, Response } from "express";
import { CategorySchema } from "../utils/validation";
import { prisma } from "../utils/prisma";

export async function createCategory(req: Request, res: Response) {
  try {
    const validatedData = CategorySchema.parse(req.body);

    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        parentId: validatedData.parentId || null,
      },
    });

    res.status(201).json(category);
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ errors: error.errors });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

// 2. Get All Categories (Flat list for the frontend to build the tree)
export async function getAllCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
}

// 3. Get a Single Category with its immediate children
export async function getCategoryById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: { children: true }, // Fetches the next level down
    });

    if (!category) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category" });
  }
}

// 4. Delete a Category
export async function deleteCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Note: If you have children, you need to decide if you delete them
    // or move them. Prisma will throw an error if you try to delete a
    // parent that has children unless you set 'onDelete: Cascade' in schema.
    await prisma.category.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Could not delete category" });
  }
}
