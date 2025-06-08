import express from "express";
import {
  loginHandler,
  logoutHandler,
  registerHandler,
  getCurrentUserHandler,
} from "../auth/controllers/auth.controller";
import { authenticateUser } from "../auth/middleware/auth.middleware";

const router = express.Router();

router.post("/login", loginHandler);
router.post("/register", registerHandler);
router.post("/logout", logoutHandler);
router.get("/me", authenticateUser, getCurrentUserHandler);

export default router;
