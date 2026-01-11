import { CategoryWithChildren } from "../types/types";

export const buildTree = (
  nodes: any[],
  parentId: string | null = null // Changed from number
): CategoryWithChildren[] => {
  return nodes
    .filter((node) => node.parentId === parentId)
    .map((node) => ({
      ...node,
      children: buildTree(nodes, node.id),
    }));
};
