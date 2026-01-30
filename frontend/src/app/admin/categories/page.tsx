import { buildTree } from "@/utils/helpers";
import { fetchCategories } from "@/lib/fetchers";
import AddRootButton from "@/components/admin/categories/AddRootButton";
import CategoryTreeBox from "@/components/admin/categories/CategoryTreeBox";
import { ListTree } from "lucide-react";
import { Category, CategoryWithChildren } from "@/types/category";

export default async function CategoryAdmin() {
  const categories: Category[] = await fetchCategories();
  const tree: CategoryWithChildren[] = buildTree(categories);

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

      {/* Tree Box */}
      <CategoryTreeBox initialTree={tree} />
    </div>
  );
}
