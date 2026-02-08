import { Order } from "./order";
import { Cart } from "./cart";
import { Wishlist } from "./wishlist";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Usually omitted from API responses
  role: "ADMIN" | "CLIENT";

  // Personal info (optional, filled after registration)
  phone?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;

  // Shipping address (optional, filled after registration)
  country?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  streetAddress?: string | null;
  apartment?: string | null;

  createdAt: string;
  updatedAt: string;

  // Relations (optional based on API)
  cart?: Cart;
  wishlist?: Wishlist;
  orders?: Order[];
}
