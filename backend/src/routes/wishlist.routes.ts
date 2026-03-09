import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/wishlist - Get user's wishlist
router.get("/", getWishlist);

// POST /api/wishlist/add - Add product to wishlist
router.post("/add", addToWishlist);

// DELETE /api/wishlist/:productId - Remove product from wishlist
router.delete("/:productId", removeFromWishlist);

export default router;
