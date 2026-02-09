"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Cart } from "@/types/cart";
import { User } from "@/types/user";
import { createOrderAction } from "@/services/orderActions";
import { useCartStore } from "@/store/useCartStore";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface CheckoutClientProps {
  cart: Cart;
  user: User;
}

export default function CheckoutClient({ cart, user }: CheckoutClientProps) {
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);
  
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const handlePlaceOrder = async () => {
    setIsPending(true);
    setError(null);

    const result = await createOrderAction(null);

    if (result.success) {
      clearCart();
      router.push("/profile/orders");
    } else {
      setError(result.error || "Failed to place order");
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Order Summary */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      {item.product.images?.[0] ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Size: {item.size}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm text-gray-500">Qty:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {item.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ${item.product.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Address Preview */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Shipping Address
                </h3>
                <div className="text-sm text-gray-600">
                  {user.firstName} {user.lastName}
                  {user.streetAddress && (
                    <>
                      <br />
                      {user.streetAddress}
                      {user.apartment && `, ${user.apartment}`}
                      <br />
                      {user.city}, {user.state} {user.postalCode}
                      <br />
                      {user.country}
                    </>
                  )}
                  {!user.streetAddress && (
                    <p className="text-amber-600 mt-1">
                      Please add your shipping address in your profile before
                      ordering.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Total */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Total
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-base font-medium">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={isPending || !user.streetAddress}
                className="mt-6 w-full bg-gray-900 text-white py-4 px-6 rounded-md font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? "Processing..." : "Place Order"}
              </button>

              {!user.streetAddress && (
                <p className="mt-3 text-xs text-center text-amber-600">
                  Please add your shipping address in your profile to place an
                  order.
                </p>
              )}

              <p className="mt-4 text-xs text-center text-gray-500">
                By placing this order, you agree to our Terms of Service and
                Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
