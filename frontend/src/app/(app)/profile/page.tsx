import { getCurrentUser } from "@/services/api/auth";
import { redirect } from "next/navigation";
import {
  ShoppingBag,
  CreditCard,
  User,
  Heart,
  MapPin,
  Settings,
  LogOut,
} from "lucide-react";
import { ProfileContent } from "@/components/profile/profile-content";

interface NavItem {
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { icon: <User size={18} />, label: "My Profile" },
  { icon: <ShoppingBag size={18} />, label: "My Orders" },
  { icon: <Heart size={18} />, label: "Wishlist" },
  { icon: <MapPin size={18} />, label: "Addresses" },
  { icon: <CreditCard size={18} />, label: "Payment Methods" },
  { icon: <Settings size={18} />, label: "Settings" },
  { icon: <LogOut size={18} />, label: "Sign Out" },
];

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex bg-[#f5f5f7]">
      <aside className="sticky top-0 flex h-dvh w-60 shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-white px-4 py-6">
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {navItems.map((item, index) => (
            <div key={item.label}>
              <button
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                  index === 0
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            </div>
          ))}
        </nav>
      </aside>

      <ProfileContent user={user} />
    </div>
  );
}
