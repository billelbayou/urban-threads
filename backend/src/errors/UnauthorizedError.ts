import { AppError } from "./AppError.js";

export class UnauthorizedError extends AppError {
  constructor(message = "Not authenticated") {
    super(message, 401);
  }
}
