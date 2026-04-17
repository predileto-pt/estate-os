"use client";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4 px-4">
          <h1 className="text-lg font-bold text-gray-900">
            Something went wrong
          </h1>
          <p className="text-sm text-gray-500 max-w-md">
            {error.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={reset}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
