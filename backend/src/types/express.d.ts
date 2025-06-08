import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, "password">; // Exclude password field from the user type
    }
  }
}
