import EditProductClient from "./EditProductClient";
import { fetchProductById } from "@/services/api/product";
import { fetchCategories } from "@/services/api/category";
import { buildTree } from "@/utils/helpers";
import { Category, CategoryWithChildren } from "@/types/category";
import getCookies from "@/utils/cookies";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  let product: any = null;
  let tree: CategoryWithChildren[] = [];
  let error: string | null = null;

  try {
    const cookies = await getCookies();
    // Fetch product and categories in parallel
    const [productData, categories]: [any, Category[]] = await Promise.all([
      fetchProductById(id, cookies),
      fetchCategories(cookies),
    ]);
    product = productData;
    tree = buildTree(categories);
  } catch (err) {
    console.error(
      `Failed to fetch data for Edit Product page (id: ${id}):`,
      err,
    );
    error = "Failed to load product details. Please try again later.";
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">
          Edit Product
        </h1>

        {error ? (
          <div className="bg-white p-10 rounded-xl shadow-sm border border-red-100 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <EditProductClient product={product} categoryTree={tree} />
        )}
      </div>
    </div>
  );
}
