"use client";

import { UploadedImage } from "@/types/product";
import { Upload, X, CheckCircle } from "lucide-react";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import Image from "next/image";
import React from "react";

interface ImageUploadProps {
  images: UploadedImage[];
  setImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
}

export default function ImageUpload({ images, setImages }: ImageUploadProps) {
  const handleRemove = (publicId: string) => {
    setImages((prev) => prev.filter((img) => img.public_id !== publicId));
  };

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
        onSuccess={(result: CloudinaryUploadWidgetResults) => {
          const info: UploadedImage = result.info as UploadedImage;
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
