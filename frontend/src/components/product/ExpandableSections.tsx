"use client"

import { Product } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

export default function ExpandableSections({product}: {product: Product}) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    if (product.infoSections && product.infoSections.length > 0) {
      setOpenSection(product.infoSections[0].title);
    }
  }, [product.infoSections]);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };
  return (
    <div className="mt-8 space-y-4">
      {product.infoSections.map((section, index) => (
        <div key={index}>
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection(section.title)}
          >
            <p className="font-medium text-sm sm:text-base">{section.title}</p>

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
  );
}
