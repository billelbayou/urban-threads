import { Order } from "./order";
import { Cart } from "./cart";
import { Wishlist } from "./wishlist";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Usually omitted from API responses
  role: "ADMIN" | "CLIENT";

  phone?: string;
  avatarUrl?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;

  createdAt: string;
  updatedAt: string;

  // relations (optional based on API)
  cart?: Cart;
  wishlist?: Wishlist;
  orders?: Order[];
}