"use client";

import { useActionState, useEffect } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import ImageUpload from "@/components/admin/product-admin/ImageUpload";
import ProductForm from "@/components/admin/product-admin/ProductForm";
import { useProductFormStore } from "@/store/useProductFormStore";
import { createProductAction } from "@/services/productActions";
import { CategoryWithChildren } from "@/types/category";

export default function AddProductMain({
  categoryTree,
}: {
  categoryTree: CategoryWithChildren[];
}) {
  const reset = useProductFormStore((s) => s.reset);
  const getFormData = useProductFormStore((s) => s.getFormData);
  const newImageFiles = useProductFormStore((s) => s.newImageFiles);
  const images = useProductFormStore((s) => s.images);

  const [state, formAction, isPending] = useActionState(
    createProductAction,
    null,
  );

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    if (state?.success) {
      reset();
    }
  }, [state?.success, reset]);

  const handleSubmit = (formData: FormData) => {
    formData.set("product", JSON.stringify(getFormData()));
    newImageFiles.forEach((file) => {
      formData.append("images", file);
    });
    formAction(formData);
  };

  return (
    <div>
      {state?.success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{state.message}</span>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          <div className="w-full lg:w-1/2 p-6 lg:p-8">
            <ImageUpload />
            {state?.fieldErrors?.images && (
              <p className="mt-3 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {state?.fieldErrors?.images}
              </p>
            )}
          </div>
          <div className="w-full lg:w-1/2 p-6 lg:p-8">
            <ProductForm
              categoryTree={categoryTree}
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
