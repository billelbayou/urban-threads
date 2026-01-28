import { Product } from "./product";
import { User } from "./user";

export interface CartItem {
  id: string;
  cartId: string;

  productId: string;
  product: Product;

  quantity: number;
  size: string;
}

// ====================
// CART
// ====================

export interface Cart {
  id: string;
  userId: string;

  items: CartItem[];

  createdAt: string;
  updatedAt: string;

  user?: User;
}
