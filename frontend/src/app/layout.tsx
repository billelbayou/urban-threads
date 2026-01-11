import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import AuthHydrator from "@/components/auth/AuthHydrator";
import { cookies } from "next/headers";
import { fetchCart, getCurrentUser } from "@/lib/fetchers";
import getCookies from "@/utils/cookies";
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
  const cookies = await getCookies()
  const user = await getCurrentUser(cookies);
  const cart = await fetchCart(cookies)
  return (
    <html lang="en">
      <body className={`${montserrat.className}`} suppressHydrationWarning>
        <Toaster richColors/>
        <AuthHydrator user={user} />
        <CartHydrator cart={cart} />
        {children}
      </body>
    </html>
  );
}
