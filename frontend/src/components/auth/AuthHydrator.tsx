"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "@/types/types";

export default function AuthHydrator({ user }: { user: User | null }) {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return null;
}