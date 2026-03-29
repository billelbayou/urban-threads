import Link from "next/link";
import HeaderClient from "./HeaderClient";
import { fetchCart } from "@/services/api/cart";
import getCookies from "@/utils/cookies";
import { NAV_LINKS } from "@/constants/navigation";

export default async function Header() {
  const cart = await fetchCart(await getCookies());
  return (
    <header className="flex items-center justify-between p-4 relative border-b mb-5">
      <Link
        href="/"
        className="absolute left-1/2 transform -translate-x-1/2 md:static md:translate-x-0"
      >
        <h1 className="text-2xl font-bold uppercase">Urban Threads</h1>
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex space-x-6 text-lg">
        {NAV_LINKS.map(({ href, label }) => (
          <li key={href}>
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul>
      <HeaderClient initialCart={cart} />
    </header>
  );
}
