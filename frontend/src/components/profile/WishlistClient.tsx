"use client";

import { useActionState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useWishlistStore } from "@/store/useWishlistStore";
import { removeFromWishlistAction } from "@/services/wishlistActions";

export default function WishlistClient() {
  const products = useWishlistStore((s) => s.products);
  const setProducts = useWishlistStore((s) => s.setProducts);
  const [state, formAction, isPending] = useActionState(
    removeFromWishlistAction,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Removed from wishlist");
      if (state.data) setProducts(state.data.products);
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-[0_1px_6px_0_rgba(0,0,0,0.04)] sm:p-12">
        <p className="mb-4 text-gray-500">Your wishlist is empty.</p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-gray-900 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <div
          key={product.id}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_1px_6px_0_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md"
        >
          <Link href={`/product/${product.id}`}>
            <div className="relative aspect-square bg-gray-100">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={
                    product.images[0].mobile?.url ||
                    product.images[0].thumbnail?.url ||
                    ""
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
          </Link>

          <div className="p-4">
            <Link href={`/product/${product.id}`}>
              <h3 className="line-clamp-2 font-medium text-gray-900 transition-colors hover:text-gray-600">
                {product.name}
              </h3>
            </Link>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              ${Number(product.price).toFixed(2)}
            </p>

            <form action={formAction} className="mt-3">
              <input type="hidden" name="productId" value={product.id} />
              <button
                type="submit"
                disabled={isPending}
                className="w-full cursor-pointer rounded-xl border-2 border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:border-red-600 hover:bg-red-50 disabled:opacity-50"
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
