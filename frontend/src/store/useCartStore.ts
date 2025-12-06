import api from "@/lib/axios";
import { create } from "zustand";


interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    images: { url: string }[];
  };
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  toggleCart: () => void;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isOpen: false,

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  fetchCart: async () => {
    const res = await api.get("/api/cart", { withCredentials: true });
    set({ items: res.data.items });
  },

  addToCart: async (productId, quantity) => {
    await api.post(
      "/api/cart/add",
      { productId, quantity },
      { withCredentials: true }
    );
    const res = await api.get("/api/cart", { withCredentials: true });
    set({ items: res.data.items });
  },

  removeFromCart: async (itemId) => {
    await api.delete(`/api/cart/item/${itemId}`, {
      withCredentials: true,
    });
    const res = await api.get("/api/cart", { withCredentials: true });
    set({ items: res.data.items });
  },
}));
