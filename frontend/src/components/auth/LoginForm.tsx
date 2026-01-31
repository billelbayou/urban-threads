"use client";

import { loginAction } from "@/services/authActions";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.data.message);
      setUser(state.data.user);
      router.refresh();
      if (state.data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-5">
      {/* Email Field */}
      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="loginEmailInput"
        >
          Email
        </label>
        <input
          id="loginEmailInput"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black transition-all"
        />
        {state?.fieldErrors?.email && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {state.fieldErrors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="loginPasswordInput"
        >
          Password
        </label>
        <input
          id="loginPasswordInput"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black transition-all"
        />
        {state?.fieldErrors?.password && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {state.fieldErrors.password}
          </p>
        )}
      </div>

      {/* Global Server Action Error */}
      {state && state.message && !state.fieldErrors && (
        <p className="text-sm text-red-500 text-center">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-all disabled:bg-gray-400"
      >
        {isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
