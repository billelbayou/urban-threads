"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiHome,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiLoader,
} from "react-icons/fi";
import { BiCategory } from "react-icons/bi";
import { useActionState, useEffect } from "react";
import { logoutAction } from "@/services/authActions";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", icon: <FiHome />, label: "Dashboard" },
    { href: "/admin/products", icon: <FiShoppingBag />, label: "Products" },
    { href: "/admin/categories", icon: <BiCategory />, label: "Categories" },
    { href: "/orders", icon: <FiShoppingBag />, label: "Orders" },
    { href: "/customers", icon: <FiUsers />, label: "Customers" },
    { href: "/settings", icon: <FiSettings />, label: "Settings" },
  ];

  const [state, formAction, isPending] = useActionState(logoutAction, null);
  const { logoutStore } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      toast.success(state.data.message);
      logoutStore();
      router.push("/");
    }
  }, [state, router, logoutStore]);
  return (
    <div className="w-64 bg-white shadow-md flex flex-col h-screen">
      {/* Logo */}
      <div className="p-4">
        <h1 className="text-xl pl-2 font-semibold text-gray-800">Admin</h1>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <div
                  className={`flex items-center p-2 rounded-lg transition ${
                    pathname === item.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <form action={formAction} className="p-4">
        <button
          type="submit"
          className="w-full flex items-center p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
        >
          <span className="mr-3">
            {isPending ? <FiLoader className="animate-spin" /> : <FiLogOut />}
          </span>
          Logout
        </button>
      </form>
    </div>
  );
};

export default Sidebar;
