import { Router } from "express";
import {
  register,
  login,
  logout,
  getUserInfos,
  updatePersonalInfo,
  updateShippingAddress,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, getUserInfos);
router.put("/me/personal-info", authenticate, updatePersonalInfo);
router.put("/me/shipping-address", authenticate, updateShippingAddress);

export default router;
