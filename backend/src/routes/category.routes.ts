import { Router } from "express";
import {
  getAllCategories,
  createCategory,
  getCategoryById,
  deleteCategory,
} from "../controllers/category.controller";

import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

// Public
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Admin-only actions
router.post("/", authenticate, authorize(["ADMIN"]), createCategory);
router.delete("/:id", authenticate, authorize(["ADMIN"]), deleteCategory);

export default router;
