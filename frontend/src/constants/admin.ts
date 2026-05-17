import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  Users,
} from "lucide-react";

export const ADMIN_NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", url: "/admin" },
  { icon: Package, label: "Products", url: "/admin/products" },
  { icon: Layers, label: "Categories", url: "/admin/categories" },
  { icon: ShoppingCart, label: "Orders", url: "/admin/orders" },
  { icon: Users, label: "Customers", url: "/admin/customers" },
] as const;
