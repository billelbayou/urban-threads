"use client";

import ProductTable from "@/components/admin/ProductTable";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import ProductModal from "@/components/admin/ProductModal";

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // In a real app, you would fetch products from your API
  const products = [
    { id: "1", name: "T-Shirt", price: 29.99, stock: 100, category: "Tops" },
    { id: "2", name: "Jeans", price: 59.99, stock: 50, category: "Bottoms" },
    { id: "3", name: "Dress", price: 79.99, stock: 30, category: "Dresses" },
    { id: "4", name: "Jacket", price: 99.99, stock: 25, category: "Outerwear" },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          Add Product
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <ProductTable products={products} />
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
