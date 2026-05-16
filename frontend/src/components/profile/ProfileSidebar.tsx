"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  Heart,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: <User size={18} />, label: "My Profile", href: "/profile" },
  { icon: <ShoppingBag size={18} />, label: "My Orders", href: "/profile/orders" },
  { icon: <Heart size={18} />, label: "Wishlist", href: "/profile/wishlist" },
];

export default function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-white px-4 py-6 lg:flex">
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
