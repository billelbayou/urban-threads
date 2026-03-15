import { Router } from "express";
import rateLimit from "express-rate-limit";
import { Role } from "../generated/prisma/enums.js";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateOrderStatusSchema } from "../schemas/index.js";

const router = Router();

const orderRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many order requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", authenticate, orderRateLimiter, createOrder);
router.get("/mine", authenticate, getMyOrders);

router.get("/", authenticate, authorize([Role.ADMIN]), getAllOrders);
router.patch("/:id", authenticate, authorize([Role.ADMIN]), validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
