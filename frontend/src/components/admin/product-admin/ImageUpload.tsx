"use client";

import { UploadedImage } from "@/types/product";
import { Upload, X, CheckCircle } from "lucide-react";
import Image from "next/image";
import React, { useRef } from "react";

interface ImageUploadProps {
  images: UploadedImage[];
  setImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  newImageFiles: File[];
  setNewImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function ImageUpload({
  images,
  setImages,
  newImageFiles,
  setNewImageFiles,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    setNewImageFiles((prev) => [...prev, ...fileList]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveExisting = (path: string) => {
    setImages((prev) =>
      prev.filter((img) => (img.thumbnail?.path || img.path) !== path),
    );
  };

  const handleRemoveNew = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClick = () => {
    fileInputRef.current?.click();
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
        className="relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 hover:border-blue-500 hover:bg-blue-50"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-blue-100 rounded-full">
            <Upload className="w-10 h-10 text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-700">
              Click to upload or drag & drop
            </p>
            <p className="text-sm text-slate-500 mt-1">
              PNG, JPG, GIF, WebP up to 10MB
            </p>
          </div>
        </div>
      </div>

      {(images.length > 0 || newImageFiles.length > 0) && (
        <div className="mt-6 space-y-4">
          <h4 className="text-sm font-medium text-slate-700">
            Selected Images ({images.length + newImageFiles.length})
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {/* Existing Images */}
            {images.map((img) => {
              const currentPath = img.thumbnail?.path || img.path || "";
              const currentUrl = img.thumbnail?.url || img.url || "";
              return (
                <div
                  key={currentPath}
                  className="relative group bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={currentUrl}
                      alt="Product image"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <button
                      onClick={() => handleRemoveExisting(currentPath)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
                      type="button"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-blue-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Existing</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* New Image Files */}
            {newImageFiles.map((file, index) => (
              <div
                key={index}
                className="relative group bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm"
              >
                <div className="aspect-square relative">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="New product image"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <button
                    onClick={() => handleRemoveNew(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
                    type="button"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-green-600">
                    <Upload className="w-4 h-4" />
                    <span>New</span>
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
