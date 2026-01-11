"use client";

import { loginAction, registerAction } from "@/services/authActions";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function registerForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.data.message);
      router.refresh();
      router.push("/login");
    }
  }, [state, router]);
  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="registerNameInput"
        >
          Name
        </label>
        <input
          id="registerNameInput"
          name="name" // Use 'name' attribute for FormData
          type="text"
          autoComplete="text"
          placeholder="Your Name"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black transition-all"
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="registerEmailInput"
        >
          Email
        </label>
        <input
          id="registerEmailInput"
          name="email" // Use 'name' attribute for FormData
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black transition-all"
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="registerPasswordInput"
        >
          Password
        </label>
        <input
          id="registerPasswordInput"
          name="password" // Use 'name' attribute for FormData
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black transition-all"
        />
      </div>

      {/* Display errors returned from the Server Action */}
      {state && (
        <p className="text-sm text-red-500 text-center">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-all disabled:bg-gray-400"
      >
        {isPending ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
