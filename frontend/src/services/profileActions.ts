"use server";

import { updatePersonalInfo, updateShippingAddress } from "./api/auth";
import {
  personalInfoSchema,
  shippingAddressSchema,
} from "@/schemas/profileSchema";
import { User } from "@/types/user";
import { ActionResponse } from "@/types/action";
import { handleActionError } from "@/services/utils";
import getCookies from "@/utils/cookies";
import { revalidatePath } from "next/cache";

export async function updatePersonalInfoAction(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResponse<User>> {
  const rawData = {
    phone: formData.get("phone") as string,
    dateOfBirth: formData.get("dateOfBirth") as string,
    gender: formData.get("gender") as string,
  };

  const validatedFields = personalInfoSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      data: null,
      fieldErrors: validatedFields.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
      message: null,
      error: null,
    };
  }

  const cookie = await getCookies();

  const payload: { phone?: string; dateOfBirth?: string; gender?: string } = {};
  if (validatedFields.data.phone) payload.phone = validatedFields.data.phone;
  if (validatedFields.data.dateOfBirth)
    payload.dateOfBirth = validatedFields.data.dateOfBirth;
  if (validatedFields.data.gender) payload.gender = validatedFields.data.gender;

  try {
    const result = await updatePersonalInfo(payload, cookie);
    revalidatePath("/profile");
    return {
      success: true,
      data: result.user,
      fieldErrors: null,
      message: "Personal info updated successfully",
      error: null,
    };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}

export async function updateShippingAddressAction(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResponse<User>> {
  const rawData = {
    country: formData.get("country") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    postalCode: formData.get("postalCode") as string,
    streetAddress: formData.get("streetAddress") as string,
    apartment: formData.get("apartment") as string,
  };

  const validatedFields = shippingAddressSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      data: null,
      fieldErrors: validatedFields.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
      message: null,
      error: null,
    };
  }

  const cookie = await getCookies();

  const payload: {
    country?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    streetAddress?: string;
    apartment?: string;
  } = {};
  if (validatedFields.data.country)
    payload.country = validatedFields.data.country;
  if (validatedFields.data.city) payload.city = validatedFields.data.city;
  if (validatedFields.data.state) payload.state = validatedFields.data.state;
  if (validatedFields.data.postalCode)
    payload.postalCode = validatedFields.data.postalCode;
  if (validatedFields.data.streetAddress)
    payload.streetAddress = validatedFields.data.streetAddress;
  if (validatedFields.data.apartment)
    payload.apartment = validatedFields.data.apartment;

  try {
    const result = await updateShippingAddress(payload, cookie);
    revalidatePath("/profile");
    return {
      success: true,
      data: result.user,
      fieldErrors: null,
      message: "Shipping address updated successfully",
      error: null,
    };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}
