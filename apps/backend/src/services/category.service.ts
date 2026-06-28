import { prisma } from "../utils/prisma.js";
import { CategoryInput } from "../schemas/index.js";
import { NotFoundError } from "../errors/index.js";

export class CategoryService {
  async getAllCategories() {
    return await prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    });
  }

  async getCategoryById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!category || category.deletedAt) {
      throw new NotFoundError("Category");
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
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundError("Category");
    }

    return await prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const categoryService = new CategoryService();
