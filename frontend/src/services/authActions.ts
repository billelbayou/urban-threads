"use server";

import { loginSchema, registerSchema } from "@/schemas/authSchema";
import { login, logout, register, deleteAccount } from "./api/auth";
import { ActionResponse } from "@/types/action";
import { handleActionError } from "@/services/utils";
import { User } from "@/types/user";
import getCookies from "@/utils/cookies";

export async function loginAction(
  _previousState: unknown,
  formData: FormData,
): Promise<ActionResponse<{ message: string; user: User }>> {
  const email = formData.get("email");
  const password = formData.get("password");

  const validatedFields = loginSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      success: false,
      data: null,
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      message: null,
      error: null,
    };
  }

  try {
    const data = await login(
      validatedFields.data.email,
      validatedFields.data.password,
    );
    return { success: true, data, fieldErrors: null, message: null, error: null };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}

export async function registerAction(
  _previousState: unknown,
  formData: FormData,
): Promise<ActionResponse<{ userId: string }>> {
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const password = formData.get("password");

  const validatedFields = registerSchema.safeParse({
    firstName,
    lastName,
    email,
    password,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      data: null,
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      message: null,
      error: null,
    };
  }

  try {
    const data = await register(
      validatedFields.data.firstName,
      validatedFields.data.lastName,
      validatedFields.data.email,
      validatedFields.data.password,
    );
    return {
      success: true,
      data: { userId: data.userId },
      fieldErrors: null,
      message: data.message,
      error: null,
    };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}

export async function logoutAction(
  _previousState: unknown,
  _formData: FormData,
): Promise<ActionResponse<{ message: string }>> {
  try {
    const data = await logout();
    return { success: true, data, fieldErrors: null, message: null, error: null };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}

export async function deleteAccountAction(
  _previousState: unknown,
  _formData: FormData,
): Promise<ActionResponse<{ message: string }>> {
  try {
    const cookie = await getCookies();
    const data = await deleteAccount(cookie);
    return { success: true, data, fieldErrors: null, message: null, error: null };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}
