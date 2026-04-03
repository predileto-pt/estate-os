"use client";

import { useDictionary } from "@/components/dictionary-provider";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  let dict: ReturnType<typeof useDictionary> | null = null;
  try {
    dict = useDictionary();
  } catch {
    // DictionaryProvider may not be available
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-16 lg:px-6">
      <div className="text-center space-y-4">
        <h1 className="text-lg font-bold text-gray-900">
          Something went wrong
        </h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer"
        >
          {dict?.dashboard.back ?? "Try again"}
        </button>
      </div>
    </main>
  );
}
