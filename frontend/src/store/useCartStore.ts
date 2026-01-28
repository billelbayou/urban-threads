import { Cart } from "@/types/cart";
import { create } from "zustand";

interface CartState {
  cart: Cart | null;
  isOpen: boolean;

  // UI Actions
  toggleCart: () => void;
  openCart: () => void;

  // State Sync Actions (Called AFTER Server Actions succeed)
  setCart: (cart: Cart | null) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isOpen: false,

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),

  // FIX: Check if we are receiving the full cart object or just the items array
  setCart: (cart: Cart | null) =>
    set({ cart: cart ? { ...cart, items: cart.items ?? [] } : null }),

  clearCart: () => set({ cart: null }),
}));
