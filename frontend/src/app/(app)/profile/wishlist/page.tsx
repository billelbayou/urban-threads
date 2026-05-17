import { getCurrentUser } from "@/services/api/auth";
import { fetchWishlist } from "@/services/api/wishlist";
import WishlistClient from "@/components/profile/WishlistClient";
import { Wishlist } from "@/types/wishlist";

export default async function WishlistPage() {
  const user = await getCurrentUser();
  const wishlist: Wishlist | null = await fetchWishlist();

  if (!user) return null;

  return (
    <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">My Wishlist</h2>
      <WishlistClient initialWishlist={wishlist} />
    </main>
  );
}
