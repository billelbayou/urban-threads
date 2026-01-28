"use client";

import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { GoPerson } from "react-icons/go";
import { PiBasketBold } from "react-icons/pi";
import { FaBars, FaTimes } from "react-icons/fa";
import { useActionState, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/services/authActions";
import { toast } from "sonner";
import { Cart } from "@/types/cart";

interface HeaderClientProps {
  initialCart: Cart | null;
}

export default function HeaderClient({ initialCart }: HeaderClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const [state, formAction, isPending] = useActionState(logoutAction, null);

  const { user, logoutStore } = useAuthStore();
  const { cart, setCart, toggleCart } = useCartStore();

  const router = useRouter();

  // 🔹 Hydrate cart store from server (ONCE)
  useEffect(() => {
    if (initialCart) {
      setCart(initialCart);
    }
  }, [initialCart, setCart]);

  // 🔹 Logout handling
  useEffect(() => {
    if (state?.success) {
      toast.success(state.data.message);
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
      {/* Mobile Menu Icon */}
      <button className="md:hidden z-20" onClick={() => setMenuOpen((p) => !p)}>
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Right Icons */}
      <ul className="flex space-x-4 items-center ml-auto md:ml-0 relative">
        <li>
          <CiSearch size={26} />
        </li>

        {/* Profile */}
        <li ref={dropdownRef} className="relative">
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
        <li>
          <button onClick={handleToggleCart} className="relative cursor-pointer">
            <PiBasketBold size={26} />
            {user && cart?.items && cart.items.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-black text-white text-[10px] flex items-center justify-center">
                {cart?.items.length}
              </span>
            )}
          </button>
        </li>
      </ul>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="absolute top-full left-0 w-full bg-white flex flex-col p-4 md:hidden">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/products" onClick={() => setMenuOpen(false)}>
            Products
          </Link>
          <Link href="/new" onClick={() => setMenuOpen(false)}>
            New Arrivals
          </Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
        </ul>
      )}
    </>
  );
}
