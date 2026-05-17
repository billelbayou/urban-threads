"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { PROFILE_NAV_ITEMS } from "@/constants/profile";

export default function ProfileTabs() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <nav className="flex gap-2 overflow-x-auto px-4 pt-4 sm:px-8">
        {PROFILE_NAV_ITEMS.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
