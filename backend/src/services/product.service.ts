import { prisma } from "../utils/prisma.js";
import { getProductImageUrl, storageService } from "./storage.service.js";
import { Prisma } from "../generated/prisma/client.js";
import { ProductInput } from "../schemas/index.js";
import { imageProcessorService } from "./image_processor.service.js";
import { AppError, NotFoundError } from "../errors/index.js";

export interface RawImage {
  url?: string;
  path: string;
}

export interface ImageVariant {
  url: string;
  path: string;
}

export interface ProductImage {
  original?: ImageVariant;
  thumbnail?: ImageVariant;
  mobile?: ImageVariant;
  desktop?: ImageVariant;
  url?: string;
  path?: string;
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
  images: ProductImage[];
  infoSections: InfoSection[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  category: {
    name: string;
    slug: string;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ProductService {
  private static async resolveImageUrls(product: any): Promise<void> {
    if (!product || !product.images) return;

    product.images = await Promise.all(
      product.images.map(async (img: any) => {
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

  async getAllProducts(params: PaginationParams = {}) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const where = { deletedAt: null as Date | null };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { name: true, slug: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    await Promise.all(products.map((p) => ProductService.resolveImageUrls(p)));

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    if (!product || product.deletedAt) {
      throw new NotFoundError("Product");
    }

    await ProductService.resolveImageUrls(product);
    return product;
  }

  async createProduct(data: ProductInput, files?: Express.Multer.File[]) {
    const uploadedImages = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const processedSet = await imageProcessorService.processImage(
          file.buffer,
        );

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

    const finalImages = [...(data.images || []), ...uploadedImages];

    if (finalImages.length === 0) {
      throw new AppError("At least one image is required", 400);
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

  async updateProduct(
    id: string,
    data: ProductInput,
    files?: Express.Multer.File[],
  ) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundError("Product");
    }

    const uploadedImages = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const processedSet = await imageProcessorService.processImage(
          file.buffer,
        );

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

    const finalImages = [...(data.images || []), ...uploadedImages];

    if (finalImages.length === 0) {
      throw new AppError("At least one image is required", 400);
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

  async deleteProduct(id: string) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundError("Product");
    }

    return await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const productService = new ProductService();
