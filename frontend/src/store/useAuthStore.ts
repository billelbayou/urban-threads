// store/useAuthStore.ts
import { create } from "zustand";
import { User } from "@/types/types";

type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
  logoutStore: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logoutStore: () => set({ user: null }),
}));
