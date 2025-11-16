import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin routes
router.post("/", authenticate, authorize(["ADMIN"]), createProduct);
router.patch("/:id", authenticate, authorize(["ADMIN"]), updateProduct);
router.delete("/:id", authenticate, authorize(["ADMIN"]), deleteProduct);

export default router;
