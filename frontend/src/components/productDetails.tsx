"use client";

import { Products } from "@/lib/data";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaChevronUp, FaChevronDown, FaRegHeart } from "react-icons/fa";

type Props = {
  product: Products;
};

export default function ProductDetails({ product }: Props) {
  const [openSection, setOpenSection] = useState<string | null>("Features");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const sizes = ["XS", "S", "M", "L", "XL"];
  const sections = [
    {
      title: "Details & Care",
      content: "Dry clean only. Do not bleach. Iron at low temperature.",
    },
    {
      title: "Size & Fit",
      content: "Model is 6'1 and wears a size M. Fits true to size.",
    },

    {
      title: "Sustainability",
      content: "Made with circular wool and environmentally friendly dyes.",
    },
  ];

  return (
    <div className="px-2 py-4">
      <h1 className="text-xl sm:text-2xl font-medium">{product.name}</h1>
      <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
      <p className="text-lg sm:text-xl font-semibold mt-4">${product.price}</p>
      <p className="text-sm text-gray-600 mt-4">{product.description}</p>

      {/* Size Selector */}
      <div className="relative mt-6">
        <button
          onClick={() => setSizeDropdownOpen((prev) => !prev)}
          className="w-full border border-black py-2 px-4 rounded-md text-left flex justify-between items-center"
        >
          {selectedSize || "Select Size"}
          {sizeDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <AnimatePresence>
          {sizeDropdownOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-full bg-white border border-black mt-1 rounded-md shadow"
            >
              {sizes.map((size) => (
                <li
                  key={size}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedSize(size);
                    setSizeDropdownOpen(false);
                  }}
                >
                  {size}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <button className="flex-1 bg-black text-white py-2 rounded-md hover:bg-gray-900 transition">
          Add to Cart
        </button>
        <button className="border border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 transition">
          <FaRegHeart />
        </button>
      </div>

      {/* Sections */}
      <div className="mt-6 space-y-4">
        {sections.map(({ title, content }) => (
          <div key={title}>
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection(title)}
            >
              <p className="font-medium">{title}</p>
              {openSection === title ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <AnimatePresence>
              {openSection === title && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden text-sm text-gray-700 mt-2"
                >
                  {content}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
