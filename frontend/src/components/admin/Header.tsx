"use client";
import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname === "/admin") return "Dashboard";
    if (pathname.startsWith("/admin/products")) return "Products";
    if (pathname.startsWith("/admin/categories")) return "Categories";
    if (pathname.startsWith("/admin/orders")) return "Orders";
    if (pathname.startsWith("/admin/customers")) return "Customers";
    return "Dashboard";
  };
  const title = getTitle();
  return (
    <header className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Bell */}
        <div className="relative">
          <button className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50">
            <Bell size={16} />
          </button>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
            24
          </span>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 w-80">
          <Search size={14} className="text-gray-400" />
          <input
            className="flex-1 text-sm text-gray-600 outline-none placeholder-gray-400 bg-transparent"
            placeholder="Search anything"
          />
        </div>
      </div>
    </header>
  );
}
