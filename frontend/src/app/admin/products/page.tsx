"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { FiPlus, FiList } from "react-icons/fi";
import ProductTable from "@/components/admin/ProductTable";
import ProductModal from "@/components/admin/ProductModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import Link from "next/link";
import { Category, Product } from "@/lib/types";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await api.get("/api/products", { withCredentials: true });
      const mapped = res.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        stock: p.stock,
        category: p.category?.name || "Uncategorized",
      }));
      setProducts(mapped);
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
      await api.delete(`/api/products/${productToDelete}`, { withCredentials: true });
      setProducts((prev) => prev.filter((p: Product) => p.id !== productToDelete));
    } catch {
      alert("Failed to delete product.");
    } finally {
      setProductToDelete(null);
    }
  };
  console.log(products)
  console.log(categories);
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setIsCategoryModalOpen(true); fetchCategories(); }}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FiPlus className="mr-1" />
            Add Category
          </button>
          <button
            onClick={fetchCategories}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiList className="mr-1" />
            List Categories
          </button>
          <Link
            href={"/admin/products/add"}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiPlus className="mr-1" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Show list of categories */}
      {categories.length > 0 && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold mb-2">Categories:</h2>
          <ul className="list-disc list-inside">
            {categories.map((c, idx) => (
              <li key={idx}>{c.name}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <ProductTable products={products} onDelete={confirmDelete} />
      </div>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />

      {/* Category modal (very simple) */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add Category</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const name = (e.target as any).elements.name.value;
                await api.post("/api/category", { name }, { withCredentials: true });
                fetchCategories();
                setIsCategoryModalOpen(false);
              }}
              className="flex flex-col gap-3"
            >
              <input
                name="name"
                placeholder="Category Name"
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-3 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
