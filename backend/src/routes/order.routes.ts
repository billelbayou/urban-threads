import { Router } from "express";
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
router.get("/", authenticate, authorize(["ADMIN"]), getAllOrders);
router.patch("/:id", authenticate, authorize(["ADMIN"]), updateOrderStatus);

export default router;
