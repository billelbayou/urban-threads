"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "sonner";
import {
  addToWishlistAction,
  removeFromWishlistAction,
} from "@/services/wishlistActions";
import { Product } from "@/types/product";

export default function WishlistButton({ product }: { product: Product }) {
  const [isInWishlist, setIsInWishlist] = useState(
    product.wishlistId ? true : false,
  );
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Server action state for add
  const [addState, addAction, addIsPending] = useActionState(
    addToWishlistAction,
    null,
  );

  // Server action state for remove
  const [removeState, removeAction, removeIsPending] = useActionState(
    removeFromWishlistAction,
    null,
  );

  const isActionPending = addIsPending || removeIsPending;

  useEffect(() => {
    if (addState?.success) {
      setIsInWishlist(true);
      toast.success("Added to wishlist!", { position: "bottom-left" });
    }
    if (addState?.error) toast.error(addState.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addState]);

  useEffect(() => {
    if (removeState?.success) {
      setIsInWishlist(false);
      toast.success("Removed from wishlist!", { position: "bottom-left" });
    }
    if (removeState?.error) toast.error(removeState.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removeState]);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!user) {
      toast.info("Please sign in to add items to your wishlist");
      router.push("/login");
      return;
    }

    const formData = new FormData();
    formData.append("productId", product.id!);

    if (isInWishlist) {
      startTransition(() => {
        removeAction(formData);
      });
    } else {
      startTransition(() => {
        addAction(formData);
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleWishlistClick}
      disabled={isPending || isActionPending}
      className={`border border-black px-4 py-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-center disabled:opacity-50 ${
        isInWishlist ? "text-red-500 border-red-500" : ""
      }`}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isInWishlist ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
}
