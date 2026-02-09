import { redirect } from "next/navigation";
import { getCurrentUser, fetchCart } from "@/lib/fetchers";
import getCookies from "@/utils/cookies";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export default async function CheckoutPage() {
  const cookie = await getCookies();
  const user = await getCurrentUser(cookie);
  const cart = await fetchCart(cookie);

  if (!user) {
    redirect("/login?redirect=/checkout");
  }

  if (!cart || cart.items.length === 0) {
    redirect("/");
  }

  return <CheckoutClient cart={cart} user={user} />;
}
