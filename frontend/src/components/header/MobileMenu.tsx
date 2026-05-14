"use client";

import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { NAV_LINKS } from "@/constants/navigation";

export default function MobileMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <button className="md:hidden" onClick={() => setMenuOpen((p) => !p)}>
        {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </button>

      {menuOpen && (
        <ul className="absolute top-full left-0 w-full bg-white flex flex-col p-4 md:hidden z-50 shadow-lg">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-lg"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
