import { Request, Response } from "express";
import { ProductSchema } from "../utils/validation.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { prisma } from "../utils/prisma.js";
import { getProductImageUrl } from "../services/storage.service.js";

// ============================================================================
// Helper: Resolve presigned URLs for product images
// ============================================================================

interface RawImage {
  url?: string;
  path: string;
}

/**
 * Replace stored paths with fresh presigned URLs for all product images.
 * Works for a single product or an array of products.
 */
async function resolveImageUrls<T extends { images: RawImage[] }>(
  productOrProducts: T | T[],
): Promise<void> {
  const products = Array.isArray(productOrProducts)
    ? productOrProducts
    : [productOrProducts];

  await Promise.all(
    products.map(async (product) => {
      product.images = await Promise.all(
        (product.images as RawImage[]).map(async (img) => ({
          url: await getProductImageUrl(img.path),
          path: img.path,
        })),
      );
    }),
  );
}

// ============================================================================
// Controllers
// ============================================================================

/** Get all products (public) */
export const getAllProducts = async (_req: Request, res: Response) => {
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

  // Generate presigned URLs for every product's images
  await resolveImageUrls(products as any);

  res.status(200).json(products);
};

/** Get single product by ID (public) */
export const getProductById = async (req: Request, res: Response) => {
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

  // Generate presigned URL for this product's images
  await resolveImageUrls(product as any);

  res.status(200).json(product);
};

/** Create product (admin only) */
export const createProduct = async (req: AuthRequest, res: Response) => {
  // Validate request body
  const resp = ProductSchema.safeParse(req.body);
  if (!resp.success) {
    res.status(400).json({
      error: "Validation failed",
      details: resp.error.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }
  const data = resp.data;

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

  // Resolve presigned URLs for the response
  await resolveImageUrls(newProduct as any);

  res.status(201).json({
    message: "Product created successfully",
    product: newProduct,
  });
};

/** Update product (admin only) */
export const updateProduct = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };

  const resp = ProductSchema.safeParse(req.body);
  if (!resp.success) {
    res.status(400).json({
      error: "Validation failed",
      details: resp.error.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }
  const data = resp.data;
  const updatedProduct = await prisma.product.update({
    where: { id },
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

  // Resolve presigned URLs for the response
  await resolveImageUrls(updatedProduct as any);

  res.status(200).json({
    message: "Product updated successfully",
    product: updatedProduct,
  });
};

/** Delete product (admin only) */
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };

  await prisma.product.delete({
    where: { id },
  });

  res.status(200).json({
    message: "Product deleted successfully",
  });
};
