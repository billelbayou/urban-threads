import { Product } from "./types";

export const products1: Product[] = [
  {
    id: "p1",
    name: "Street King Hoodie",
    description:
      "Oversized streetwear hoodie with bold prints and warm fleece lining.",
    price: 69.99,
    category: {
      id: "c1",
      name: "Hoodies",
      description: "High-quality oversized hoodies for a relaxed street look.",
      products: [],
    },
    images: [
      "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?auto=format&fit=crop&w=600&h=800&q=80",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&h=800&q=80",
    ],
    variants: [
      { id: "v1", name: "S", price: 69.99, stock: 8 },
      { id: "v2", name: "M", price: 69.99, stock: 4 },
      { id: "v3", name: "L", price: 69.99, stock: 0 },
    ],
  },
  {
    id: "p2",
    name: "Graffiti Joggers",
    description:
      "Street-art inspired jogger pants with tapered legs and utility pockets.",
    price: 59.99,
    category: {
      id: "c2",
      name: "Bottoms",
      description: "Urban pants and joggers built for comfort and edge.",
      products: [],
    },
    images: [
      "https://images.unsplash.com/photo-1527181260677-e6943cf5738f?auto=format&fit=crop&w=600&h=800&q=80",
    ],
    variants: [
      { id: "v4", name: "S", price: 59.99, stock: 6 },
      { id: "v5", name: "M", price: 59.99, stock: 2 },
    ],
  },
  {
    id: "p3",
    name: "Noir Graphic Tee",
    description: "Black cotton tee with a futuristic streetwear logo print.",
    price: 34.99,
    category: {
      id: "c3",
      name: "T-Shirts",
      description: "Essential urban t-shirts with attitude and design.",
      products: [],
    },
    images: [
      "https://images.unsplash.com/photo-1618453292507-4959ece6429e?auto=format&fit=crop&w=600&h=800&q=80",
    ],
    variants: [
      { id: "v6", name: "M", price: 34.99, stock: 12 },
      { id: "v7", name: "L", price: 34.99, stock: 6 },
    ],
  },
  {
    id: "p4",
    name: "Tactical Crossbody Bag",
    description:
      "Compact and functional bag with tactical buckles and sleek design.",
    price: 45.0,
    category: {
      id: "c4",
      name: "Accessories",
      description: "Street accessories to complete your daily drip.",
      products: [],
    },
    images: [
      "https://images.unsplash.com/photo-1709898838174-83c3e155654c?auto=format&fit=crop&w=600&h=800&q=80",
    ],
    variants: [{ id: "v8", name: "One Size", price: 45.0, stock: 10 }],
  },
];

export const products2: Product[] = [
  {
    id: "p5",
    name: "Retro Wave Sneakers",
    description:
      "Chunky sneakers with layered panels and street-style swagger.",
    price: 89.99,
    category: {
      id: "c5",
      name: "Footwear",
      description: "Statement sneakers for streetwear connoisseurs.",
      products: [],
    },
    images: [
      "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?auto=format&fit=crop&w=600&h=800&q=80",
    ],
    variants: [
      { id: "v9", name: "US 8", price: 89.99, stock: 3 },
      { id: "v10", name: "US 9", price: 89.99, stock: 5 },
    ],
  },
  {
    id: "p6",
    name: "Midnight Cargo Pants",
    description:
      "Black cargo pants with an adjustable fit and side zip pockets.",
    price: 64.99,
    category: {
      id: "c2",
      name: "Bottoms",
      description: "Urban pants and joggers built for comfort and edge.",
      products: [],
    },
    images: [
      "https://images.unsplash.com/photo-1527181260677-e6943cf5738f?auto=format&fit=crop&w=600&h=800&q=80",
    ],
    variants: [
      { id: "v11", name: "M", price: 64.99, stock: 7 },
      { id: "v12", name: "L", price: 64.99, stock: 2 },
    ],
  },
  {
    id: "p7",
    name: "Skull Logo Snapback",
    description:
      "Black snapback cap with embroidered skull logo and flat brim.",
    price: 29.99,
    category: {
      id: "c4",
      name: "Accessories",
      description: "Street accessories to complete your daily drip.",
      products: [],
    },
    images: [
      "https://images.unsplash.com/photo-1709898838174-83c3e155654c?auto=format&fit=crop&w=600&h=800&q=80",
    ],
    variants: [{ id: "v13", name: "One Size", price: 29.99, stock: 14 }],
  },
  {
    id: "p8",
    name: "Distressed Denim Jacket",
    description: "Washed denim jacket with raw edges and graphic back print.",
    price: 79.99,
    category: {
      id: "c6",
      name: "Jackets",
      description:
        "Layer up with our collection of standout streetwear jackets.",
      products: [],
    },
    images: [
      "https://images.unsplash.com/photo-1618453292507-4959ece6429e?auto=format&fit=crop&w=600&h=800&q=80",
    ],
    variants: [
      { id: "v14", name: "M", price: 79.99, stock: 5 },
      { id: "v15", name: "L", price: 79.99, stock: 1 },
    ],
  },
];

export interface Products {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  images: string[];
  sizes: string[];
}
export const products: Products[] = [
  {
    id: "p1",
    name: "Dark Blue A.Design Jacket",
    description:
      "Tailored to a slim fit with a natural shoulder, half canvas and patch pockets.",
    price: 779,
    brand: "A.Design",
    category: "Jackets",
    images: [
      "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?auto=format&fit=crop&w=600&h=800&q=80",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&h=800&q=80",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "p2",
    name: "Minimalist White Hoodie",
    description: "Soft cotton hoodie perfect for casual wear and layering.",
    price: 129,
    brand: "Modern Basics",
    category: "Hoodies",
    images: [
      "/mock/hoodie1-front.jpg",
      "/mock/hoodie1-back.jpg",
      "/mock/hoodie1-detail.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "p3",
    name: "Slim Fit Black T-Shirt",
    description: "Breathable, durable and ideal for everyday essentials.",
    price: 49,
    brand: "CoreWear",
    category: "T-Shirts",
    images: [
      "/mock/tshirt1-front.jpg",
      "/mock/tshirt1-back.jpg",
      "/mock/tshirt1-closeup.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "p4",
    name: "Olive Green Cargo Pants",
    description:
      "Durable utility pants with side pockets and adjustable waistband.",
    price: 189,
    brand: "Urban Util",
    category: "Pants",
    images: [
      "/mock/pants1-front.jpg",
      "/mock/pants1-side.jpg",
      "/mock/pants1-back.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "p5",
    name: "Beige Wool Overcoat",
    description: "Timeless overcoat made from premium circular wool fabric.",
    price: 999,
    brand: "A.Design",
    category: "Coats",
    images: [
      "/mock/coat1-front.jpg",
      "/mock/coat1-open.jpg",
      "/mock/coat1-back.jpg",
    ],
    sizes: ["M", "L", "XL"],
  },
];
