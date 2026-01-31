// store/useAuthStore.ts
import { User } from "@/types/user";
import { create } from "zustand";

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
