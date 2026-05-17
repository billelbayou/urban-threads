import { Product } from "@/types/product";
import AddToCartForm from "./AddToCartForm";
import ExpandableSections from "./ExpandableSections";

type Props = {
  product: Product;
};

export default function ProductDetails({ product }: Props) {
  return (
    <div className="px-2 sm:px-0 py-4">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          {product.name}
        </h1>

        <div className="flex items-center gap-3 mt-2">
          <p className="text-sm text-gray-500 capitalize">
            {product.category?.name}
          </p>
          {product.tags && product.tags.length > 0 && (
            <>
              <span className="text-gray-300">•</span>
              <div className="flex flex-wrap gap-1">
                {product.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="py-4">
        <p className="text-gray-600 mt-2 text-sm sm:text-base leading-relaxed">
          {product.description}
        </p>
      </div>

      <div className="py-4 border-b border-gray-200">
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">
          ${Number(product.price).toFixed(2)}
        </p>
        {product.stock !== undefined && (
          <p
            className={`text-sm mt-1 ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
        )}
      </div>

      <AddToCartForm product={product} />

      {product.infoSections && product.infoSections.length > 0 && (
        <div className="mt-8 pt-4 border-t border-gray-200">
          <ExpandableSections product={product} />
        </div>
      )}
    </div>
  );
}
