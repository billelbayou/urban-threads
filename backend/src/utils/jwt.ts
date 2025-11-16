import jwt from "jsonwebtoken";
import config from "../config/config";

export const generateToken = (userId: string, userRole: string): string => {
  return jwt.sign({ id: userId, role: userRole }, config.JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): { id: string } => {
  return jwt.verify(token, config.JWT_SECRET) as { id: string };
};
