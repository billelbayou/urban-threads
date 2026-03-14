import { Router } from "express";
import { Role } from "../generated/prisma/enums.js";
import {
  getAllCategories,
  createCategory,
  getCategoryById,
  deleteCategory,
} from "../controllers/category.controller.js";

import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// Public
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Admin-only actions
router.post("/", authenticate, authorize([Role.ADMIN]), createCategory);
router.delete("/:id", authenticate, authorize([Role.ADMIN]), deleteCategory);

export default router;
