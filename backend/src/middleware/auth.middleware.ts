import { Request as ExpressRequest, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../generated/prisma/enums.js";

export interface JwtPayload {
  id: string;
  role: Role;
}

export interface AuthRequest extends ExpressRequest {
  user?: JwtPayload;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const authorize =
  (roles: Role[]) => (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    // Strict role check
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    next();
  };
