import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2, "First Name must have at least 2 characters"),
  lastName: z.string().min(2, "Last Name must have at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const updatePersonalInfoSchema = z.object({
  phone: z.string().min(1, "Phone number is required").optional(),
  dateOfBirth: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .optional(),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]).optional(),
});

export const updateShippingAddressSchema = z.object({
  country: z.string().min(1, "Country is required").optional(),
  city: z.string().min(1, "City is required").optional(),
  state: z.string().min(1, "State/Province is required").optional(),
  postalCode: z.string().min(1, "Postal code is required").optional(),
  streetAddress: z.string().min(1, "Street address is required").optional(),
  apartment: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdatePersonalInfoInput = z.infer<typeof updatePersonalInfoSchema>;
export type UpdateShippingAddressInput = z.infer<typeof updateShippingAddressSchema>;
