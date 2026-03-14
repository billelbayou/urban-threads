import { Router } from "express";
import { Role } from "../generated/prisma/enums.js";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

import { upload } from "../middleware/upload.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin routes
router.post(
  "/",
  authenticate,
  authorize([Role.ADMIN]),
  upload.array("images"),
  createProduct,
);
router.patch(
  "/:id",
  authenticate,
  authorize([Role.ADMIN]),
  upload.array("images"),
  updateProduct,
);
router.delete("/:id", authenticate, authorize([Role.ADMIN]), deleteProduct);

export default router;
