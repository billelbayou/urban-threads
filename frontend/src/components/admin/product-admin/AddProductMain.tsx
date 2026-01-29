"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { buildTree } from "@/utils/trees";
import { fetchCategories } from "@/lib/fetchers";
import ImageUpload from "@/components/admin/product-admin/ImageUpload";
import ProductForm from "@/components/admin/product-admin/ProductForm";
import { UploadedImage, InfoSection, Tag } from "@/types/product";
import { CreateProductAction } from "@/services/productActions";

export default function AddProductMain({categoryTree}: {categoryTree: any[]}) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [productName, setProductName] = useState<string>("");

  const [categoryId, setCategoryId] = useState<string>("");

  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [infoSections, setInfoSections] = useState<InfoSection[]>([
    { title: "", content: "" },
  ]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [state, formAction, isPending] = useActionState(
    CreateProductAction,
    null,
  );

  const product = {
    name: productName,
    categoryId,
    price: parseFloat(price),
    stock: parseInt(stock, 10),
    description,
    images,
    infoSections,
    tags,
  };

  return (
    <div>
      {state?.success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{state.data}</span>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          <div className="w-full lg:w-1/2 p-6 lg:p-8">
            <ImageUpload images={images} setImages={setImages} />
            {state?.errors && (
              <p className="mt-3 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {state?.errors?.images}
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
              errors={state?.success ? null : (state?.errors ?? null)}
            />
          </div>
        </div>

        <div className="border-t border-gray-200 bg-slate-50 px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              <span className="text-red-500">*</span> Required fields
            </p>
            <form action={formAction}>
              <input
                type="hidden"
                name="product"
                value={JSON.stringify(product)}
              />
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding Product...
                  </>
                ) : (
                  "Add Product"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
