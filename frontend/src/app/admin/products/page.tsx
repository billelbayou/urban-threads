"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { FiPlus, FiList } from "react-icons/fi";
import ProductTable from "@/components/admin/ProductTable";
import ProductModal from "@/components/admin/ProductModal";
import ConfirmDialog from "@/components/common/ConfirmDialogue";
import Link from "next/link";
import { Category, Product } from "@/types/types";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await api.get("/api/products", { withCredentials: true });
      const products = res.data;
      setProducts(products);
    };
    fetchProducts();
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    const res = await api.get("/api/category", { withCredentials: true });
    setCategories(res.data);
  };

  const confirmDelete = (id: string) => setProductToDelete(id);

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/api/products/${productToDelete}`, {
        withCredentials: true,
      });
      setProducts((prev) =>
        prev.filter((p: Product) => p.id !== productToDelete)
      );
    } catch {
      alert("Failed to delete product.");
    } finally {
      setProductToDelete(null);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
        <div className="flex gap-2">
          <Link
            href={"/admin/products/categories"}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiList className="mr-1" />
            Handle Categories
          </Link>
          <Link
            href={"/admin/products/add"}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiPlus className="mr-1" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <ProductTable products={products} onDelete={confirmDelete} />
      </div>

      <ConfirmDialog
        isOpen={productToDelete !== null}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onCancel={() => setProductToDelete(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
