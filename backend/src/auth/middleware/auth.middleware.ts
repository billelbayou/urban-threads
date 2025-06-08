import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = verifyToken(token);
    (req as any).userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};
