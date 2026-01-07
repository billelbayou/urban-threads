"use client";
import { useState } from "react";
import { X } from "lucide-react";
import api from "@/lib/axios";

export default function CategoryModal({
  isOpen,
  parentId,
  onClose,
  onSuccess,
}: any) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate simple slug from name
    const slug = name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    try {
      await api.post(
        "api/category",
        { name, slug, parentId },
        { withCredentials: true }
      );
      onSuccess();
      setName("");
      onClose();
    } catch (err) {
      alert("Error saving category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">
            {parentId ? "Add Subcategory" : "Add Root Category"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-full"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Category Name
          </label>
          <input
            autoFocus
            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Summer Jackets"
            required
          />

          <div className="mt-6 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
