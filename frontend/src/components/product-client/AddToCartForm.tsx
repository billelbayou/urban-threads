"use client";

import { addToCartAction } from "@/services/cartActions";
import { useAuthStore } from "@/store/useAuthStore";
import { AnimatePresence, motion } from "framer-motion";
import { useActionState, useEffect, useState } from "react";
import { FaChevronUp, FaChevronDown, FaRegHeart } from "react-icons/fa";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Added for redirecting
import { useCartStore } from "@/store/useCartStore";
import { Product } from "@/types/product";

const sizes = ["XS", "S", "M", "L", "XL"];

export default function AddToCartForm({ product }: { product: Product }) {
  const user = useAuthStore((state) => state.user);
  const setCart = useCartStore((state) => state.setCart);
  const openCart = useCartStore((state) => state.openCart);
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [state, formAction, isPending] = useActionState(addToCartAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success("Added to cart!", {position: "bottom-left"});
      setCart(state.data);
      openCart();
    }
    if (state?.error) toast.error(state.error);
  }, [state]);

  // Handler for unauthenticated clicks
  const handleAuthRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info("Please sign in to add items to your cart");
    router.push("/login");
  };

  return (
    <form action={user ? formAction : undefined}>
      <input type="hidden" name="productId" value={product.id} />
      <input type="hidden" name="quantity" value={quantity} />
      <input type="hidden" name="size" value={selectedSize || ""} />

      {/* Size Selector */}
      <div className="relative mt-6">
        <button
          type="button" // Always set type="button" for non-submit buttons
          onClick={() => setSizeDropdownOpen((prev) => !prev)}
          className="w-full border border-black py-2 px-4 rounded-md text-left flex justify-between items-center text-sm sm:text-base"
        >
          {selectedSize || "Select Size"}
          {sizeDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        <AnimatePresence>
          {sizeDropdownOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-full bg-white border border-black mt-1 rounded-md shadow-md"
            >
              {sizes.map((size) => (
                <li
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setSizeDropdownOpen(false);
                  }}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {size}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4 mt-6">
        <p className="text-sm font-medium">Quantity</p>
        <div className="flex items-center border border-black rounded-md">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1 text-lg"
          >
            -
          </button>
          <span className="px-4 py-1 text-sm">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-1 text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          disabled={isPending}
          type={user ? "submit" : "button"} // If not logged in, it's just a regular button
          onClick={!user ? handleAuthRedirect : undefined} // Intercept click if guest
          className="flex-1 cursor-pointer bg-black text-white py-2 rounded-md hover:bg-gray-900 transition text-sm sm:text-base disabled:opacity-50"
        >
          {isPending ? "Adding..." : user ? "Add to Cart" : "Login in to Buy"}
        </button>

        <button
          type="button"
          className="border border-black px-4 py-2 rounded-md hover:bg-gray-100 transition flex items-center justify-center"
        >
          <FaRegHeart />
        </button>
      </div>
    </form>
  );
}
