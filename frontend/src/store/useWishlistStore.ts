import { Product } from "@/types/product";
import { create } from "zustand";

interface WishlistState {
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  addProduct: (product) =>
    set((state) => ({
      products: state.products.some((p) => p.id === product.id)
        ? state.products
        : [...state.products, product],
    })),
  removeProduct: (productId) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== productId),
    })),
  clearWishlist: () => set({ products: [] }),
}));
