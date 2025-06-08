export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  images: string[]; // image URLs
  variants: Variant[];
}
export interface Variant {
  id: string;
  name: string;
  price: number;
  stock: number;
}
export interface Category {
  id: string;
  name: string;
  description: string;
  products: Product[];
}
