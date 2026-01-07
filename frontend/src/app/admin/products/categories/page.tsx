"use client";

import { useEffect, useState } from "react";
import { buildTree } from "@/lib/trees";
import CategoryNode from "@/components/admin/CategoryNode";
import CategoryModal from "@/components/admin/CategoryModal";
import { ListTree, Plus, RefreshCcw } from "lucide-react";
import { Category } from "@/lib/types";
import api from "@/lib/axios";

export default function CategoryAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    parentId: string | null;
    editData: Category | null;
  }>({
    isOpen: false,
    parentId: null,
    editData: null,
  });

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/api/category");
      const data = await res.data;
      setCategories(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handlers for Node Actions
  const handleAddSub = (parentId: string) => {
    setModalConfig({ isOpen: true, parentId, editData: null });
  };

  const handleEdit = (category: Category) => {
    setModalConfig({ isOpen: true, parentId: null, editData: category });
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await api.delete(`/api/category${id}`);
      fetchCategories(); // Refresh tree after delete
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleCloseModal = () => {
    setModalConfig({ isOpen: false, parentId: null, editData: null });
  };

  const categoryTree = buildTree(categories);

  return (
    <div className="max-w-3xl mx-auto p-10 min-h-screen">
      <header className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ListTree className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-slate-900">
              Store Hierarchy
            </h1>
          </div>
          <p className="text-slate-500 text-sm">
            Organize your products by managing categories and sub-sections.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchCategories}
            disabled={isLoading}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCcw size={20} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() =>
              setModalConfig({ isOpen: true, parentId: null, editData: null })
            }
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95"
          >
            <Plus size={18} /> New Root
          </button>
        </div>
      </header>

      <main className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6">
          {isLoading && categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <RefreshCcw size={32} className="animate-spin mb-4 opacity-20" />
              <p className="text-sm font-medium">Loading your structure...</p>
            </div>
          ) : categoryTree.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <p className="text-slate-500 text-sm mb-4">
                No categories found in the database.
              </p>
              <button
                onClick={() =>
                  setModalConfig({
                    isOpen: true,
                    parentId: null,
                    editData: null,
                  })
                }
                className="text-blue-600 font-semibold text-sm hover:underline"
              >
                Create your first category
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {categoryTree.map((rootNode) => (
                <CategoryNode
                  key={rootNode.id}
                  node={rootNode}
                  onAddSub={handleAddSub}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
            Tip: Use the '+' icon to create nested subcategories.
          </p>
        </div>
      </main>

      {/* The Modal handles both Create and Edit logic internally based on editData */}
      <CategoryModal
        isOpen={modalConfig.isOpen}
        parentId={modalConfig.parentId}
        editData={modalConfig.editData}
        onClose={handleCloseModal}
        onSuccess={fetchCategories}
      />
    </div>
  );
}
