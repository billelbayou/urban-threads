"use client";

import { registerAction } from "@/services/authActions";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function RegisterForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      router.refresh();
      router.push("/login");
    }
  }, [state, router]);

  // Helper for rendering field errors
  const renderError = (msg?: string) =>
    msg ? (
      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>{msg}</span>
      </p>
    ) : null;

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="registerfNameInput"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          First Name
        </label>
        <input
          id="registerfNameInput"
          name="firstName"
          type="text"
          autoComplete="given-name"
          placeholder="Your First Name"
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-black focus:border-black transition-all ${
            state?.fieldErrors?.firstName ? "border-red-500" : "border-gray-300"
          }`}
        />
        {renderError(state?.fieldErrors?.firstName as string | undefined)}
      </div>
      {/* Name */}
      <div>
        <label
          htmlFor="registerlNameInput"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Last Name
        </label>
        <input
          id="registerlNameInput"
          name="lastName"
          type="text"
          autoComplete="name"
          placeholder="Your Last Name"
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-black focus:border-black transition-all ${
            state?.fieldErrors?.lastName ? "border-red-500" : "border-gray-300"
          }`}
        />
        {renderError(state?.fieldErrors?.lastName as string | undefined)}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="registerEmailInput"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          id="registerEmailInput"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-black focus:border-black transition-all ${
            state?.fieldErrors?.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {renderError(state?.fieldErrors?.email as string | undefined)}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="registerPasswordInput"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          id="registerPasswordInput"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-black focus:border-black transition-all ${
            state?.fieldErrors?.password ? "border-red-500" : "border-gray-300"
          }`}
        />
        {renderError(state?.fieldErrors?.password as string | undefined)}
      </div>

      {/* General server error message */}
      {state?.message && !state.success && (
        <p className="text-sm text-red-500 text-center">{state.message}</p>
      )}

      {/* Submit Button */}
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
