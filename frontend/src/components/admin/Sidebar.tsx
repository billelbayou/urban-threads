"use client";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Layers,
  Moon,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

const navMain = [
  { icon: LayoutDashboard, label: "Dashboard", url: "/admin" },
  { icon: Package, label: "Products", url: "/admin/products" },
  { icon: Layers, label: "Categories", url: "/admin/categories" },
  { icon: ShoppingCart, label: "Orders", url: "/admin/orders" },
  { icon: Users, label: "Customers", url: "/admin/customers" },
];

export default function Sidebar() {
  const [dark, setDark] = useState(false);
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white flex flex-col h-full rounded-2xl overflow-hidden shadow-sm">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-100">
        <span className="font-semibold text-gray-900 text-lg">
          Urban-Threads Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 px-2 mb-2 tracking-wider">
          MAIN
        </p>
        <ul className="space-y-0.5">
          {navMain.map((item) => {
            const isActive =
              pathname === item.url ||
              (item.url !== "/admin" && pathname.startsWith(item.url));
            return (
              <li key={item.label}>
                <Link
                  href={item.url}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={16} />
                    {item.label}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 space-y-3">
        {/* Dark mode */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Moon size={15} />
            <span>Dark Mode</span>
          </div>
          <button
            onClick={() => setDark(!dark)}
            className={`relative w-9 h-5 rounded-full transition-colors ${dark ? "bg-indigo-600" : "bg-gray-200"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${dark ? "translate-x-4" : ""}`}
            />
          </button>
        </div>

        {/* Logout */}
        <LogoutButton />
      </div>
    </aside>
  );
}
