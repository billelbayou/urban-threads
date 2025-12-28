"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";

export default function CartDrawer() {
  const { isOpen, items, toggleCart, fetchCart, removeFromCart } =
    useCartStore();

  // Fetch cart from DB when opening
  useEffect(() => {
    if (isOpen) fetchCart();
  }, [isOpen]);
  
  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg border-l 
        transform transition-transform duration-300 z-50 
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Your Cart</h2>
        <button onClick={toggleCart}>
          <FaTimes size={20} />
        </button>
      </div>

      {/* Items */}
      <div className="p-4 overflow-y-auto h-[calc(100%-120px)]">
        {items.length === 0 ? (
          <p className="text-gray-600 text-center mt-10">
            Your cart is empty.
          </p>
        ) : (
          items.map((i) => (
            <div
              key={i.id}
              className="flex items-center gap-4 mb-4 border-b pb-4"
            >
              <Image
                src={i.product.images[0]?.url}
                alt={i.product.name}
                width={60}
                height={60}
                className="rounded-md object-cover"
              />

              <div className="flex-1">
                <p className="font-semibold">{i.product.name}</p>
                <p className="text-gray-700">${i.product.price}</p>
                <p className="text-sm text-gray-500">
                  Qty: {i.quantity}
                </p>
              </div>

              <button
                className="text-sm text-red-500"
                onClick={() => removeFromCart(i.id)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t">
        <button className="w-full bg-black text-white py-2 rounded">
          Checkout
        </button>
      </div>
    </div>
  );
}
