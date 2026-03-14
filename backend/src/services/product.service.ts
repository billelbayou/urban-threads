import { prisma } from "../utils/prisma.js";
import { getProductImageUrl, storageService } from "./storage.service.js";
import { Prisma } from "../generated/prisma/client.js";
import { ProductInput } from "../utils/validation.js";
import { imageProcessorService } from "./image_processor.service.js";

export interface RawImage {
  url?: string;
  path: string;
}

export interface InfoSection {
  title: string;
  content: string;
}

export interface ProductWithDetails {
  id: string;
  name: string;
  description: string;
  price: Prisma.Decimal;
  stock: number;
  categoryId: string;
  images: any; // Type as any for now to handle Prisma Json transformation
  infoSections: any;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  category: {
    name: string;
    slug: string;
  };
}

export class ProductService {
  private static async resolveImageUrls(product: any): Promise<void> {
    if (!product || !product.images) return;

    product.images = await Promise.all(
      product.images.map(async (img: any) => {
        // New structure with variants
        if (img.original) {
          const variants = ["original", "thumbnail", "mobile", "desktop"];
          const resolved: any = {};

          await Promise.all(
            variants.map(async (v) => {
              if (img[v]) {
                resolved[v] = {
                  url: await getProductImageUrl(img[v].path),
                  path: img[v].path,
                };
              }
            }),
          );
          return resolved;
        }

        // Old structure fallback
        if (img.path) {
          return {
            url: await getProductImageUrl(img.path),
            path: img.path,
          };
        }
        return img;
      }),
    );
  }

  /**
   * Get all products with resolved image URLs
   */
  async getAllProducts() {
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

    await Promise.all(products.map((p) => ProductService.resolveImageUrls(p)));
    return products;
  }

  /**
   * Get single product by ID with resolved image URLs
   */
  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    if (product) {
      await ProductService.resolveImageUrls(product);
    }
    return product;
  }

  /**
   * Create a new product with optional image uploads
   */
  async createProduct(data: ProductInput, files?: Express.Multer.File[]) {
    // 1. Process and upload new files if any
    const uploadedImages = [];
    if (files && files.length > 0) {
      for (const file of files) {
        // Optimize and resize
        const processedSet = await imageProcessorService.processImage(
          file.buffer,
        );

        // Upload all variants
        const variants = Object.entries(processedSet);
        const imageResult: any = {};

        await Promise.all(
          variants.map(async ([key, variant]) => {
            const fileName = `products/${Date.now()}-${key}-${Math.random().toString(36).substring(7)}.webp`;
            const result = await storageService.uploadBuffer(
              variant.buffer,
              fileName,
              "", // folderPath is in fileName
              "image/webp",
              variant.size,
            );
            imageResult[key] = {
              path: result.path,
            };
          }),
        );

        uploadedImages.push(imageResult);
      }
    }

    // 2. Combine with existing images and validate
    const finalImages = [...(data.images || []), ...uploadedImages];

    if (finalImages.length === 0) {
      throw new Error("At least one image is required");
    }

    const newProduct = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        tags: data.tags,
        images: finalImages,
        infoSections: data.infoSections,
      },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    await ProductService.resolveImageUrls(newProduct);
    return newProduct;
  }

  /**
   * Update an existing product with optional new image uploads
   */
  async updateProduct(
    id: string,
    data: ProductInput,
    files?: Express.Multer.File[],
  ) {
    // 1. Process and upload new files if any
    const uploadedImages = [];
    if (files && files.length > 0) {
      for (const file of files) {
        // Optimize and resize
        const processedSet = await imageProcessorService.processImage(
          file.buffer,
        );

        // Upload all variants
        const variants = Object.entries(processedSet);
        const imageResult: any = {};

        await Promise.all(
          variants.map(async ([key, variant]) => {
            const fileName = `products/${Date.now()}-${key}-${Math.random().toString(36).substring(7)}.webp`;
            const result = await storageService.uploadBuffer(
              variant.buffer,
              fileName,
              "",
              "image/webp",
              variant.size,
            );
            imageResult[key] = {
              path: result.path,
            };
          }),
        );

        uploadedImages.push(imageResult);
      }
    }

    // 2. Combine with existing images (data.images contains images chosen to be kept)
    const finalImages = [...(data.images || []), ...uploadedImages];

    if (finalImages.length === 0) {
      throw new Error("At least one image is required");
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        tags: data.tags,
        images: finalImages,
        infoSections: data.infoSections,
      },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    await ProductService.resolveImageUrls(updatedProduct);
    return updatedProduct;
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: string) {
    return await prisma.product.delete({
      where: { id },
    });
  }
}

export const productService = new ProductService();
