"use client";

import { UploadedImage } from "@/types/product";
import { Upload, X, CheckCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { uploadImage } from "@/lib/fetchers";

interface ImageUploadProps {
  images: UploadedImage[];
  setImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
}

export default function ImageUpload({ images, setImages }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        // Upload file directly to backend (which will upload to Supabase via multer)
        const result = await uploadImage(file, "products");

        setImages((prev) => [...prev, { url: result.url, path: result.path }]);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (path: string) => {
    setImages((prev) => prev.filter((img) => img.path !== path));
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-slate-700 mb-4">
        Product Images
      </h3>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200
          ${
            isUploading
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-blue-500 hover:bg-blue-50"
          }
        `}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-blue-100 rounded-full">
            {isUploading ? (
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            ) : (
              <Upload className="w-10 h-10 text-blue-600" />
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-700">
              {isUploading ? "Uploading..." : "Click to upload or drag & drop"}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              PNG, JPG, GIF, WebP up to 10MB
            </p>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="text-sm font-medium text-slate-700">
            Uploaded Images ({images.length})
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {images.map((img) => (
              <div
                key={img.path}
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
                    onClick={() => handleRemove(img.path)}
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
