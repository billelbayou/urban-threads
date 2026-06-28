"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center px-4">
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          Admin Error
        </h2>
        <p className="text-slate-500 mb-6">
          {error.message || "Failed to load admin page."}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
