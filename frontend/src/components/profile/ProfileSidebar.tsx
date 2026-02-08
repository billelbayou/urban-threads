"use client";

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const menuItems = [
  { id: 1, href: "/profile", label: "Personal Information" },
  { id: 2, href: "/profile/orders", label: "Orders" },
  { id: 3, href: "/profile/wishlist", label: "Wishlist" },
];

export default function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {menuItems.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors ${
            pathname === item.href
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          } border-b border-gray-100 last:border-b-0`}
        >
          <span className="font-medium">{item.label}</span>
          <ChevronRight className="w-5 h-5" />
        </Link>
      ))}
    </div>
  );
}
