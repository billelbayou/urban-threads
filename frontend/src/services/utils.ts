import { ActionResponse } from "@/types/action";

/**
 * Standardized error handler for server actions.
 * Extracts the error message and returns a consistent ActionResponse shape.
 */
export function handleActionError(error: unknown): ActionResponse<never> {
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";
  return {
    success: false,
    data: null,
    message,
    fieldErrors: null,
    error: message,
  };
}

/**
 * Safely extracts a required string value from FormData.
 * Throws if the value is missing or not a string.
 */
export function getRequiredFormValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string" || !value) {
    throw new Error(`Missing required field: ${key}`);
  }
  return value;
}
