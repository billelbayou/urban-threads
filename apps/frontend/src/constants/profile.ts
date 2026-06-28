import { User, ShoppingBag, Heart } from "lucide-react";

export const PROFILE_NAV_ITEMS = [
  { icon: User, label: "Profile", href: "/profile" },
  { icon: ShoppingBag, label: "Orders", href: "/profile/orders" },
  { icon: Heart, label: "Wishlist", href: "/profile/wishlist" },
] as const;
