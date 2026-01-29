"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  Tag,
  Plus,
  Edit3,
} from "lucide-react";
import { CategoryNodeProps } from "@/types/category";
import CategoryDeleteButton from "./CategoryDeleteButton";

export default function CategoryNode({ node, onAddSub }: CategoryNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <div className="select-none">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center py-2 px-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
      >
        {/* Toggle Arrow */}
        <div
          className={`p-1 rounded hover:bg-slate-200 transition-colors ${
            !hasChildren && "invisible"
          }`}
        >
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>

        {/* Icon: Folder for parents, Tag for leaves */}
        <div
          className={`mx-2 ${hasChildren ? "text-blue-500" : "text-slate-400"}`}
        >
          {hasChildren ? (
            <Folder size={18} fill="currentColor" fillOpacity={0.1} />
          ) : (
            <Tag size={16} />
          )}
        </div>

        {/* Category Name */}
        <span className="text-sm font-medium text-slate-700">{node.name}</span>

        {/* Action Buttons */}
        <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddSub(node.id);
            }}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
            title="Add Subcategory"
          >
            <Plus size={14} />
          </button>

          <CategoryDeleteButton category={node} />
        </div>
      </div>

      {/* Recursive Rendering of Children */}
      {isOpen && hasChildren && (
        <div className="ml-6 mt-1 border-l-2 border-slate-100 pl-2 space-y-1">
          {node.children.map((child) => (
            <CategoryNode
              key={child.id}
              node={child}
              onAddSub={onAddSub}
            />
          ))}
        </div>
      )}
    </div>
  );
}
