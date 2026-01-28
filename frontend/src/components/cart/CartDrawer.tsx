"use client";

import { removeFromCartAction } from "@/services/cartActions";
import { useCartStore } from "@/store/useCartStore"; // Ensure correct path
import Image from "next/image";
import { useActionState, useEffect } from "react";
import { FaSpinner, FaTimes, FaTrash } from "react-icons/fa";
import { toast } from "sonner";

export default function CartDrawer() {
  // 1. Correctly destructure from the store
  const { cart, isOpen, toggleCart, setCart } = useCartStore();
  const [state, formAction, isPending] = useActionState(
    removeFromCartAction,
    null
  );
  useEffect(() => {
    if (state) {
      if (state.success) {
        // Sync the store with the new items returned after deletion
        setCart(state.data);
        toast.success("Item removed", {position: "bottom-left"});
      } else {
        toast.error(state.error);
      }
    }
  }, [state]);

  return (
    <>
      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
          onClick={toggleCart}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl 
          transform transition-transform duration-500 ease-in-out z-50 flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-tight">
              Your Cart
            </h2>
            <p className="text-xs text-gray-500 uppercase">
              {cart?.items.length} Items
            </p>
          </div>
          <button
            onClick={toggleCart}
            className="hover:rotate-90 transition-transform duration-200 p-2"
          >
            <FaTimes size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {cart?.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-400 italic">
                Your cart is feeling a bit light.
              </p>
              <button
                onClick={toggleCart}
                className="mt-4 text-sm font-bold underline decoration-2 underline-offset-4"
              >
                Go Shopping
              </button>
            </div>
          ) : (
            cart?.items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="relative h-24 w-20 shrink-0 bg-gray-100 rounded-sm overflow-hidden">
                  <Image
                    src={item.product.images[0]?.url || "/placeholder.png"}
                    alt={item.product.name || ""}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-sm uppercase">
                      {item.product.name}
                    </p>
                    <form action={formAction}>
                      <input type="hidden" name="itemId" value={item.id} />
                      <button
                        type="submit"
                        disabled={isPending}
                        className="text-gray-400 hover:text-red-500 transition-colors disabled:cursor-not-allowed"
                      >
                        {isPending ? (
                          <FaSpinner
                            size={14}
                            className="animate-spin text-black"
                          />
                        ) : (
                          <FaTrash size={14} />
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Display the Size & Qty */}
                  <div className="mt-1 flex gap-3 text-xs text-gray-500 uppercase">
                    <span>
                      Size: <b className="text-black">{item.size}</b>
                    </span>
                    <span>
                      Qty: <b className="text-black">{item.quantity}</b>
                    </span>
                  </div>

                  <p className="mt-auto font-medium text-sm">
                    ${(item.product?.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart?.items.length! > 0 && (
          <div className="p-5 border-t bg-gray-50">
            <div className="flex justify-between mb-4 font-bold text-lg">
              <span>Total</span>
              <span>
                $
                {cart?.items
                  .reduce(
                    (acc, item) => acc + item.product.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
            <button className="w-full bg-black text-white py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors">
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
