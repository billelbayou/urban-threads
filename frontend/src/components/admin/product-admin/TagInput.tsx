import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { Tag } from "@/types/product";

interface TagInputProps {
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  error?: string[];
}

export default function TagInput({ tags, setTags, error }: TagInputProps) {
  const [tagInput, setTagInput] = useState<string>("");

  const addTag = (label: string) => {
    if (
      label.trim() &&
      !tags.find((tag) => tag.label.toLowerCase() === label.toLowerCase())
    ) {
      setTags([...tags, { id: crypto.randomUUID(), label: label.trim() }]);
      setTagInput("");
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Tags <span className="text-red-500">*</span>
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
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag(tagInput);
          }
        }}
        placeholder="Type a tag and press Enter"
        className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-slate-300"
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error[0]}
        </p>
      )}
    </div>
  );
}
