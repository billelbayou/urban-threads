import { Request as ExpressRequest, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../generated/prisma/enums.js";
import config from "../config/config.js";
import { UnauthorizedError, ForbiddenError } from "../errors/index.js";

export interface JwtPayload {
  id: string;
  role: Role;
}

export interface AuthRequest extends ExpressRequest {
  user?: JwtPayload;
}

export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;
  if (!token) {
    throw new UnauthorizedError("Not authenticated");
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    throw new UnauthorizedError("Invalid token");
  }
};

export const authorize =
  (roles: Role[]) => (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError("Not authenticated");
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError();
    }

    next();
  };
