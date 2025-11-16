import { Request, Response } from "express";
import { productSchema } from "../utils/validation";
import { AuthRequest } from "../middleware/auth.middleware"; // extended Request with user info
import { prisma } from "../utils/prisma";

/** Get all products (public) */
export const getAllProducts = async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    include: { images: true, category: true },
  });
  res.json(products);
};

/** Get single product by ID (public) */
export const getProductById = async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { images: true, category: true },
  });
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
};

/** Create product (admin only) */
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const validated = productSchema.parse(req.body);

    const product = await prisma.product.create({
      data: {
        ...validated,
        images: validated.images
          ? { create: validated.images.map((url) => ({ url })) }
          : undefined,
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

    // Separate images from other fields
    const { images, ...productData } = validated;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...productData,
        // Handle images update if provided
        ...(images && {
          images: {
            deleteMany: {}, // Remove existing images
            create: images.map((url) => ({ url })), // Add new images
          },
        }),
      },
      include: { images: true, category: true }, // Include relations in response
    });

    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

/** Delete product (admin only) */
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {

    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: "Product deleted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
