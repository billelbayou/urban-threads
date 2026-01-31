"use client";

import { useState } from "react";
import CategoryNode from "@/components/admin/categories/CategoryNode";
import CategoryModal from "@/components/admin/categories/CategoryModal";
import { CategoryWithChildren } from "@/types/category";

type Props = {
  initialTree: CategoryWithChildren[];
};

export default function CategoryTreeBox({ initialTree }: Props) {
  const tree = initialTree;

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    parentId: string | null;
  }>({
    isOpen: false,
    parentId: null,
  });

  return (
    <main className="bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="p-6">
        {tree.length === 0 ? (
          <p className="text-center text-slate-500 py-20">
            No categories found.
          </p>
        ) : (
          <div className="space-y-1">
            {tree.map((node) => (
              <CategoryNode
                key={node.id}
                node={node}
                onAddSub={(id) =>
                  setModalConfig({
                    isOpen: true,
                    parentId: id,
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      <CategoryModal
        isOpen={modalConfig.isOpen}
        parentId={modalConfig.parentId}
        onClose={() => setModalConfig({ isOpen: false, parentId: null })}
      />
    </main>
  );
}
