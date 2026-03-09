import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  register,
  login,
  logout,
  getUserInfos,
  updatePersonalInfo,
  updateShippingAddress,
  getAllUsers,
  deleteAccount,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// Rate limiter for auth endpoints (login/register)
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: "Too many attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/logout", logout);
router.get("/me", authenticate, getUserInfos);
router.put("/me/personal-info", authenticate, updatePersonalInfo);
router.put("/me/shipping-address", authenticate, updateShippingAddress);
router.delete("/account", authenticate, deleteAccount);
router.get("/users", authenticate, getAllUsers);

export default router;
