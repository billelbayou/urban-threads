"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import CategoryModal from "@/components/admin/categories/CategoryModal";

export default function AddRootButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800
          text-white px-4 py-2 rounded-lg text-sm font-semibold"
      >
        <Plus size={18} /> New Root
      </button>

      <CategoryModal
        isOpen={open}
        parentId={null}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
