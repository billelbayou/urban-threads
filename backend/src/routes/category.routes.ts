import { Router } from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";

import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

// Public
router.get("/", getCategories);

// Admin-only actions
router.post("/", authenticate, authorize(["ADMIN"]), createCategory);
router.patch("/:id", authenticate, authorize(["ADMIN"]), updateCategory);
router.delete("/:id", authenticate, authorize(["ADMIN"]), deleteCategory);

export default router;
