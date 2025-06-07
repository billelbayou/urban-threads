"use client";

import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { GoPerson } from "react-icons/go";
import { PiBasketBold } from "react-icons/pi";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
        <li className="hover:underline">
          <Link href="/">Home</Link>
        </li>
        <li className="hover:underline">
          <Link href="/products">Products</Link>
        </li>
        <li className="hover:underline">
          <Link href="/new">New Arrivals</Link>
        </li>
        <li className="hover:underline">
          <Link href="/about">About</Link>
        </li>
        <li className="hover:underline">
          <Link href="/contact">Contact</Link>
        </li>
      </ul>

      {/* Right Icons */}
      <ul className="flex space-x-4 items-center ml-auto md:ml-0">
        <li>
          <button>
            <CiSearch size={26} />
          </button>
        </li>
        <li>
          <button>
            <GoPerson size={26} />
          </button>
        </li>
        <li>
          <button className="relative">
            <PiBasketBold size={26} />
            <span className="h-4 w-4 rounded-full bg-black absolute top-[-6px] right-[-6px] text-white text-[10px] font-bold flex items-center justify-center">
              4
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
