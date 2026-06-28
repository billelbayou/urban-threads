import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Name is too short")
    .max(40, "Name is too long")
    .trim(),
  parentId: z
    .string()
    .uuid("Invalid parent ID format")
    .optional()
    .or(z.literal("")) // Allows empty strings from the hidden input
    .nullable()
    .transform((v) => (v ? v : undefined)),
});
