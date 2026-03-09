"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Wishlist } from "@/types/wishlist";
import { removeFromWishlistAction } from "@/services/wishlistActions";

interface WishlistClientProps {
  initialWishlist: Wishlist | null;
}

export default function WishlistClient({
  initialWishlist,
}: WishlistClientProps) {
  const [wishlist, setWishlist] = useState<Wishlist | null>(initialWishlist);
  const [state, formAction, isPending] = useActionState(
    removeFromWishlistAction,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Removed from wishlist");
      if (state.data) {
        setWishlist(state.data);
      }
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  const products = wishlist?.products || [];

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
        <Link
          href="/"
          className="inline-block bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Product Image */}
          <Link href={`/product/${product.id}`}>
            <div className="relative aspect-square bg-gray-100">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
          </Link>

          {/* Product Info */}
          <div className="p-4">
            <Link href={`/product/${product.id}`}>
              <h3 className="font-medium text-gray-900 hover:text-gray-600 transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              ${product.price.toFixed(2)}
            </p>

            {/* Remove Button */}
            <form action={formAction} className="mt-3">
              <input type="hidden" name="productId" value={product.id} />
              <button
                type="submit"
                disabled={isPending}
                className="w-full text-sm text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
              >
                {isPending ? "Removing..." : "Remove"}
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
