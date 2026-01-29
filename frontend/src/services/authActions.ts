import { loginSchema, registerSchema } from "@/schemas/authSchema";
import { login, logout, register } from "../lib/fetchers";
import { redirect } from "next/navigation";

export async function loginAction(_previousState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const validatedFields = loginSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const data = await login(
      validatedFields.data.email,
      validatedFields.data.password
    );
    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function registerAction(_previousState: any, formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  const validatedFields = registerSchema.safeParse({ email, password, name });

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const data = await register(
      validatedFields.data.name,
      validatedFields.data.email,
      validatedFields.data.password
    );
    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function logoutAction(_previousState: any, _formData: FormData) {
  try {
    const data = await logout();
    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
