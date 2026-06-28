"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Cart } from "@/types/cart";

export default function CartHydrator({ cart }: { cart: Cart | null }) {
  const setCart = useCartStore((s) => s.setCart);

  useEffect(() => {
    setCart(cart);
  }, [cart, setCart]);

  return null;
}
