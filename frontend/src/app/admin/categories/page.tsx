import { buildTree } from "@/utils/helpers";
import { fetchCategories } from "@/services/api/category";
import AddRootButton from "@/components/admin/categories/AddRootButton";
import CategoryTreeBox from "@/components/admin/categories/CategoryTreeBox";
import { ListTree } from "lucide-react";
import { CategoryWithChildren } from "@/types/category";
import getCookies from "@/utils/cookies";
import { Suspense } from "react";
import { Metadata } from "next";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Category Management | Urban Threads Admin",
};

async function CategoryList() {
  await connection();
  let tree: CategoryWithChildren[] = [];
  try {
    const cookies = await getCookies();
    const categories = await fetchCategories(cookies);
    tree = buildTree(categories);
  } catch (err) {
    console.error("Failed to fetch categories for admin page:", err);
    return (
      <div className="bg-white p-10 rounded-xl shadow-sm border border-red-100 text-center">
        <p className="text-red-500">
          Failed to load categories. Please try again later.
        </p>
      </div>
    );
  }

  return <CategoryTreeBox initialTree={tree} />;
}

function CategorySkeleton() {
  return (
    <div className="animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-12 bg-gray-50 border border-gray-100 rounded-lg mb-2"
        ></div>
      ))}
    </div>
  );
}

export default function CategoryAdmin() {
  return (
    <div className="max-w-3xl mx-auto p-10 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ListTree className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold">Store Hierarchy</h1>
          </div>
          <p className="text-slate-500 text-sm">
            Organize your products by managing categories and sub-sections.
          </p>
        </div>

        <div className="flex gap-2">
          <AddRootButton />
        </div>
      </div>

      <Suspense fallback={<CategorySkeleton />}>
        <CategoryList />
      </Suspense>
    </div>
  );
}
