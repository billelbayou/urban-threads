import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { addToWishlistSchema } from "../schemas/index.js";

const router = Router();

const wishlistRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: "Too many wishlist operations, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(authenticate);

router.get("/", getWishlist);

router.post(
  "/add",
  wishlistRateLimiter,
  validate(addToWishlistSchema),
  addToWishlist,
);

router.delete("/:productId", wishlistRateLimiter, removeFromWishlist);

export default router;
