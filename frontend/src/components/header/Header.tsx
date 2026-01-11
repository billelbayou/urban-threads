import Link from "next/link";
import HeaderClient from "./HeaderClient";
import { fetchCart } from "@/lib/fetchers";
import getCookies from "@/utils/cookies";

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
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/products">Products</Link>
        </li>
        <li>
          <Link href="/new">New Arrivals</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
      <HeaderClient initialCart={cart} />
    </header>
  );
}
