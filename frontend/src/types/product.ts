import { Category } from "./category";

export interface ImageVariant {
  url: string;
  path: string;
}

export interface ProductImage {
  thumbnail?: ImageVariant;
  mobile?: ImageVariant;
  desktop?: ImageVariant;
  original?: ImageVariant;
  // Fallback for old data
  url?: string;
  path?: string;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;

  categoryId: string;
  category?: Category;

  images: ProductImage[];
  productStats?: ProductStats[];
  infoSections: InfoSection[];
  tags: string[];

  wishlistId?: string; // nullable in schema

  createdAt?: string;
  updatedAt?: string;

  // orderItems?: OrderItem[];
  // cartItems?: CartItem[];
}

export interface ProductStats {
  id: string;
  productId: string;
  views: number;
  soldQuantity: number;
}
export interface UploadedImage extends ProductImage {}

export interface Tag {
  id: string;
  label: string;
}

export interface InfoSection {
  title: string;
  content: string;
}
