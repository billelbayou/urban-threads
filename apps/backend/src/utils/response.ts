import { Response } from "express";

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface SuccessResponse<T = unknown> {
  success: true;
  data?: T;
  message?: string;
  pagination?: PaginationInfo;
}

interface ErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode = 200,
  pagination?: PaginationInfo,
): void {
  const body: SuccessResponse<T> = { success: true };
  if (data !== undefined) body.data = data;
  if (message) body.message = message;
  if (pagination) body.pagination = pagination;
  res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  error: string,
  statusCode = 500,
  details?: unknown,
): void {
  const body: ErrorResponse = { success: false, error };
  if (details !== undefined) body.details = details;
  res.status(statusCode).json(body);
}
