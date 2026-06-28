"use client";

import { useEffect } from "react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { Wishlist } from "@/types/wishlist";

export default function WishlistHydrator({
  wishlist,
}: {
  wishlist: Wishlist | null;
}) {
  const setProducts = useWishlistStore((s) => s.setProducts);

  useEffect(() => {
    setProducts(wishlist?.products ?? []);
  }, [wishlist, setProducts]);

  return null;
}
