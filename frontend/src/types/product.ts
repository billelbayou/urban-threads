import { Category } from "./category";

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
  infoSections: InfoSection[];
  tags?: string[];

  wishlistId?: string; // nullable in schema

  createdAt: string;
  updatedAt: string;

  // orderItems?: OrderItem[];
  // cartItems?: CartItem[];
}

export interface ProductStats {
  id: string;
  productId: string;
  views: number;
  soldQuantity: number;
}

export interface FormErrors {
  name?: string;
  categoryId?: string;
  price?: string;
  description?: string;
  images?: string;
}

export interface UploadedImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  url: string;
  thumbnail_url: string;
}

export interface Tag {
  id: string;
  label: string;
}

export interface InfoSection {
  title: string;
  content: string;
}
