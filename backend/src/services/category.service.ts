import { prisma } from "../utils/prisma.js";
import { CategoryInput } from "../schemas/index.js";

export class CategoryService {
  async getAllCategories() {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  }

  async getCategoryById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  }

  async createCategory(data: CategoryInput) {
    return await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        parentId: data.parentId || null,
      },
    });
  }

  async deleteCategory(id: string) {
    return await prisma.category.delete({
      where: { id },
    });
  }
}

export const categoryService = new CategoryService();
