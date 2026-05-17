import { create } from "zustand";
import { CategoryWithChildren } from "@/types/category";

function addToTree(
  nodes: CategoryWithChildren[],
  parentId: string | null,
  newNode: CategoryWithChildren,
): CategoryWithChildren[] {
  if (parentId === null) {
    return [...nodes, newNode];
  }
  return nodes.map((node) => {
    if (node.id === parentId) {
      return { ...node, children: [...node.children, newNode] };
    }
    if (node.children.length > 0) {
      return { ...node, children: addToTree(node.children, parentId, newNode) };
    }
    return node;
  });
}

function removeFromTree(
  nodes: CategoryWithChildren[],
  nodeId: string,
): CategoryWithChildren[] {
  return nodes
    .filter((node) => node.id !== nodeId)
    .map((node) => ({
      ...node,
      children: removeFromTree(node.children, nodeId),
    }));
}

interface CategoryState {
  tree: CategoryWithChildren[];
  setTree: (tree: CategoryWithChildren[]) => void;
  addNode: (parentId: string | null, node: CategoryWithChildren) => void;
  removeNode: (nodeId: string) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  tree: [],
  setTree: (tree) => set({ tree }),
  addNode: (parentId, node) =>
    set((state) => ({ tree: addToTree(state.tree, parentId, node) })),
  removeNode: (nodeId) =>
    set((state) => ({ tree: removeFromTree(state.tree, nodeId) })),
}));
