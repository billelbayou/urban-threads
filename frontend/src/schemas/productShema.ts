import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(1, "Product name is required").trim(),

  categoryId: z
    .string()
    .min(1, "Category selection is required")
    .uuid("Invalid category format"),

  price: z.coerce.number().positive("Price must be greater than 0"),

  stock: z.coerce.number().int().positive("Stock count must be greater than 0"),

  description: z.string().min(1, "Description is required").trim(),

  images: z
    .array(
      z.object({
        url: z.string().url("Invalid image URL"),
        public_id: z.string().min(1, "Public ID is required"),
      }),
    )
    .min(1, "At least one product image is required"),

  infoSections: z
    .array(
      z.object({
        title: z.string().min(1, "Section title required"),
        content: z.string().min(1, "Section content required"),
      }),
    )
    .min(1, "At least one info section is required")
    .default([]),

  tags: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
      }),
    )
    .min(1, "At least one tag is required")
    .default([]),
});
