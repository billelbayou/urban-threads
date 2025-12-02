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

export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  gender: z.enum(["MEN", "WOMEN", "UNISEX"]),
  categoryId: z.string().uuid(),
  images: z.array(z.string().url()),
  infoSections: z
    .array(
      z.object({
        title: z.string(),
        content: z.string(),
      })
    )
    .optional(),
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

export const categorySchema = z.object({
  name: z.string().min(2).max(50),
});

export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().min(1),
});
