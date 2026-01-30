import { Request, Response } from "express";
import { ProductSchema } from "../utils/validation";
import { AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../utils/prisma";
import z from "zod";

/** Get all products (public) */
export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

/** Get single product by ID (public) */
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

/** Create product (admin only) */
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    // Validate request body
    const data = ProductSchema.parse(req.body);

    // Create the product
    const newProduct = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        tags: data.tags,
        images: data.images,
        infoSections: data.infoSections,
      },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    });
    
    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      // Return clean validation errors
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }

    if (error instanceof Error && (error as any).code === "P2003") {
      return res.status(400).json({
        error: "Invalid categoryId: Category does not exist",
      });
    }
    return res.status(500).json({ error: "Failed to create product" });
  }
};

/** Update product (admin only) */
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const data = ProductSchema.parse(req.body);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        tags: data.tags,
        images: data.images,
        infoSections: data.infoSections,
      },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: "Validation failed",
        details: error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
      return;
    }

    if (error instanceof Error && (error as any).code === "P2025") {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    if (error instanceof Error && (error as any).code === "P2003") {
      res.status(400).json({
        error: "Invalid categoryId: Category does not exist",
      });
      return;
    }

    res.status(500).json({ error: "Failed to update product" });
  }
};

/** Delete product (admin only) */
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error && (error as any).code === "P2025") {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(500).json({ error: "Failed to delete product" });
  }
};
