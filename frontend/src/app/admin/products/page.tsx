import { FiPlus, FiFilter, FiSearch } from "react-icons/fi";
import ProductTable from "@/components/admin/product-admin/ProductTable";
import Link from "next/link";
import { fetchProducts } from "@/services/api/product";
import { Product } from "@/types/product";
import getCookies from "@/utils/cookies";
import { Suspense } from "react";
import { Metadata } from "next";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Products Management | Urban Threads Admin",
};

async function ProductList() {
  await connection()
  let products: Product[] = [];
  try {
    const cookies = await getCookies();
    products = await fetchProducts(cookies);
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return (
      <div className="text-rose-500 py-20 text-center admin-card">
        <p className="font-medium text-lg">Failed to load products</p>
        <p className="text-slate-500 text-sm mt-1">
          Please try again later or contact support.
        </p>
      </div>
    );
  }

  return <ProductTable products={products} />;
}

function ProductTableSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-20 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
        ></div>
      ))}
    </div>
  );
}

export default function Products() {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 ">
            Products Management
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your store's inventory and details
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={"/admin/products/add"}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <FiPlus /> Add New Product
          </Link>
        </div>
      </div>

      <div className=" p-6 min-h-150">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
              <FiFilter /> Filters
            </button>
            <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none transition-all">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <Suspense fallback={<ProductTableSkeleton />}>
          <ProductList />
        </Suspense>
      </div>
    </>
  );
}
