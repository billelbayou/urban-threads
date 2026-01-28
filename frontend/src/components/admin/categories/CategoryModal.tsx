"use client";

import { useActionState, useEffect } from "react";
import { X } from "lucide-react";
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
  }, [state]);
  if (!isOpen) return null;
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

        <form action={formAction} className="p-6" key={String(isOpen)}>
          <label
            htmlFor="categoryName"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Category Name
          </label>
          <input
            type="text"
            autoComplete="off"
            id="categoryName"
            autoFocus
            name="name"
            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="e.g. Summer Jackets"
            required
          />
          {parentId && <input type="hidden" name="parentId" value={parentId} />}

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
              disabled={isPending}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
