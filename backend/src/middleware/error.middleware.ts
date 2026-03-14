import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  console.error(`[Error Handler] ${err.message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  res.json({
    error: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
