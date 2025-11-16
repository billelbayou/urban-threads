import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller";

const router = Router();

router.get("/", authenticate, getCart);
router.post("/add", authenticate, addToCart);
router.put("/item/:itemId", authenticate, updateCartItem);
router.delete("/item/:itemId", authenticate, removeCartItem);
router.delete("/clear", authenticate, clearCart);

export default router;
