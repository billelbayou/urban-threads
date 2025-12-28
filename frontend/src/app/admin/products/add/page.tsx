import ProductForm from "@/components/ProductForm";
import ImageUpload from "@/components/Uploader";

export default function AddProduct() {
  return (
    <div>
      <h2 className="block text-lg font-medium text-slate-700 mb-2">
        Add Product
      </h2>
      <div className="border border-gray-200 rounded-2xl flex">
        <div className="w-1/2">
          <ImageUpload />
        </div>
        <ProductForm />
      </div>
    </div>
  );
}
