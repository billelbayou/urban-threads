"use client";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Product Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          {error.message || "Failed to load product details."}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
