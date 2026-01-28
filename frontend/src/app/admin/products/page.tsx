import { FiPlus } from "react-icons/fi";
import ProductTable from "@/components/admin/product-admin/ProductTable";
import Link from "next/link";
import { fetchProducts } from "@/lib/fetchers";
import { Product } from "@/types/product";

export default async function Products() {
  const products: Product[] = await fetchProducts();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
        <div className="flex gap-2">
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
        <ProductTable products={products} />
      </div>
    </>
  );
}
