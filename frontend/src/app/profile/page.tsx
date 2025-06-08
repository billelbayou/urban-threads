"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, initialized } = useAuthStore();

  useEffect(() => {
    if (initialized && user === null && !loading) {
      router.push("/login");
    }
  }, [initialized, user, loading, router]);
  console.log(user)

  if (!initialized || loading) {
    return (
      <div className="text-center mt-10 text-gray-600">Loading profile...</div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-10 text-gray-600">Loading profile...</div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
      <p>
        <span className="font-semibold">Email:</span> {user.email}
      </p>
    </div>
  );
}
