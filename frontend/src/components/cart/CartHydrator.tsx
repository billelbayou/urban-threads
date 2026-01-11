"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";

export default function CartHydrator({ cart }: { cart: any }) {
  const setCart = useCartStore((s) => s.setCart);

  useEffect(() => {
    setCart(cart);
  }, [cart, setCart]);

  return null;
}
 