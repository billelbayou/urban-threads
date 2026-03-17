import AddProductMain from "@/components/admin/product-admin/AddProductMain";
import { fetchCategories } from "@/services/api/category";
import { Category, CategoryWithChildren } from "@/types/category";
import { buildTree } from "@/utils/helpers";
import getCookies from "@/utils/cookies";
import { connection } from "next/server";


export default async function AddProductPage() {
  await connection()
  let tree: CategoryWithChildren[] = [];
  let error: string | null = null;

  try {
    const cookies = await getCookies();
    const categories: Category[] = await fetchCategories(cookies);
    tree = buildTree(categories);
  } catch (err) {
    console.error("Failed to fetch data for Add Product page:", err);
    error = "Failed to load categories. Please try again later.";
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">
          Add Product
        </h1>

        {error ? (
          <div className="bg-white p-10 rounded-xl shadow-sm border border-red-100 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <AddProductMain categoryTree={tree} />
        )}
      </div>
    </div>
  );
}
