import { Category, CategoryWithChildren } from "@/types/category";

export const buildTree = (
  nodes: Category[],
  parentId: string | null = null, // Changed from number
): CategoryWithChildren[] => {
  return nodes
    .filter((node) => node.parentId === parentId)
    .map((node) => ({
      ...node,
      children: buildTree(nodes, node.id),
    }));
};

export const flattenCategories = (
  nodes: CategoryWithChildren[],
  path: string[] = [],
): { id: string; label: string }[] => {
  let results: { id: string; label: string }[] = [];
  nodes.forEach((node) => {
    const currentPath = [...path, node.name];
    results.push({ id: node.id, label: currentPath.join(" > ") });
    if (node.children) {
      results = [...results, ...flattenCategories(node.children, currentPath)];
    }
  });
  return results;
};
