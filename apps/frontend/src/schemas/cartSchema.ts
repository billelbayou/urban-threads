import { z } from "zod";

export const AddToCartSchema = z.object({
  productId: z.string().uuid("Invalid product ID format"),
  quantity: z.coerce
    .number()
    .int()
    .min(1, "Quantity must be at least 1")
    .max(99, "Maximum 99 items allowed"),
  size: z.string().min(1, "Please select a size"),
});
