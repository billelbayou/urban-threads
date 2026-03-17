"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";
import { LogOut, Loader2 } from "lucide-react";
import { logoutAction } from "@/services/authActions";
import { useAuthStore } from "@/store/useAuthStore";

export default function LogoutButton() {
  const [state, dispatch, isPending] = useActionState(logoutAction, null);
  const { logoutStore } = useAuthStore();
  const router = useRouter();

  // Handle logout result
  useEffect(() => {
    if (state?.success) {
      toast.success(state.data?.message || "Logged out successfully");
      logoutStore();
      router.push("/login");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, logoutStore, router]);

  return (
    <form action={dispatch}>
      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={isPending ? "Logging out..." : "Logout"}
      >
        {isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <LogOut size={16} />
        )}
        <span>{isPending ? "Logging out..." : "Logout"}</span>
      </button>
    </form>
  );
}
