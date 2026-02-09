import { Product } from "./product";
import { User } from "./user";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;

  quantity: number;
  price: number;
  size: string;

  product: Product;
}

export interface Order {
  id: string;
  userId: string;

  total: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELED";

  items: OrderItem[];

  createdAt: string;
  updatedAt: string;

  user?: User;
}
