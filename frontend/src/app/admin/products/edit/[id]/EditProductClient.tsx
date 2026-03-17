"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/product-admin/ImageUpload";
import ProductForm from "@/components/admin/product-admin/ProductForm";
import { InfoSection, Product, ProductImage } from "@/types/product";
import { updateProductAction } from "@/services/productActions";
import { CategoryWithChildren } from "@/types/category";

interface EditProductClientProps {
  product: Product;
  categoryTree: CategoryWithChildren[];
}

export default function EditProductClient({
  product,
  categoryTree,
}: EditProductClientProps) {
  const router = useRouter();

  // Initialize state from existing product data
  const [images, setImages] = useState<ProductImage[]>(
    product.images?.map((img) => ({
      mobile: { url: img.mobile.url, path: img.mobile.path },
      desktop: { url: img.desktop.url, path: img.desktop.path },
      thumbnail: { url: img.thumbnail.url, path: img.thumbnail.path },
      url: img.url,
      path: img.path,
      original: img.original,
    })) || [],
  );
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [productName, setProductName] = useState<string>(product.name);
  const [categoryId, setCategoryId] = useState<string>(product.categoryId);
  const [price, setPrice] = useState<number | "">(product.price);
  const [stock, setStock] = useState<number | "">(product.stock);
  const [description, setDescription] = useState<string>(product.description);
  const [infoSections, setInfoSections] = useState<InfoSection[]>(
    product.infoSections?.length > 0
      ? product.infoSections
      : [{ title: "", content: "" }],
  );
  const [tags, setTags] = useState<string[]>(product.tags || []);

  const [state, formAction, isPending] = useActionState(
    updateProductAction,
    null,
  );

  const productData = useMemo(
    () => ({
      name: productName,
      categoryId,
      price: price === "" ? null : price,
      stock: stock === "" ? null : stock,
      description,
      images, // Existing images to keep
      infoSections,
      tags,
    }),
    [
      productName,
      categoryId,
      price,
      stock,
      description,
      images,
      infoSections,
      tags,
    ],
  );

  const handleSubmit = (formData: FormData) => {
    formData.set("productId", product.id as string);
    formData.set("product", JSON.stringify(productData));
    newImageFiles.forEach((file) => {
      formData.append("images", file);
    });
    formAction(formData);
  };

  useEffect(() => {
    if (state?.success) {
      // Optionally redirect or show success message
      router.push("/admin/products");
    }
  }, [state?.success, router]);

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Products</span>
      </button>

      {state?.success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{state.message}</span>
        </div>
      )}

      {state?.message && !state?.success && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">{state.message}</span>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          <div className="w-full lg:w-1/2 p-6 lg:p-8">
            <ImageUpload
              images={images}
              setImages={setImages}
              newImageFiles={newImageFiles}
              setNewImageFiles={setNewImageFiles}
            />
            {state?.fieldErrors?.images && (
              <p className="mt-3 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {state?.fieldErrors?.images}
              </p>
            )}
          </div>
          <div className="w-full lg:w-1/2 p-6 lg:p-8">
            <ProductForm
              productName={productName}
              setProductName={setProductName}
              categoryId={categoryId}
              setCategoryId={setCategoryId}
              infoSections={infoSections}
              setInfoSections={setInfoSections}
              categoryTree={categoryTree}
              price={price}
              setPrice={setPrice}
              stock={stock}
              setStock={setStock}
              description={description}
              setDescription={setDescription}
              tags={tags}
              setTags={setTags}
              errors={state?.success ? null : (state?.fieldErrors ?? null)}
            />
          </div>
        </div>

        <div className="border-t border-gray-200 bg-slate-50 px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              <span className="text-red-500">*</span> Required fields
            </p>
            <form action={handleSubmit}>
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating Product...
                  </>
                ) : (
                  "Update Product"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
