import { Product } from "@/types/product";
import AddToCartForm from "./AddToCartForm";
import ExpandableSections from "./ExpandableSections";

type Props = {
  product: Product;
};

export default function ProductDetails({ product }: Props) {
  return (
    <div className="px-2 sm:px-0 py-4">
      <h1 className="text-2xl sm:text-3xl font-semibold">{product.name}</h1>

      <p className="text-sm text-gray-500 mt-1 capitalize">
        {product.category.name}
      </p>

      <p className="text-gray-600 mt-2 text-sm sm:text-base">
        {product.description}
      </p>

      <p className="text-xl sm:text-2xl font-semibold mt-4">${product.price}</p>

      <AddToCartForm product={product} />
      <ExpandableSections product={product} />
    </div>
  );
}
