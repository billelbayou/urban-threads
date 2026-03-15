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
import { validate } from "../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  updatePersonalInfoSchema,
  updateShippingAddressSchema,
} from "../schemas/index.js";

const router = Router();

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authRateLimiter, validate(registerSchema), register);
router.post("/login", authRateLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", authenticate, getUserInfos);
router.put("/me/personal-info", authenticate, validate(updatePersonalInfoSchema), updatePersonalInfo);
router.put("/me/shipping-address", authenticate, validate(updateShippingAddressSchema), updateShippingAddress);
router.delete("/account", authenticate, deleteAccount);
router.get("/users", authenticate, getAllUsers);

export default router;
