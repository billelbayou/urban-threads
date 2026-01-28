"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { buildTree } from "@/utils/trees";
import { createProduct, fetchCategories } from "@/lib/fetchers";
import ImageUpload from "@/components/admin/product-admin/ImageUpload";
import ProductForm from "@/components/admin/product-admin/ProductForm";
import {
  UploadedImage,
  FormErrors,
  Tag,
  InfoSection,
} from "@/components/admin/products/types";
import { Product } from "@/types/types";

export default function AddProduct() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [productName, setProductName] = useState<string>("");

  const [categoryId, setCategoryId] = useState<string>("");
  const [categoryTree, setCategoryTree] = useState<any[]>([]);

  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [infoSections, setInfoSections] = useState<InfoSection[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        const tree = buildTree(data);
        setCategoryTree(tree);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    loadCategories();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!productName.trim()) newErrors.name = "Product name is required";
    if (!categoryId) newErrors.categoryId = "Category selection is required";
    if (!price || parseFloat(price) <= 0)
      newErrors.price = "Valid price is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (images.length === 0)
      newErrors.images = "At least one product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSuccessMessage("");
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const productData: any = {
        name: productName,
        categoryId: categoryId,
        price: parseFloat(price),
        description,
        infoSections: infoSections,
        tags: tags.map((t) => t.label),
        images: images.map((img) => ({
          url: img.secure_url,
          public_id: img.public_id,
        })),
        stock: 0,
      };

      await createProduct(productData as Product);

      setSuccessMessage("Product added successfully!");

      setTimeout(() => {
        setProductName("");
        setCategoryId("");
        setPrice("");
        setDescription("");
        setTags([]);
        setImages([]);
        setErrors({});
        setSuccessMessage("");
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting product:", error);
      if (error.response?.data?.error) {
        alert(`Error: ${JSON.stringify(error.response.data.error)}`);
      } else {
        alert(error.message || "Failed to add product. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">
          Add Product
        </h1>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            <div className="w-full lg:w-1/2 p-6 lg:p-8">
              <ImageUpload images={images} setImages={setImages} />
              {errors.images && (
                <p className="mt-3 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.images}
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
                description={description}
                setDescription={setDescription}
                tags={tags}
                setTags={setTags}
                errors={errors}
              />
            </div>
          </div>

          <div className="border-t border-gray-200 bg-slate-50 px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                <span className="text-red-500">*</span> Required fields
              </p>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding Product...
                  </>
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
