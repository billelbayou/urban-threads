"use client";

import { Pencil } from "lucide-react";

export function SectionCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="group mb-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_1px_6px_0_rgba(0,0,0,0.04)] sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight text-gray-900">
          {title}
        </h2>
        <button
          onClick={onEdit}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-gray-100 px-4 py-1.5 text-sm font-semibold text-gray-700 transition-all duration-150 hover:bg-gray-900 hover:text-white"
        >
          <Pencil size={13} />
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}
