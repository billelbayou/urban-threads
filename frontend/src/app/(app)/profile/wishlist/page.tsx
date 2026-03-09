import { redirect } from "next/navigation";
import { getCurrentUser, fetchWishlist } from "@/lib/fetchers";
import getCookies from "@/utils/cookies";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import WishlistClient from "./WishlistClient";
import { Wishlist } from "@/types/wishlist";

export default async function WishlistPage() {
  const cookie = await getCookies();
  const user = await getCurrentUser(cookie);
  const wishlist: Wishlist | null = await fetchWishlist(cookie);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <ProfileSidebar />
          </div>

          {/* Main Content - Wishlist */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                My Wishlist
              </h2>

              <WishlistClient initialWishlist={wishlist} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
