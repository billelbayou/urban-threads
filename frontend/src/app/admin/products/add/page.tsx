"use client";

import { useEffect, useState } from "react";
import {
  Upload,
  X,
  CheckCircle,
  ChevronDown,
  AlertCircle,
  Plus,
} from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import api from "@/lib/axios";
import React from "react";
import { buildTree } from "@/utils/trees";
interface InfoSection {
  title: string;
  content: string;
}

// Update FormErrors to include categoryId
interface FormErrors {
  name?: string;
  categoryId?: string;
  price?: string;
  description?: string;
  images?: string;
}

interface UploadedImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  url: string;
  thumbnail_url: string;
}

interface Tag {
  id: string;
  label: string;
}

interface FormErrors {
  name?: string;
  category?: string;
  subCategory?: string;
  price?: string;
  description?: string;
  images?: string;
}

function ImageUpload({
  images,
  setImages,
}: {
  images: UploadedImage[];
  setImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
}) {
  const handleRemove = (publicId: string) => {
    setImages((prev) => prev.filter((img) => img.public_id !== publicId));
  };
  console.log(images);
  return (
    <div>
      <h3 className="text-sm font-medium text-slate-700 mb-4">
        Product Images
      </h3>

      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
        options={{
          multiple: true,
          maxFiles: 10,
          cropping: false,
          sources: ["local", "url", "camera"],
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#94A3B8",
              tabIcon: "#3B82F6",
              textDark: "#1E293B",
              textLight: "#FFFFFF",
              inactiveTabIcon: "#64748B",
              action: "#3B82F6",
              inProgress: "#3B82F6",
              complete: "#10B981",
              error: "#EF4444",
            },
            fonts: {
              default: null,
              "'Inter', sans-serif": {
                url: "https://fonts.googleapis.com/css?family=Inter",
                active: true,
              },
            },
          },
        }}
        onSuccess={(result: any) => {
          // This fires for EACH uploaded image when multiple=true
          const info = result.info as UploadedImage;
          if (info) {
            setImages((prev) => [...prev, info]);
          }
        }}
      >
        {({ open, isLoading }) => (
          <div
            onClick={() => !isLoading && open()}
            className={`
              relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
              transition-all duration-200
              ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-blue-500 hover:bg-blue-50"
              }
            `}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <Upload className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-700">
                  {isLoading
                    ? "Uploading..."
                    : "Click to upload or drag & drop"}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  PNG, JPG, GIF, WebP up to 10MB
                </p>
              </div>
            </div>
          </div>
        )}
      </CldUploadWidget>

      {images.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="text-sm font-medium text-slate-700">
            Uploaded Images ({images.length})
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {images.map((img) => (
              <div
                key={img.public_id}
                className="relative group bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm"
              >
                <div className="aspect-square relative">
                  <Image
                    src={img.url}
                    alt="Product image"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <button
                    onClick={() => handleRemove(img.public_id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
                    type="button"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Uploaded</span>
                  </div>
                  <span className="text-slate-500">
                    {(img.bytes / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductForm({
  productName,
  setProductName,
  categoryId, // Changed: now a single ID
  setCategoryId, // Changed: single setter
  price,
  setPrice,
  description,
  setDescription,
  tags,
  setTags,
  infoSections, // Added
  setInfoSections, // Added
  errors,
  categoryTree, // Added: Pass the built tree from the parent
}: {
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
}) {
  const [tagInput, setTagInput] = useState<string>("");

  const getCategoryPath = (
    nodes: any[],
    targetId: string,
    path: string[] = []
  ): string[] | null => {
    for (const node of nodes) {
      const currentPath = [...path, node.name];
      if (node.id === targetId) return currentPath;
      if (node.children) {
        const found = getCategoryPath(node.children, targetId, currentPath);
        if (found) return found;
      }
    }
    return null;
  };

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

  // Recursive helper to render indented <option> tags
  const renderOptions = (nodes: any[], level = 0) => {
    return nodes.map((node) => (
      <React.Fragment key={node.id}>
        <option value={node.id} className={level === 0 ? "font-bold" : ""}>
          {"\u00A0".repeat(level * 3)} {level > 0 ? "— " : ""}
          {node.name}
        </option>
        {node.children && renderOptions(node.children, level + 1)}
      </React.Fragment>
    ));
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

export default function AddProduct() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [productName, setProductName] = useState<string>("");

  // LOGIC CHANGE: We now use a single categoryId instead of category & subCategory strings
  const [categoryId, setCategoryId] = useState<string>("");
  const [categoryTree, setCategoryTree] = useState<any[]>([]);

  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [infoSections, setInfoSections] = useState<InfoSection[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // FETCH LOGIC: Get real categories from backend on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/category");
        const tree = buildTree(res.data);
        setCategoryTree(tree);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!productName.trim()) newErrors.name = "Product name is required";

    // LOGIC CHANGE: Validate the single categoryId
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
      const productData = {
        name: productName,
        // LOGIC CHANGE: Send the UUID categoryId directly to the backend
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

      await api.post("/api/products", productData, {
        withCredentials: true,
      });

      setSuccessMessage("Product added successfully!");

      setTimeout(() => {
        setProductName("");
        setCategoryId(""); // Reset categoryId
        setPrice("");
        setDescription("");
        setTags([]);
        setImages([]);
        setErrors({});
        setSuccessMessage("");
      }, 2000);
    } catch (error: any) {
      // Error handling remains the same as per your UI requirements
      console.error("Error submitting product:", error);
      if (error.response?.data?.error) {
        alert(`Error: ${JSON.stringify(error.response.data.error)}`);
      } else {
        alert("Failed to add product. Please try again.");
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
                // LOGIC CHANGE: Pass the tree and the unified category state
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
