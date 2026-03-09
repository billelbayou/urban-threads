"use client";

import { addToCartAction } from "@/services/cartActions";
import { useAuthStore } from "@/store/useAuthStore";
import { AnimatePresence, motion } from "framer-motion";
import { useActionState, useEffect, useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { Product } from "@/types/product";
import WishlistButton from "./WishlistButton";

const sizes = ["XS", "S", "M", "L", "XL"];

export default function AddToCartForm({ product }: { product: Product }) {
  const user = useAuthStore((state) => state.user);
  const setCart = useCartStore((state) => state.setCart);
  const openCart = useCartStore((state) => state.openCart);
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const [cartState, cartFormAction, cartIsPending] = useActionState(
    addToCartAction,
    null,
  );
  useEffect(() => {
    if (cartState?.success) {
      toast.success("Added to cart!", { position: "bottom-left" });
      setCart(cartState.data);
      openCart();
    }
    if (cartState?.error) toast.error(cartState.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartState]);

  // Handler for unauthenticated clicks
  const handleAuthRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info("Please sign in to add items to your cart");
    router.push("/login");
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (!selectedSize) {
      e.preventDefault();
      setSizeError(true);
      toast.error("Please select a size");
    }
  };

  return (
    <>
      <form action={cartFormAction} onSubmit={handleSubmit} className="mt-4">
        <input type="hidden" name="productId" value={product.id} />
        <input type="hidden" name="quantity" value={quantity} />
        <input type="hidden" name="size" value={selectedSize || ""} />

        {/* Size Selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size
          </label>
          <button
            type="button"
            onClick={() => {
              setSizeDropdownOpen((prev) => !prev);
              setSizeError(false);
            }}
            className={`w-full border py-3 px-4 rounded-lg text-left flex justify-between items-center text-sm sm:text-base bg-white ${
              sizeError
                ? "border-red-500 ring-1 ring-red-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <span className={selectedSize ? "text-gray-900" : "text-gray-500"}>
              {selectedSize || "Select Size"}
            </span>
            {sizeDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          <AnimatePresence>
            {sizeDropdownOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-lg"
              >
                {sizes.map((size) => (
                  <li
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeDropdownOpen(false);
                    }}
                    className="px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                  >
                    <span>{size}</span>
                    {selectedSize === size && (
                      <span className="text-green-500">✓</span>
                    )}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 mt-6">
          <label className="text-sm font-medium text-gray-700">Quantity</label>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-4 py-2 text-lg hover:bg-gray-100 transition rounded-l-lg"
            >
              -
            </button>
            <span className="px-6 py-2 text-sm font-medium min-w-12 text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="px-4 py-2 text-lg hover:bg-gray-100 transition rounded-r-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            disabled={cartIsPending}
            type={user ? "submit" : "button"}
            onClick={!user ? handleAuthRedirect : undefined}
            className="flex-1 cursor-pointer bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-900 transition text-sm sm:text-base disabled:opacity-50 font-medium"
          >
            {cartIsPending
              ? "Adding..."
              : user
                ? "Add to Cart"
                : "Sign in to Buy"}
          </button>
          <WishlistButton product={product} />
        </div>
      </form>
    </>
  );
}
