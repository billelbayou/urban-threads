import { Router } from "express";
import { Role } from "../generated/prisma/enums.js";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";

import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// Client
router.post("/", authenticate, createOrder);
router.get("/mine", authenticate, getMyOrders);

// Admin
router.get("/", authenticate, authorize([Role.ADMIN]), getAllOrders);
router.patch("/:id", authenticate, authorize([Role.ADMIN]), updateOrderStatus);

export default router;
