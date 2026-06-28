import { ProductImage, InfoSection } from "@/types/product";
import { create } from "zustand";

export interface ProductFormData {
  name: string;
  categoryId: string;
  price: number | null;
  stock: number | null;
  description: string;
  images: ProductImage[];
  infoSections: InfoSection[];
  tags: string[];
}

export type ValidationErrors = {
  name?: string[];
  categoryId?: string[];
  price?: string[];
  stock?: string[];
  description?: string[];
  images?: string[];
  infoSections?: string[];
  tags?: string[];
};

interface ProductFormState {
  images: ProductImage[];
  newImageFiles: File[];
  productName: string;
  categoryId: string;
  price: number | "";
  stock: number | "";
  description: string;
  infoSections: InfoSection[];
  tags: string[];
  errors: ValidationErrors | null;

  setImages: (images: ProductImage[]) => void;
  setNewImageFiles: (files: File[]) => void;
  setProductName: (name: string) => void;
  setCategoryId: (id: string) => void;
  setPrice: (price: number | "") => void;
  setStock: (stock: number | "") => void;
  setDescription: (desc: string) => void;
  setInfoSections: (sections: InfoSection[]) => void;
  setTags: (tags: string[]) => void;
  setErrors: (errors: ValidationErrors | null) => void;
  reset: () => void;
  init: (data: {
    productName?: string;
    categoryId?: string;
    price?: number | "";
    stock?: number | "";
    description?: string;
    infoSections?: InfoSection[];
    tags?: string[];
    images?: ProductImage[];
    newImageFiles?: File[];
  }) => void;
  getFormData: () => ProductFormData;
}

const emptyState = {
  images: [] as ProductImage[],
  newImageFiles: [] as File[],
  productName: "",
  categoryId: "",
  price: "" as const,
  stock: "" as const,
  description: "",
  infoSections: [{ title: "", content: "" }] as InfoSection[],
  tags: [] as string[],
  errors: null as ValidationErrors | null,
};

export const useProductFormStore = create<ProductFormState>((set, get) => ({
  ...emptyState,

  setImages: (images) => set({ images }),
  setNewImageFiles: (newImageFiles) => set({ newImageFiles }),
  setProductName: (productName) => set({ productName }),
  setCategoryId: (categoryId) => set({ categoryId }),
  setPrice: (price) => set({ price }),
  setStock: (stock) => set({ stock }),
  setDescription: (description) => set({ description }),
  setInfoSections: (infoSections) => set({ infoSections }),
  setTags: (tags) => set({ tags }),
  setErrors: (errors) => set({ errors }),

  reset: () => set({ ...emptyState, newImageFiles: [] }),

  init: (data) =>
    set({
      ...emptyState,
      ...data,
      newImageFiles: data.newImageFiles ?? [],
    }),

  getFormData: () => {
    const s = get();
    return {
      name: s.productName,
      categoryId: s.categoryId,
      price: s.price === "" ? null : s.price,
      stock: s.stock === "" ? null : s.stock,
      description: s.description,
      images: s.images,
      infoSections: s.infoSections,
      tags: s.tags,
    };
  },
}));
