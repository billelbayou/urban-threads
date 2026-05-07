import { AlertCircle } from "lucide-react";

interface FieldErrorProps {
  message: string;
}

export function FieldError({ message }: FieldErrorProps) {
  return (
    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </p>
  );
}
