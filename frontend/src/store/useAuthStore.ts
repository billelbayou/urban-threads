// @/store/useAuthStore.ts
import { create } from "zustand";
import axios from "@/lib/axios";
import { User } from "@/lib/types";
import { toast } from "sonner";

type AuthState = {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  initialized: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await axios.post("api/auth/login", { email, password });
      await get().getCurrentUser();
      toast.success("Login successful");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed";
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw err; // Re-throw for form handling
    } finally {
      set({ loading: false });
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      await axios.post("api/auth/register", { name, email, password });
      await get().getCurrentUser();
      toast.success("Registration successful");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw err; // Re-throw for form handling
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await axios.post("api/auth/logout");
      set({ user: null });
      toast.success("Logged out successfully");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Logout failed";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },

  getCurrentUser: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("api/auth/me");
      console.log("Raw API response:", res.data); // Debug log

      // Extract the user object from the response
      const userData = res.data.user || res.data;
      console.log("Extracted user data:", userData); // Debug log

      set({ user: userData, initialized: true });
    } catch (err) {
      console.log("Error fetching user:", err);
      set({ user: null, initialized: true });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));