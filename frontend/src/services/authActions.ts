import { loginSchema, registerSchema } from "@/schemas/authSchema";
import { login, logout, register } from "../lib/fetchers";

export async function loginAction(_previousState: unknown, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const validatedFields = loginSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      success: false,
      data: null,
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      message: null,
    };
  }

  try {
    const data = await login(
      validatedFields.data.email,
      validatedFields.data.password,
    );
    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return {
      success: false,
      data: null,
      fieldErrors: null,
      message: errorMessage,
    };
  }
}

export async function registerAction(
  _previousState: unknown,
  formData: FormData,
) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  const validatedFields = registerSchema.safeParse({ email, password, name });

  if (!validatedFields.success) {
    return {
      success: false,
      data: null,
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      message: null,
    };
  }

  try {
    const data: {message: string, userId: string} = await register(
      validatedFields.data.name,
      validatedFields.data.email,
      validatedFields.data.password,
    );
    return {
      success: true,
      data: data.userId,
      fieldErrors: null,
      message: data.message,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return {
      success: false,
      data: null,
      fieldErrors: null,
      message: errorMessage,
    };
  }
}
//
export async function logoutAction(
  _previousState: unknown,
  _formData: FormData,
) {
  try {
    const data = await logout();
    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return {
      success: false,
      data: null,
      error: errorMessage,
    };
  }
}
