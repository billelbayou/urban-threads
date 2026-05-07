import { Product } from "@/types/product";
import { FiEdit, FiImage } from "react-icons/fi";
import Link from "next/link";
import ProductDeleteButton from "./ProductDeleteButton";

const ProductTable = ({ products }: { products: Product[] }) => {
  return (
    <div className="mt-4 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 pt-0 font-medium text-gray-500 text-xs uppercase tracking-wider">Product</th>
              <th className="pb-3 pt-0 font-medium text-gray-500 text-xs uppercase tracking-wider">Price</th>
              <th className="pb-3 pt-0 font-medium text-gray-500 text-xs uppercase tracking-wider">Stock</th>
              <th className="pb-3 pt-0 font-medium text-gray-500 text-xs uppercase tracking-wider">Category</th>
              <th className="pb-3 pt-0 font-medium text-gray-500 text-xs uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="group hover:bg-gray-50 transition-colors">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={
                            product.images[0].thumbnail?.url ||
                            product.images[0].url
                          }
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-300">
                          <FiImage size={18} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm line-clamp-1">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {product.id?.slice(-8).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-3 whitespace-nowrap">
                  <span className="font-medium text-gray-900 text-sm">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </td>

                <td className="py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <div className={`h-1.5 w-1.5 rounded-full ${
                      Number(product.stock) === 0
                        ? "bg-red-500"
                        : Number(product.stock) <= 10
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`} />
                    <span className="text-sm text-gray-600">
                      {Number(product.stock) === 0 ? "Out of stock" : `${product.stock} in stock`}
                    </span>
                  </div>
                </td>

                <td className="py-3 whitespace-nowrap">
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                    {product.category?.name || "Uncategorized"}
                  </span>
                </td>

                <td className="py-3 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FiEdit size={16} />
                    </Link>
                    <ProductDeleteButton productId={product.id!} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
