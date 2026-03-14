"use client";
import { ReactNode } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { usePathname } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname === "/admin") return "Dashboard";
    if (pathname.startsWith("/admin/products")) return "Products";
    if (pathname.startsWith("/admin/categories")) return "Categories";
    if (pathname.startsWith("/admin/orders")) return "Orders";
    if (pathname.startsWith("/admin/customers")) return "Customers";
    return "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex gap-4">
      <div className="w-64 shrink-0 h-[calc(100vh-32px)] sticky top-4">
        <Sidebar />
      </div>
      <div className="flex-1 min-w-0">
        <Header title={getTitle()} />
        <main>{children}</main>
      </div>
    </div>
  );
}
