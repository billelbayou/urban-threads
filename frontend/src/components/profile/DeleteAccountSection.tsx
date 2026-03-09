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

  if (showConfirm) {
    return (
      <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Confirm Account Deletion
        </h3>
        <p className="text-red-600 mb-4">
          Are you sure you want to delete your account? This action cannot be
          undone. All your data including orders, cart items, and wishlist will
          be permanently deleted.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-6 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Manage Account
      </h3>
      <button
        onClick={() => setShowConfirm(true)}
        className="px-8 py-3 border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-colors rounded"
      >
        Delete Account
      </button>
    </div>
  );
}
