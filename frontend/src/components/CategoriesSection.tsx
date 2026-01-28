import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

import rightImg from "../../public/streetwear-comfort.jpg";
import topImg from "../../public/chinese-streetwear-1600x900.png";
import bottomImg from "../../public/449ab5f64580a17a08e8b4f0e313796b.jpg";

export default function CategoriesSection() {
  const categories = [
    { label: "Shop Men", img: rightImg, href: "/men" },
    { label: "Shop Women", img: topImg, href: "/women" },
    { label: "Shop Accessories", img: bottomImg, href: "/accessories" },
  ];

  return (
    <section className="mb-44">
      <h2 className="text-3xl font-medium mb-6">Categories</h2>

      <div className="grid grid-cols-2 gap-4 h-175">
        {/* Left big category */}
        <Link
          href={categories[0].href}
          className="relative col-span-1 row-span-2 group rounded-xl overflow-hidden"
        >
          <Image
            src={categories[0].img}
            alt={categories[0].label}
            fill
            sizes="100%"
            className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xl text-white font-semibold drop-shadow-lg">
            <span>{categories[0].label}</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </Link>

        {/* Top right */}
        <Link
          href={categories[1].href}
          className="relative rounded-xl overflow-hidden group"
        >
          <Image
            src={categories[1].img}
            alt={categories[1].label}
            fill
            sizes="100%"
            className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xl text-white font-semibold drop-shadow-lg">
            <span>{categories[1].label}</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </Link>

        {/* Bottom right */}
        <Link
          href={categories[2].href}
          className="relative rounded-xl overflow-hidden group"
        >
          <Image
            src={categories[2].img}
            alt={categories[2].label}
            fill
            sizes="100%"
            className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xl text-white font-semibold drop-shadow-lg">
            <span>{categories[2].label}</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </Link>
      </div>
    </section>
  );
}
