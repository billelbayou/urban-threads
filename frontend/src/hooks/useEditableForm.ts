import { ActionResponse } from "@/types/action";
import { useActionState, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

/**
 * Shared hook for editable form sections (personal info, shipping address, etc.)
 * Handles: editing toggle, useActionState, success/error toast, field error rendering.
 */
export function useEditableForm<T>(
  action: (
    prevState: unknown,
    formData: FormData,
  ) => Promise<ActionResponse<T>>,
  onSuccess?: (data: T) => void,
) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message ?? "Updated successfully");
      if (state.data && onSuccess) onSuccess(state.data);
      setEditing(false);
    } else if (state && !state.success) {
      toast.error(state.message || state.error || "An error occurred");
    }
  }, [state, onSuccess]);

  const getFieldErrors = useCallback(
    (fieldName: string): string[] | undefined => {
      return state?.fieldErrors?.[fieldName];
    },
    [state],
  );

  return {
    editing,
    setEditing,
    state,
    formAction,
    isPending,
    getFieldErrors,
  };
}
