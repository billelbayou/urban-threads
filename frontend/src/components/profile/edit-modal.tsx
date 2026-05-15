"use client";

import { useState } from "react";
import { X } from "lucide-react";

export interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "tel" | "date" | "select";
  options?: string[];
}

export function EditModal({
  title,
  fields,
  values,
  pending,
  onSave,
  onClose,
}: {
  title: string;
  fields: FieldConfig[];
  values: Record<string, string>;
  pending?: boolean;
  onSave: (values: Record<string, string>) => void;
  onClose: () => void;
}) {
  const [formValues, setFormValues] = useState(values);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Edit {title}</h2>
          <button
            onClick={onClose}
            className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-400">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  value={formValues[field.key]}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      [field.key]: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                >
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt || "Select..."}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={formValues[field.key]}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      [field.key]: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={pending}
            className="cursor-pointer rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formValues)}
            disabled={pending}
            className="cursor-pointer rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
