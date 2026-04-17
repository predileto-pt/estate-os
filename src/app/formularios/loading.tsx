export default function FormulariosLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-4 lg:px-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2" />
        <div className="col-span-6">
          {/* Heading skeleton */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Form area skeleton */}
          <div className="rounded-lg border border-gray-100 p-4 space-y-3 mb-6">
            <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Card list skeletons */}
          <div className="space-y-3 mt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-gray-100 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-4" />
      </div>
    </main>
  );
}
