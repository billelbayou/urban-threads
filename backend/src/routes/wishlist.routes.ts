import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import { validate } from "../middleware/validate.js";
import { AddToWishlistSchema } from "../utils/validation.js";

const router = Router();

const wishlistRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: "Too many wishlist operations, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// All routes require authentication
router.use(authenticate);

// GET /api/wishlist - Get user's wishlist
router.get("/", getWishlist);

// POST /api/wishlist/add - Add product to wishlist
router.post("/add", wishlistRateLimiter, validate(AddToWishlistSchema), addToWishlist);

// DELETE /api/wishlist/:productId - Remove product from wishlist
router.delete("/:productId", wishlistRateLimiter, removeFromWishlist);

export default router;
