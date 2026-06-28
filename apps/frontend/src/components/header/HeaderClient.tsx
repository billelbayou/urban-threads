"use client";

import Link from "next/link";
import { GoPerson } from "react-icons/go";
import { PiBasketBold } from "react-icons/pi";
import { useActionState, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/services/authActions";
import { toast } from "sonner";

export default function HeaderClient() {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const [state, formAction, isPending] = useActionState(logoutAction, null);

  const { user, logoutStore } = useAuthStore();
  const { cart, setCart, toggleCart } = useCartStore();

  const router = useRouter();

  // 🔹 Logout handling
  useEffect(() => {
    if (state?.success) {
      toast.success(state.data?.message ?? "Logged out");
      logoutStore();
      setCart(null);
      router.push("/");
    }
  }, [state, logoutStore, router, setCart]);

  // 🔹 Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleCart = () => {
    if (!user) router.push("/login");
    else toggleCart();
  };

  return (
    <>
      <ul className="flex space-x-4 items-center justify-center relative">
        {/* Profile */}
        <li ref={dropdownRef} className="relative h-6.5">
          <button onClick={() => setProfileOpen((p) => !p)}>
            <GoPerson size={26} />
          </button>

          {profileOpen && (
            <div className="absolute z-10 right-0 mt-2 w-40 bg-white border shadow-md">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      router.push("/profile");
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Profile
                  </button>

                  <form action={formAction}>
                    <button
                      disabled={isPending}
                      type="submit"
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100 disabled:opacity-50"
                    >
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </li>

        {/* Cart */}
        <li className="h-6.5">
          <button
            onClick={handleToggleCart}
            className="relative cursor-pointer"
          >
            <PiBasketBold size={26} />
            {user && cart?.items && cart.items.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-black text-white text-[10px] flex items-center justify-center">
                {cart?.items.length}
              </span>
            )}
          </button>
        </li>
      </ul>
    </>
  );
}
