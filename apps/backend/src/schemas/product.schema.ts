import { z } from "zod";

export const productImageSchema = z.object({
  url: z.string().url().optional(),
  path: z.string().optional(),
  thumbnail: z
    .object({
      url: z.string().url(),
      path: z.string(),
    })
    .optional(),
  mobile: z
    .object({
      url: z.string().url(),
      path: z.string(),
    })
    .optional(),
  desktop: z
    .object({
      url: z.string().url(),
      path: z.string(),
    })
    .optional(),
  original: z
    .object({
      url: z.string().url(),
      path: z.string(),
    })
    .optional(),
});

export const productInfoSectionSchema = z.object({
  title: z.string().min(1, "Info section title is required"),
  content: z.string().min(1, "Info section content is required"),
});

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce.number().int().positive("Stock count must be greater than 0"),
  categoryId: z.string().uuid("Invalid category ID"),
  tags: z.array(z.string()).optional().default([]),
  images: z.array(productImageSchema).default([]),
  infoSections: z
    .array(productInfoSectionSchema)
    .min(1, "At least one info section is required"),
});

export type ProductInput = z.infer<typeof productSchema>;
