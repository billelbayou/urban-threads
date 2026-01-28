export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="font-semibold mb-3">COMPANY</h3>
          <ul className="space-y-2">
            <li>
              <a href="#">About Urban Threads</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
            <li>
              <a href="#">Tax fees</a>
            </li>
            <li>
              <a href="#">Our Warehouse</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">PAYMENT METHODS</h3>
          <ul className="space-y-2">
            <li>
              <a href="#">Visa & Mastercard</a>
            </li>
            <li>
              <a href="#">Bancontact</a>
            </li>
            <li>
              <a href="#">Gift Cards</a>
            </li>
            <li>
              <a href="#">Shop with Points</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">HELP CENTER</h3>
          <ul className="space-y-2">
            <li>
              <a href="#">Shipping</a>
            </li>
            <li>
              <a href="#">Delivery Rates</a>
            </li>
            <li>
              <a href="#">Discounts</a>
            </li>
            <li>
              <a href="#">Returns & Replacements</a>
            </li>
            <li>
              <a href="#">Recycling</a>
            </li>
            <li>
              <a href="#">Customer Support</a>
            </li>
            <li>
              <a href="#">Accessibility</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">ORDERS & SHIPMENT</h3>
          <ul className="space-y-2">
            <li>
              <a href="#">My Account</a>
            </li>
            <li>
              <a href="#">Order Shipment</a>
            </li>
            <li>
              <a href="#">Flowbite Marketplace</a>
            </li>
            <li>
              <a href="#">Financing Methods</a>
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
        <p>©2025. All rights reserved</p>
        <div className="flex gap-6">
          <a href="#">Home</a>
          <a href="#">Products</a>
          <a href="#">New Arrivals</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
        <div className="flex gap-4">
          <a href="#" className="underline">
            Legal Notice
          </a>
          <a href="#" className="underline">
            Legal Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
