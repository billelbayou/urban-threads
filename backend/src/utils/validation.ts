import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "CLIENT"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
    })
  ),
});

export const CategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  // Slug is usually generated from the name, but we can validate it too
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slugs must be lowercase, numbers, and dashes"),
  parentId: z.string().uuid().nullable().optional(),
});

export const AddToCartSchema = z.object({
  productId: z.string().uuid("Invalid product ID format"),
  quantity: z.coerce
    .number()
    .int()
    .min(1, "Quantity must be at least 1")
    .max(99, "Maximum 99 items allowed"),
  size: z.string().min(1, "Please select a size"),
});

export const ProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be greater than 0"),
  categoryId: z.string().uuid("Invalid category ID"),
  tags: z.array(z.string()).optional().default([]),
  images: z
    .array(
      z.object({
        url: z.string().url("Invalid image URL"),
        public_id: z.string().min(1, "Cloudinary public_id is required"),
      })
    )
    .min(1, "At least one image is required"),
  infoSections: z
    .array(
      z.object({
        title: z.string().min(1, "Info section title is required"),
        content: z.string().min(1, "Info section content is required"),
      })
    )
    .min(1, "At least one info section is required"),
});
