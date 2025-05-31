import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { GoPerson } from "react-icons/go";
import { PiBasketBold } from "react-icons/pi";

export default function Header() {
  return (
    <header className="flex items-center p-4 relative">
      <ul className="flex justify-self-start space-x-4 text-lg h-full">
        <li className="hover:underline">
          <Link href={"/"}>Home</Link>
        </li>
        <li className="hover:underline">
          <Link href={"/products"}>Products</Link>
        </li>
        <li className="hover:underline">
          <Link href={"/new"}>New Arrivals</Link>
        </li>
        <li className="hover:underline">
          <Link href={"/about"}>About</Link>
        </li>
        <li className="hover:underline">
          <Link href={"/contact"}>Contact</Link>
        </li>
      </ul>
      <Link href={"/"} className="absolute left-1/2 transform -translate-x-1/2">
        <h1 className="text-4xl font-bold uppercase">Urban Threads</h1>
      </Link>
      <ul className="flex ml-auto space-x-4">
        <li>
          <button>
            <CiSearch size={30} />
          </button>
        </li>
        <li>
          <button>
            <GoPerson size={30} />
          </button>
        </li>
        <li>
          <button className="relative">
            <PiBasketBold size={30} />
            <span className="h-3.5 w-3.5 rounded-full bg-black absolute top-[-10px] right-[-5px] text-white flex justify-center items-center text-[10px] font-bold"></span>
          </button>
        </li>
      </ul>
    </header>
  );
}
