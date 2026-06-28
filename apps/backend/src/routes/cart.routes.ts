import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { addToCartSchema } from "../schemas/index.js";

const router = Router();

const cartRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: "Too many cart operations, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/", authenticate, getCart);
router.post(
  "/add",
  authenticate,
  cartRateLimiter,
  validate(addToCartSchema),
  addToCart,
);
router.put("/item/:itemId", authenticate, cartRateLimiter, updateCartItem);
router.delete("/item/:itemId", authenticate, cartRateLimiter, removeCartItem);
router.delete("/clear", authenticate, cartRateLimiter, clearCart);

export default router;
