export type Role = "ADMIN" | "CLIENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  createdAt: string; // ISO date string
  updatedAt: string;

  wishlist: WishlistItem[];
  orders: Order[];
  cart?: Cart;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string[];
  categoryId: string;
  createdAt: string;
  updatedAt: string;

  category: Category;
  cartItems: CartItem[];
  orderItems: OrderItem[];
  wishlistItems: WishlistItem[];
}
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;

  user: User;
  product: Product;
}

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED";

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: OrderStatus;
  createdAt: string;

  user: User;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;

  order: Order;
  product: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];

  user: User;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;

  cart: Cart;
  product: Product;
}

export interface DashboardStats {
  totalUsers?: number;
  totalProducts?: number;
  totalOrders?: number;
  recentOrders?: Order[];
}
