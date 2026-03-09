import { X } from "lucide-react";
import { InfoSection } from "@/types/product";

interface InfoSectionInputProps {
  section: InfoSection;
  index: number;
  hasError: boolean;
  errorMessage?: string;
  onUpdate: (index: number, field: keyof InfoSection, value: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export default function InfoSectionInput({
  section,
  index,
  hasError,
  errorMessage,
  onUpdate,
  onRemove,
  canRemove,
}: InfoSectionInputProps) {
  return (
    <div className="space-y-2">
      <div
        className={`p-4 bg-slate-50 rounded-xl border relative group transition-all ${
          hasError ? "border-red-300" : "border-slate-200"
        }`}
      >
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute -top-2 -right-2 bg-white border border-slate-200 text-slate-400 hover:text-red-500 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        )}

        <input
          placeholder="Section Title (e.g., Care Instructions)"
          className="w-full bg-transparent font-semibold text-sm mb-2 outline-none border-b border-transparent focus:border-blue-300 pb-1"
          value={section.title}
          onChange={(e) => onUpdate(index, "title", e.target.value)}
        />
        <textarea
          placeholder="Content..."
          rows={2}
          className="w-full bg-transparent text-sm outline-none resize-none"
          value={section.content}
          onChange={(e) => onUpdate(index, "content", e.target.value)}
        />
      </div>

      {errorMessage && (
        <p className="text-[10px] text-red-500 font-medium px-2">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
