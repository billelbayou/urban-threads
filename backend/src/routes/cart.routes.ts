import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";
import { validate } from "../middleware/validate.js";
import { AddToCartSchema } from "../utils/validation.js";

const router = Router();

router.get("/", authenticate, getCart);
router.post("/add", authenticate, validate(AddToCartSchema), addToCart);
router.put("/item/:itemId", authenticate, updateCartItem);
router.delete("/item/:itemId", authenticate, removeCartItem);
router.delete("/clear", authenticate, clearCart);

export default router;
