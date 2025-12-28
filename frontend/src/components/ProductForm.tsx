"use client"

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";

interface Tag {
  id: string;
  label: string;
}

export default function ProductForm() {
  const [productName, setProductName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState<string>("");

  const categories = ["Men", "Women", "Kids", "Unisex"];
  const subCategories = ["Shoe", "Clothing", "Accessories", "Sports"];

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

  const removeTag = (id: string) => {
    setTags(tags.filter((tag) => tag.id !== id));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  return (
    <div className="p-8 flex-1">
      <div className="bg-white border rounded-lg shadow-sm border-gray-200 p-8">
        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Product Name
            </label>
            <input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-slate-700"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Sub Category */}
          <div>
            <label
              htmlFor="subCategory"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Sub Category
            </label>
            <div className="relative">
              <select
                id="subCategory"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-slate-700"
              >
                <option value="">Select sub category</option>
                {subCategories.map((subCat) => (
                  <option key={subCat} value={subCat}>
                    {subCat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500">
                $
              </span>
              <input
                id="price"
                type="text"
                value={price}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, "");
                  setPrice(value);
                }}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={5}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium"
                >
                  {tag.label}
                  <button
                    onClick={() => removeTag(tag.id)}
                    className="hover:bg-blue-600 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Type a tag and press Enter"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="button"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
