// components/AuthHydrator.tsx
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthHydrator() {
  const { getCurrentUser } = useAuthStore();

  useEffect(() => {
    getCurrentUser(); // run on app load
  }, [getCurrentUser]);

  return null; // it doesn't render anything
}
