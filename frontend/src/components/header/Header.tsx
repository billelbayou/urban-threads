import Link from "next/link";
import HeaderClient from "./HeaderClient";
import MobileMenu from "./MobileMenu";
import { NAV_LINKS } from "@/constants/navigation";

export default function Header() {
  return (
    <header className="flex items-center p-4 relative z-50 border-b">
      <div className="flex items-center gap-4 md:gap-6">
        <MobileMenu />
        <ul className="hidden md:flex space-x-6 text-lg whitespace-nowrap">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 flex sm:pl-22 pl-4">
        <Link href="/">
          <h1 className="text-2xl font-bold uppercase">Urban Threads</h1>
        </Link>
      </div>

      <div>
        <HeaderClient />
      </div>
    </header>
  );
}
