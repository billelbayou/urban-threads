import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slugs must be lowercase, numbers, and dashes"),
  parentId: z.string().uuid().nullable().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
