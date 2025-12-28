"use client";

import { useState, useRef } from "react";
import { Upload, X, CheckCircle, FileImage } from "lucide-react";

interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "completed";
  preview: string;
}

export default function ImageUpload() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const processFiles = (newFiles: File[]) => {
    const fileObjects: UploadFile[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: "uploading" as const,
      preview: URL.createObjectURL(file),
    }));

    setFiles((prev) => [...prev, ...fileObjects]);

    fileObjects.forEach((fileObj) => {
      simulateUpload(fileObj.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, progress: 100, status: "completed" as const }
              : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress: Math.floor(progress) } : f
          )
        );
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="min-h-screen border rounded-lg shadow-sm m-8 border-gray-200 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="block text-sm font-medium text-slate-700 mb-2">
          Add Image
        </h2>
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
            transition-all duration-200 ease-in-out
            ${
              isDragging
                ? "border-blue-500 bg-blue-50 scale-105"
                : "border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50"
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-4">
            <div
              className={`
              p-4 rounded-full transition-colors
              ${isDragging ? "bg-blue-100" : "bg-slate-100"}
            `}
            >
              <Upload
                className={`w-12 h-12 ${
                  isDragging ? "text-blue-600" : "text-slate-400"
                }`}
              />
            </div>

            <div>
              <p className="text-lg font-semibold text-slate-700 mb-1">
                {isDragging
                  ? "Drop your images here"
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-sm text-slate-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Uploading{" "}
              {files.filter((f) => f.status === "uploading").length > 0
                ? `(${files.filter((f) => f.status === "uploading").length})`
                : "Complete"}
            </h2>

            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileImage className="w-8 h-8 text-slate-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">
                          {file.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">
                          {file.status === "completed"
                            ? "Complete"
                            : `${file.progress}%`}
                        </span>
                        {file.status === "completed" && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            file.status === "completed"
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
