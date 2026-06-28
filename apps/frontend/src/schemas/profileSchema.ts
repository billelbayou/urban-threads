import { z } from "zod";

export const personalInfoSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[\d\s\-()]{7,20}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date (YYYY-MM-DD)")
    .optional()
    .or(z.literal("")),
  gender: z
    .enum(["Male", "Female", "Other", "Prefer not to say"], {
      errorMap: () => ({ message: "Please select a valid gender option" }),
    })
    .optional()
    .or(z.literal("")),
});

export const shippingAddressSchema = z.object({
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .optional()
    .or(z.literal("")),
  state: z
    .string()
    .min(2, "State/Province must be at least 2 characters")
    .optional()
    .or(z.literal("")),
  postalCode: z
    .string()
    .min(3, "Postal code must be at least 3 characters")
    .max(10, "Postal code must be at most 10 characters")
    .optional()
    .or(z.literal("")),
  streetAddress: z
    .string()
    .min(3, "Street address must be at least 3 characters")
    .optional()
    .or(z.literal("")),
  apartment: z.string().optional().or(z.literal("")),
});
