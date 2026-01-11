import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller";
import { validate } from "../middleware/validate";
import { AddToCartSchema } from "../utils/validation";

const router = Router();

router.get("/", authenticate, getCart);
router.post("/add", authenticate, validate(AddToCartSchema), addToCart);
router.put("/item/:itemId", authenticate, updateCartItem);
router.delete("/item/:itemId", authenticate, removeCartItem);
router.delete("/clear", authenticate, clearCart);

export default router;
