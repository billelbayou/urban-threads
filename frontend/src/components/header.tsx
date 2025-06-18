"use client";

import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { GoPerson } from "react-icons/go";
import { PiBasketBold } from "react-icons/pi";
import { FaBars, FaTimes } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const { user, logout } = useAuthStore();
  const router = useRouter();
  console.log(user);

  // Close dropdown when clicking outside
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

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    router.push("/");
  };

  return (
    <header className="flex items-center justify-between p-4 relative border-b mb-5">
      {/* Mobile Menu Icon */}
      <button
        className="md:hidden z-20"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Logo */}
      <Link
        href="/"
        className="absolute left-1/2 transform -translate-x-1/2 md:static md:translate-x-0"
      >
        <h1 className="text-2xl font-bold uppercase">Urban Threads</h1>
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex space-x-6 text-lg">
        <li>
          <Link className="hover:underline" href="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="hover:underline" href="/products">
            Products
          </Link>
        </li>
        <li>
          <Link className="hover:underline" href="/new">
            New Arrivals
          </Link>
        </li>
        <li>
          <Link className="hover:underline" href="/about">
            About
          </Link>
        </li>
        <li>
          <Link className="hover:underline" href="/contact">
            Contact
          </Link>
        </li>
      </ul>

      {/* Right Side Icons */}
      <ul className="flex space-x-4 items-center ml-auto md:ml-0 relative">
        <li>
          <button>
            <CiSearch size={26} />
          </button>
        </li>

        {/* Profile Icon with Dropdown */}
        <li ref={dropdownRef} className="relative">
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="relative z-10"
          >
            <GoPerson size={26} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-md rounded-md py-2 z-20">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      router.push("/profile");
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
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

        {/* Basket Icon */}
        <li>
          <button className="relative">
            <PiBasketBold size={26} />
            <span className="h-4 w-4 rounded-full bg-black absolute top-[-6px] right-[-6px] text-white text-[10px] font-bold flex items-center justify-center">
              {user?.cart?.items.length}
            </span>
          </button>
        </li>
      </ul>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <ul className="absolute top-full left-0 w-full bg-white flex flex-col space-y-4 p-4 text-lg shadow-md md:hidden z-10">
          <li>
            <Link href="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/products" onClick={() => setMenuOpen(false)}>
              Products
            </Link>
          </li>
          <li>
            <Link href="/new" onClick={() => setMenuOpen(false)}>
              New Arrivals
            </Link>
          </li>
          <li>
            <Link href="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
