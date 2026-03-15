import { Request, Response } from "express";
import { productSchema } from "../schemas/index.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { productService } from "../services/product.service.js";
import { asyncHandler } from "../middleware/error.middleware.js";

/** Get all products (public) */
export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    
    const result = await productService.getAllProducts({ page, limit });
    res.status(200).json(result);
  },
);

/** Get single product by ID (public) */
export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const product = await productService.getProductById(id);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(200).json(product);
  },
);

/** Create product (admin only) */
export const createProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    // 1. Parse product JSON string from req.body
    let productData;
    try {
      productData = JSON.parse(req.body.product);
    } catch (e) {
      res.status(400).json({ error: "Invalid product data format" });
      return;
    }

    // 2. Validate everything EXCEPT images first (as images might be in files)
    const resp = productSchema.safeParse(productData);
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

    // 3. Handle files
    const files = req.files as Express.Multer.File[];

    // 4. Create product with images
    const newProduct = await productService.createProduct(
      resp.data,
      files || [],
    );

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  },
);

/** Update product (admin only) */
export const updateProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };

    // 1. Parse product JSON string from req.body
    let productData;
    try {
      productData = JSON.parse(req.body.product);
    } catch (e) {
      res.status(400).json({ error: "Invalid product data format" });
      return;
    }

    // 2. Validate
    const resp = productSchema.safeParse(productData);
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

    // 3. Handle files
    const files = req.files as Express.Multer.File[];

    // 4. Update product
    const updatedProduct = await productService.updateProduct(
      id,
      resp.data,
      files || [],
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  },
);

/** Delete product (admin only) */
export const deleteProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    await productService.deleteProduct(id);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  },
);
