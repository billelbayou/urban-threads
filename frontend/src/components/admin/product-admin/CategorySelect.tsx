import { ChevronDown, AlertCircle } from "lucide-react";
import { CategoryWithChildren } from "@/types/category";
import { flattenCategories } from "@/utils/helpers";

interface CategorySelectProps {
  categoryId: string;
  onChange: (value: string) => void;
  categoryTree: CategoryWithChildren[];
  error?: string[];
}

export default function CategorySelect({
  categoryId,
  onChange,
  categoryTree,
  error,
}: CategorySelectProps) {
  const flatCategories = flattenCategories(categoryTree);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Category *
      </label>
      <div className="relative">
        <select
          value={categoryId}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-2.5 border rounded-lg appearance-none bg-white text-sm ${
            error ? "border-red-500" : "border-slate-300"
          }`}
        >
          <option value="">Select a category</option>
          {flatCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error[0]}
        </p>
      )}
    </div>
  );
}
