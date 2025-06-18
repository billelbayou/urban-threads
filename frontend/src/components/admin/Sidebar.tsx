"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiShoppingBag,
  FiUsers,
  FiPieChart,
  FiSettings,
} from "react-icons/fi";

const Sidebar = () => {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin", icon: <FiHome />, label: "Dashboard" },
    { href: "/admin/products", icon: <FiShoppingBag />, label: "Products" },
    { href: "/orders", icon: <FiShoppingBag />, label: "Orders" },
    { href: "/customers", icon: <FiUsers />, label: "Customers" },
    { href: "/analytics", icon: <FiPieChart />, label: "Analytics" },
    { href: "/settings", icon: <FiSettings />, label: "Settings" },
  ];

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold text-gray-800">FashionAdmin</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <div
                  className={`flex items-center p-2 rounded-lg ${
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
    </div>
  );
};

export default Sidebar;
