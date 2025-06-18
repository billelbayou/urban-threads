import { Category, Product } from "./types";

export const categories: Category[] = [
  {
    id: "cat_1",
    name: "Electronics",
    products: [],
  },
  {
    id: "cat_2",
    name: "Books",
    products: [],
  },
];

export const exampleProducts: Product[] = [
  {
    id: "prod_1",
    name: "Wireless Headphones",
    slug: "wireless-headphones",
    description: "High-quality wireless headphones with noise cancellation.",
    price: 129.99,
    stock: 50,
    imageUrl: "https://example.com/images/headphones.jpg",
    categoryId: "cat_1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    category: categories[0], // Electronics
    cartItems: [],
    orderItems: [],
    wishlistItems: [],
  },
  {
    id: "prod_2",
    name: "Learning TypeScript",
    slug: "learning-typescript",
    description: "A beginner-friendly book to learn TypeScript step by step.",
    price: 39.99,
    stock: 100,
    imageUrl: "https://example.com/images/typescript-book.jpg",
    categoryId: "cat_2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    category: categories[1], // Books
    cartItems: [],
    orderItems: [],
    wishlistItems: [],
  },
  {
    id: "prod_3",
    name: "4K Ultra HD Monitor",
    slug: "4k-ultra-hd-monitor",
    description:
      "Crystal-clear 27-inch 4K monitor for productivity and gaming.",
    price: 349.99,
    stock: 25,
    imageUrl: "https://example.com/images/4k-monitor.jpg",
    categoryId: "cat_1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    category: categories[0], // Electronics
    cartItems: [],
    orderItems: [],
    wishlistItems: [],
  },
];
