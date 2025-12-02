import { Request, Response } from "express";
import { productSchema } from "../utils/validation";
import { AuthRequest } from "../middleware/auth.middleware"; // extended Request with user info
import { prisma } from "../utils/prisma";

/** Get all products (public) */
export const getAllProducts = async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    include: { infoSections: true, images: true, category: true },
  });
  res.json(products);
};

/** Get single product by ID (public) */
export const getProductById = async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { infoSections: true, images: true, category: true },
  });
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
};

/** Create product (admin only) */
/** Create product (admin only) */
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const validated = productSchema.parse(req.body);

    const product = await prisma.product.create({
      data: {
        ...validated,

        // IMAGES
        images: validated.images
          ? {
              create: validated.images.map((url) => ({ url })),
            }
          : undefined,

        // INFO SECTIONS
        infoSections: validated.infoSections //error
          ? {
              create: validated.infoSections.map((section) => ({
                title: section.title,
                content: section.content,
              })),
            }
          : undefined,
      },

      include: {
        images: true,
        infoSections: true, //error
      },
    });

    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

/** Update product (admin only) */
/** Update product (admin only) */
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const validated = productSchema.partial().parse(req.body);

    // Separate images, infoSections and categoryId from other fields
    const { infoSections, images, categoryId, ...productData } = validated;

    // Build the data object using nested writes for relations to avoid mixing scalar categoryId with nested updates
    const data: any = { ...productData };

    // Handle images update if provided
    if (images) {
      data.images = {
        deleteMany: {}, // Remove existing images
        create: images.map((url) => ({ url })), // Add new images
      };
    }

    // Handle infoSections update if provided
    if (infoSections) {
      data.infoSections = {
        deleteMany: {}, // Remove existing info sections
        create: infoSections.map((section) => ({
          title: section.title,
          content: section.content,
        })), // Add new info sections
      };
    }

    // Handle category change via relation connect when categoryId provided
    if (categoryId) {
      data.category = {
        connect: { id: categoryId },
      };
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data,
      include: { images: true, category: true, infoSections: true }, // Include relations in response
    });

    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

/** Delete product (admin only) */
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    console.log("Deleting product with ID:", req.params.id);

    const productId = req.params.id;

    // 1. Delete images
    await prisma.productImage.deleteMany({
      where: { productId },
    });

    // 2. Delete product
    await prisma.product.delete({
      where: { id: productId },
    });

    res.json({ message: "Product deleted" });
  } catch (err: any) {
    console.error("Delete error:", err);
    res.status(400).json({ error: err.message });
  }
};
