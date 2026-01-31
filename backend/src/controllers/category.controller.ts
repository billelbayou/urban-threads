// controllers/category.controller.ts
import { Request, Response } from "express";
import { CategorySchema } from "../utils/validation";
import { prisma } from "../utils/prisma";

export async function createCategory(req: Request, res: Response) {
  try {
    const validatedData = CategorySchema.safeParse(req.body);

    if (!validatedData.success) {
      res.status(400).json({ errors: validatedData.error.errors });
      return;
    }

    const data = validatedData.data;

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        parentId: data.parentId || null,
      },
    });

    res.status(201).json(category);
    return;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
    return;
  }
}

// 2. Get All Categories (Flat list for the frontend to build the tree)
export async function getAllCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    res.json(categories);
    return;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
    return;
  }
}

// 3. Get a Single Category with its immediate children
export async function getCategoryById(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const category = await prisma.category.findUnique({
      where: { id },
      include: { children: true }, // Fetches the next level down
    });

    if (!category) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.json(category);
    return;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
    return;
  }
}

// 4. Delete a Category
export async function deleteCategory(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    await prisma.category.delete({
      where: { id },
    });

    res.status(204).send();
    return;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
    return;
  }
}
