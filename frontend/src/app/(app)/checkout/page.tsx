import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/api/auth";
import { fetchCart } from "@/services/api/cart";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  const cart = await fetchCart();

  if (!user) {
    redirect("/login?redirect=/checkout");
  }

  if (!cart || cart.items.length === 0) {
    redirect("/");
  }

  return <CheckoutClient cart={cart} />;
}
