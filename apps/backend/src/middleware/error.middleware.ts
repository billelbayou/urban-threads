import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/index.js";
import { sendError } from "../utils/response.js";

export const errorHandler = (
  err: AppError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  console.error(`[Error Handler] ${err.message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  const errorMessage = err.message || "Internal Server Error";
  const details =
    err instanceof AppError && err.details
      ? err.details
      : process.env.NODE_ENV === "production"
        ? undefined
        : err.stack;

  sendError(res, errorMessage, statusCode, details);
};

export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
