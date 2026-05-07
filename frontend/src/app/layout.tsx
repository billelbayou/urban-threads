import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import AuthHydrator from "@/components/auth/AuthHydrator";
import { getCurrentUser } from "@/services/api/auth";
import { fetchCart } from "@/services/api/cart";
import CartHydrator from "@/components/cart/CartHydrator";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Urban Threads",
  description: "Your online clothes store",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const cart = await fetchCart();
  return (
    <html lang="en">
      <body className={`${montserrat.className}`} suppressHydrationWarning>
        <Toaster richColors />
        <AuthHydrator user={user} />
        <CartHydrator cart={cart} />
        {children}
      </body>
    </html>
  );
}
