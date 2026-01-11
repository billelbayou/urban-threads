// ====================
// ENUMS
// ====================

export enum Role {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
}

export enum Gender {
  MEN = "MEN",
  WOMEN = "WOMEN",
  UNISEX = "UNISEX",
}

export enum OrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  SHIPPED = "SHIPPED",
  CANCELED = "CANCELED",
}

// ====================
// USER
// ====================

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Usually omitted from API responses
  role: Role;

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

// ====================
// CATEGORY
// ====================

export interface Category {
  id: string;
  name: string;
  products?: Product[]; // Optional to avoid nested queries
}

// ====================
// PRODUCT STATS
// ====================

export interface ProductStats {
  id: string;
  productId: string;
  views: number;
  soldQuantity: number;
}

// ====================
// PRODUCT
// ====================

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;

  categoryId: string;
  category: Category;

  images: { url: string; public_id: string }[];
  productStats?: ProductStats[];
  infoSections: { title: string; content: string }[];

  wishlistId?: string; // nullable in schema

  createdAt: string;
  updatedAt: string;

  // orderItems?: OrderItem[];
  // cartItems?: CartItem[];
}

// ====================
// WISHLIST
// ====================

export interface Wishlist {
  id: string;
  userId: string;
  products: Product[];
}

// ====================
// ORDER ITEM
// ====================

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;

  quantity: number;
  price: number;

  product?: Product;
}

// ====================
// ORDER
// ====================

export interface Order {
  id: string;
  userId: string;

  total: number;
  status: OrderStatus;

  items: OrderItem[];

  createdAt: string;
  updatedAt: string;

  // user?: User;
}

// ====================
// CART ITEM
// ====================

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

  // user?: User;
}

// This represents the nested structure used by the UI
export type CategoryWithChildren = Category & {
  children: CategoryWithChildren[];
};

// Props for the individual Node component
export interface CategoryNodeProps {
  node: CategoryWithChildren;
  onAddSub: (parentId: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}
