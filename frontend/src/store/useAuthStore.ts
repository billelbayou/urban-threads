import { create } from "zustand";
import axios from "@/lib/axios";
import { User } from "@/lib/types";

type AuthState = {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true });
    try {
      await axios.post("/auth/login", { email, password });
      await getCurrentUser();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Login failed" });
    } finally {
      set({ loading: false });
    }
  },

  register: async (name, email, password) => {
    set({ loading: true });
    try {
      await axios.post("/auth/register", { name, email, password });
      await getCurrentUser();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Register failed" });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await axios.post("/auth/logout");
    set({ user: null });
  },

  getCurrentUser: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/auth/me");
      set({ user: res.data, initialized: true });
    } catch {
      set({ user: null, initialized: true });
    } finally {
      set({ loading: false });
    }
  },
}));

const getCurrentUser = useAuthStore.getState().getCurrentUser;
