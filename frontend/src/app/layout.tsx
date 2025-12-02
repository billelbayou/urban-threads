import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import AuthHydrator from "@/components/AuthHydrator";
import { Toaster } from 'sonner';

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Urban Threads",
  description: "Your online clothes store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className}`}>
        <Toaster />
        <AuthHydrator />
        {children}
      </body>
    </html>
  );
}
