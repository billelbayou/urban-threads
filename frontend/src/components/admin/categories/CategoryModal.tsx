"use client";

import { useActionState, useEffect } from "react";
import { X, FolderPlus, Subtitles, Layers } from "lucide-react";
import { CreateCategoryAction } from "@/services/categoriesAction";
import { toast } from "sonner";

export default function CategoryModal({
  isOpen,
  parentId,
  onClose,
}: {
  isOpen: boolean;
  parentId: string | null;
  onClose: () => void;
}) {
  const [state, formAction, isPending] = useActionState(
    CreateCategoryAction,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Category created successfully");
      onClose();
    } else if (state?.error) {
      toast.error(state.error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (!isOpen) return null;

  const isSubcategory = !!parentId;

  // Root: Blue | Sub: Indigo
  const themeColor = isSubcategory ? "text-indigo-600" : "text-blue-600";
  const bgColor = isSubcategory ? "bg-indigo-50" : "bg-blue-50";
  const btnColor = isSubcategory
    ? "bg-indigo-600 hover:bg-indigo-700"
    : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        {/* Header Section */}
        <div
          className={`p-5 border-b flex justify-between items-center ${bgColor}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-white shadow-sm ${themeColor}`}>
              {isSubcategory ? <Layers size={20} /> : <FolderPlus size={20} />}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 leading-tight">
                {isSubcategory ? "New Subcategory" : "New Root Category"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isSubcategory
                  ? "Nesting under parent"
                  : "Creating a top-level category"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Section */}
        <form
          action={formAction}
          className="p-6 space-y-6"
          key={String(isOpen)}
        >
          <div>
            <label
              htmlFor="categoryName"
              className="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Category Name
            </label>
            <div className="relative">
              <input
                type="text"
                autoComplete="off"
                id="categoryName"
                autoFocus
                name="name"
                className={`w-full border border-slate-200 rounded-xl p-3 pl-10 outline-none transition-all ring-offset-2 focus:ring-2 ${
                  isSubcategory
                    ? "focus:border-indigo-500 focus:ring-indigo-500/20"
                    : "focus:border-blue-500 focus:ring-blue-500/20"
                }`}
                placeholder={isSubcategory ? "e.g. Slim Fit" : "e.g. Menswear"}
                required
              />
              <Subtitles
                className="absolute left-3 top-3.5 text-slate-400"
                size={18}
              />
            </div>
          </div>

          {parentId && <input type="hidden" name="parentId" value={parentId} />}

          <div className="pt-2 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-500 hover:text-slate-700 font-semibold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-md transition-all active:scale-95 disabled:opacity-70 ${btnColor}`}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : isSubcategory ? (
                "Create Subcategory"
              ) : (
                "Create Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
