import AddProductMain from "@/components/admin/product-admin/AddProductMain";
import { fetchCategories } from "@/lib/fetchers";
import { buildTree } from "@/utils/trees";

export default async function AddProductPage() {
  const categories = await fetchCategories();
  const tree = buildTree(categories);
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">
          Add Product
        </h1>
        <AddProductMain categoryTree={tree}/>
      </div>
    </div>
  );
}
