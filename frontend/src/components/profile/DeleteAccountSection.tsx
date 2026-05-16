"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteAccountAction } from "@/services/authActions";

export default function DeleteAccountSection() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAccountAction(null, new FormData());
      if (result.success) {
        toast.success("Account deleted successfully");
        router.push("/");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete account");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="mb-5 rounded-2xl border border-red-200 bg-white p-8 shadow-[0_1px_6px_0_rgba(0,0,0,0.04)]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-gray-900">
            Delete Account
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Permanently delete your account and all associated data
          </p>
        </div>
      </div>

      {showConfirm ? (
        <div className="space-y-4 rounded-xl bg-red-50 p-5">
          <p className="text-sm font-medium text-red-800">
            Are you sure? This action cannot be undone. All your data including
            orders, cart items, and wishlist will be permanently deleted.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="cursor-pointer rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className="cursor-pointer rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="cursor-pointer rounded-xl border-2 border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:border-red-600 hover:bg-red-50"
        >
          Delete Account
        </button>
      )}
    </div>
  );
}
