import Link from "next/link";
import { NAV_LINKS } from "@/constants/navigation";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="font-semibold mb-3">COMPANY</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/about">About Urban Threads</Link>
            </li>
            <li>
              <Link href="/about">Careers</Link>
            </li>
            <li>
              <Link href="/about">Tax fees</Link>
            </li>
            <li>
              <Link href="/about">Our Warehouse</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">PAYMENT METHODS</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/contact">Visa & Mastercard</Link>
            </li>
            <li>
              <Link href="/contact">Bancontact</Link>
            </li>
            <li>
              <Link href="/contact">Gift Cards</Link>
            </li>
            <li>
              <Link href="/contact">Shop with Points</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">HELP CENTER</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/contact">Shipping</Link>
            </li>
            <li>
              <Link href="/contact">Delivery Rates</Link>
            </li>
            <li>
              <Link href="/contact">Discounts</Link>
            </li>
            <li>
              <Link href="/contact">Returns & Replacements</Link>
            </li>
            <li>
              <Link href="/contact">Recycling</Link>
            </li>
            <li>
              <Link href="/contact">Customer Support</Link>
            </li>
            <li>
              <Link href="/contact">Accessibility</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">ORDERS & SHIPMENT</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/profile">My Account</Link>
            </li>
            <li>
              <Link href="/profile/orders">Order Shipment</Link>
            </li>
            <li>
              <Link href="/products">Marketplace</Link>
            </li>
            <li>
              <Link href="/contact">Financing Methods</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h1 className="text-8xl font-bold tracking-tight uppercase">
          urban threads
        </h1>
      </div>

      <div className="mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <p>&copy;{new Date().getFullYear()}. All rights reserved</p>
        <div className="flex gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
        <div className="flex gap-4">
          <Link href="/about" className="underline">
            Legal Notice
          </Link>
          <Link href="/about" className="underline">
            Legal Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
