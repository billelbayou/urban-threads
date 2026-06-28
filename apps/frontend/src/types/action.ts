/**
 * Unified server action response type used across the entire application.
 * All server actions must return this shape for consistency.
 */
export interface ActionResponse<T = null> {
  success: boolean;
  data: T | null;
  message: string | null;
  fieldErrors: Record<string, string[]> | null;
  error: string | null;
}
