import { Product } from "./product";

export interface Category {
  id: string;
  name: string;
  products?: Product[];
}

export type CategoryWithChildren = Category & {
  children: CategoryWithChildren[];
};

// Props for the individual Node component
export interface CategoryNodeProps {
  node: CategoryWithChildren;
  onAddSub: (parentId: string) => void;
  onEdit: (category: Category) => void;
}
