import { Product } from "@/types/product";
import { FiEdit, FiPackage, FiImage } from "react-icons/fi";
import Link from "next/link";
import ProductDeleteButton from "./ProductDeleteButton";

const ProductTable = ({ products }: { products: Product[] }) => {
  return (
    <div className="mt-4 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="pb-4 pt-0 font-medium text-slate-400 text-sm">Product</th>
              <th className="pb-4 pt-0 font-medium text-slate-400 text-sm">Price</th>
              <th className="pb-4 pt-0 font-medium text-slate-400 text-sm">Stock</th>
              <th className="pb-4 pt-0 font-medium text-slate-400 text-sm">Category</th>
              <th className="pb-4 pt-0 font-medium text-slate-400 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {products.map((product) => (
              <tr key={product.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 shrink-0 relative bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={
                            product.images[0].thumbnail?.url ||
                            product.images[0].url
                          }
                          alt={product.name}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-300">
                          <FiImage size={24} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                        {product.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        ID: {product.id?.slice(-8).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-4 whitespace-nowrap">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </td>

                <td className="py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <div className={`h-1.5 w-1.5 rounded-full ${Number(product.stock) > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                      {product.stock} in stock
                    </span>
                  </div>
                </td>

                <td className="py-4 whitespace-nowrap">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {product.category?.name || "Uncategorized"}
                  </span>
                </td>

                <td className="py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all"
                    >
                      <FiEdit size={18} />
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
