import jwt from "jsonwebtoken";
import config from "../../config/config";

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, config.JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): { id: string } => {
  return jwt.verify(token, config.JWT_SECRET) as { id: string };
};
