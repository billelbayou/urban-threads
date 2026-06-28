"use client";

import { AlertCircle, Plus } from "lucide-react";
import { InfoSection } from "@/types/product";
import { useProductFormStore } from "@/store/useProductFormStore";
import type { ValidationErrors } from "@/store/useProductFormStore";
import { CategoryWithChildren } from "@/types/category";
import InfoSectionInput from "./InfoSectionInput";
import TagInput from "./TagInput";
import CategorySelect from "./CategorySelect";

const MAX_SECTIONS = 8;

interface ProductFormProps {
  categoryTree: CategoryWithChildren[];
  errors: ValidationErrors | null;
}

export default function ProductForm({
  categoryTree,
  errors,
}: ProductFormProps) {
  const productName = useProductFormStore((s) => s.productName);
  const setProductName = useProductFormStore((s) => s.setProductName);
  const categoryId = useProductFormStore((s) => s.categoryId);
  const setCategoryId = useProductFormStore((s) => s.setCategoryId);
  const price = useProductFormStore((s) => s.price);
  const setPrice = useProductFormStore((s) => s.setPrice);
  const stock = useProductFormStore((s) => s.stock);
  const setStock = useProductFormStore((s) => s.setStock);
  const description = useProductFormStore((s) => s.description);
  const setDescription = useProductFormStore((s) => s.setDescription);
  const infoSections = useProductFormStore((s) => s.infoSections);
  const setInfoSections = useProductFormStore((s) => s.setInfoSections);

  const addInfoSection = () => {
    setInfoSections([...infoSections, { title: "", content: "" }]);
  };

  const removeInfoSection = (index: number) => {
    setInfoSections(infoSections.filter((_, i) => i !== index));
  };

  const updateInfoSection = (
    index: number,
    field: keyof InfoSection,
    value: string,
  ) => {
    const updated = [...infoSections];
    updated[index][field] = value;
    setInfoSections(updated);
  };

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-medium text-slate-700 mb-4">
        Product Details
      </h3>

      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Enter product name"
          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            errors?.name ? "border-red-500" : "border-slate-300"
          }`}
        />
        {errors?.name && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Category Selection */}
      <CategorySelect
        categoryId={categoryId}
        onChange={setCategoryId}
        categoryTree={categoryTree}
        error={errors?.categoryId}
      />

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Price <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500">
            $
          </span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={price}
            onChange={(e) => {
              const v = e.target.value;
              setPrice(v === "" ? "" : Number(v));
            }}
            placeholder="0.00"
            className={`w-full pl-8 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors?.price ? "border-red-500" : "border-slate-300"
            }`}
          />
        </div>
        {errors?.price && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors?.price}
          </p>
        )}
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Stock <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            min={0}
            step={1}
            value={stock}
            onChange={(e) => {
              const v = e.target.value;
              setStock(v === "" ? "" : Number(v));
            }}
            placeholder="0"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors?.stock ? "border-red-500" : "border-slate-300"
            }`}
          />
        </div>
        {errors?.stock && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors?.stock}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter product description"
          rows={4}
          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
            errors?.description ? "border-red-500" : "border-slate-300"
          }`}
        />
        {errors?.description && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors?.description}
          </p>
        )}
      </div>

      {/* Info Sections */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-slate-700">
              Additional Information <span className="text-red-500">*</span>
            </h3>
            {errors?.infoSections &&
              typeof errors.infoSections === "string" && (
                <p className="text-xs text-red-600 mt-1">
                  {errors?.infoSections}
                </p>
              )}
          </div>
          <button
            disabled={infoSections.length >= MAX_SECTIONS}
            type="button"
            onClick={addInfoSection}
            className={`text-xs font-bold flex items-center gap-1 ${
              infoSections.length >= MAX_SECTIONS
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:text-blue-700"
            }`}
          >
            <Plus size={14} /> Add Section
          </button>
        </div>

        <div className="space-y-4">
          {infoSections.map((section, index) => (
            <InfoSectionInput
              key={index}
              section={section}
              index={index}
              hasError={!!errors?.infoSections?.[index]}
              errorMessage={
                Array.isArray(errors?.infoSections) &&
                errors.infoSections[index]
                  ? `Both title and content are required for section ${index + 1}`
                  : undefined
              }
              onUpdate={updateInfoSection}
              onRemove={removeInfoSection}
              canRemove={infoSections.length > 1}
            />
          ))}
        </div>
      </div>

      {/* Tags */}
      <TagInput error={errors?.tags} />
    </div>
  );
}

