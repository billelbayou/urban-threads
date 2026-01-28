"use client";

import React, { useState } from "react";
import { AlertCircle, ChevronDown, Plus, X } from "lucide-react";
import { FormErrors, InfoSection, Tag } from "./types";

interface ProductFormProps {
  productName: string;
  setProductName: React.Dispatch<React.SetStateAction<string>>;
  categoryId: string;
  setCategoryId: React.Dispatch<React.SetStateAction<string>>;
  price: string;
  setPrice: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  errors: FormErrors;
  infoSections: InfoSection[];
  setInfoSections: React.Dispatch<React.SetStateAction<InfoSection[]>>;
  categoryTree: any[]; // Array of CategoryWithChildren
}

export default function ProductForm({
  productName,
  setProductName,
  categoryId,
  setCategoryId,
  price,
  setPrice,
  description,
  setDescription,
  tags,
  setTags,
  infoSections,
  setInfoSections,
  errors,
  categoryTree,
}: ProductFormProps) {
  const [tagInput, setTagInput] = useState<string>("");

  const flattenCategories = (
    nodes: any[],
    path: string[] = []
  ): { id: string; label: string }[] => {
    let results: { id: string; label: string }[] = [];
    nodes.forEach((node) => {
      const currentPath = [...path, node.name];
      results.push({ id: node.id, label: currentPath.join(" > ") });
      if (node.children) {
        results = [
          ...results,
          ...flattenCategories(node.children, currentPath),
        ];
      }
    });
    return results;
  };

  const addInfoSection = () => {
    setInfoSections([...infoSections, { title: "", content: "" }]);
  };

  const removeInfoSection = (index: number) => {
    setInfoSections(infoSections.filter((_, i) => i !== index));
  };

  const updateInfoSection = (
    index: number,
    field: keyof InfoSection,
    value: string
  ) => {
    const updated = [...infoSections];
    updated[index][field] = value;
    setInfoSections(updated);
  };

  const addTag = (label: string) => {
    if (
      label.trim() &&
      !tags.find((tag) => tag.label.toLowerCase() === label.toLowerCase())
    ) {
      setTags([
        ...tags,
        { id: Math.random().toString(36).substr(2, 9), label: label.trim() },
      ]);
      setTagInput("");
    }
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
            errors.name ? "border-red-500" : "border-slate-300"
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Unified Category Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Category *
        </label>
        <div className="relative">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg appearance-none bg-white text-sm ${
              errors.categoryId ? "border-red-500" : "border-slate-300"
            }`}
          >
            <option value="">Select a category</option>
            {flattenCategories(categoryTree).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.categoryId}
          </p>
        )}
      </div>

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
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0.00"
            className={`w-full pl-8 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.price ? "border-red-500" : "border-slate-300"
            }`}
          />
        </div>
        {errors.price && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.price}
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
            errors.description ? "border-red-500" : "border-slate-300"
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.description}
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-700">
            Additional Information
          </h3>
          <button
            type="button"
            onClick={addInfoSection}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Plus size={14} /> Add Section
          </button>
        </div>

        <div className="space-y-4">
          {infoSections.map((section, index) => (
            <div
              key={index}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative group"
            >
              <button
                onClick={() => removeInfoSection(index)}
                className="absolute -top-2 -right-2 bg-white border border-slate-200 text-slate-400 hover:text-red-500 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
              <input
                placeholder="Section Title (e.g., Care Instructions)"
                className="w-full bg-transparent font-semibold text-sm mb-2 outline-none border-b border-transparent focus:border-blue-300 pb-1"
                value={section.title}
                onChange={(e) =>
                  updateInfoSection(index, "title", e.target.value)
                }
              />
              <textarea
                placeholder="Content..."
                rows={2}
                className="w-full bg-transparent text-sm outline-none resize-none"
                value={section.content}
                onChange={(e) =>
                  updateInfoSection(index, "content", e.target.value)
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-full text-sm font-medium"
            >
              {tag.label}
              <button
                onClick={() => setTags(tags.filter((t) => t.id !== tag.id))}
                type="button"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addTag(tagInput))
          }
          placeholder="Type a tag and press Enter"
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm"
        />
      </div>
    </div>
  );
}
