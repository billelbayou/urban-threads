"use client";

import { Product } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaChevronUp, FaChevronDown, FaRegHeart } from "react-icons/fa";
import { useCartStore } from "@/store/useCartStore";

type Props = {
  product: Product;
};

export default function ProductDetails({ product }: Props) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);

  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }

    addToCart(
      product.id,
      quantity
    );
  };
console.log(product);

  useEffect(() => {
    if (product.infoSections && product.infoSections.length > 0) {
      setOpenSection(product.infoSections[0].title);
    }
  }, [product.infoSections]);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const sizes = ["XS", "S", "M", "L", "XL"];

  return (
    <div className="px-2 sm:px-0 py-4">
      <h1 className="text-2xl sm:text-3xl font-semibold">{product.name}</h1>

      <p className="text-sm text-gray-500 mt-1 capitalize">
        {product.category.name}
      </p>

      <p className="text-gray-600 mt-2 text-sm sm:text-base">
        {product.description}
      </p>

      <p className="text-xl sm:text-2xl font-semibold mt-4">${product.price}</p>

      {/* Size Selector */}
      <div className="relative mt-6">
        <button
          onClick={() => setSizeDropdownOpen((prev) => !prev)}
          className="w-full border border-black py-2 px-4 rounded-md text-left flex justify-between items-center text-sm sm:text-base"
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
              className="absolute z-10 w-full bg-white border border-black mt-1 rounded-md shadow-md"
            >
              {sizes.map((size) => (
                <li
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setSizeDropdownOpen(false);
                  }}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {size}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4 mt-6">
        <p className="text-sm font-medium">Quantity</p>

        <div className="flex items-center border border-black rounded-md">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1 text-lg"
          >
            -
          </button>

          <span className="px-4 py-1 text-sm">{quantity}</span>

          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-1 text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-black text-white py-2 rounded-md hover:bg-gray-900 transition text-sm sm:text-base"
        >
          Add to Cart
        </button>

        <button className="border border-black px-4 py-2 rounded-md hover:bg-gray-100 transition flex items-center justify-center">
          <FaRegHeart />
        </button>
      </div>

      {/* Expandable sections */}
      <div className="mt-8 space-y-4">
        {product.infoSections.map((section, index) => (
          <div key={index}>
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection(section.title)}
            >
              <p className="font-medium text-sm sm:text-base">
                {section.title}
              </p>

              {openSection === section.title ? (
                <FaChevronUp />
              ) : (
                <FaChevronDown />
              )}
            </div>

            <AnimatePresence>
              {openSection === section.title && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden text-sm text-gray-700 mt-2 leading-relaxed"
                >
                  {section.content}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
