import { Request, Response } from "express";
import { productSchema } from "../schemas/index.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { productService } from "../services/product.service.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { sendSuccess } from "../utils/response.js";
import { AppError } from "../errors/index.js";

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    
    const result = await productService.getAllProducts({ page, limit });
    sendSuccess(res, result.data, undefined, 200, result.pagination);
  },
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const product = await productService.getProductById(id);
    sendSuccess(res, product);
  },
);

export const createProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    let productData;
    try {
      productData = JSON.parse(req.body.product);
    } catch {
      throw new AppError("Invalid product data format", 400);
    }

    const resp = productSchema.safeParse(productData);
    if (!resp.success) {
      throw new AppError("Validation failed", 400, {
        details: resp.error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }

    const files = req.files as Express.Multer.File[];
    const newProduct = await productService.createProduct(resp.data, files || []);

    sendSuccess(res, newProduct, "Product created successfully", 201);
  },
);

export const updateProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    let productData;
    try {
      productData = JSON.parse(req.body.product);
    } catch {
      throw new AppError("Invalid product data format", 400);
    }

    const resp = productSchema.safeParse(productData);
    if (!resp.success) {
      throw new AppError("Validation failed", 400, {
        details: resp.error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }

    const files = req.files as Express.Multer.File[];
    const updatedProduct = await productService.updateProduct(id, resp.data, files || []);

    sendSuccess(res, updatedProduct, "Product updated successfully");
  },
);

export const deleteProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    await productService.deleteProduct(id);
    sendSuccess(res, undefined, "Product deleted successfully");
  },
);
