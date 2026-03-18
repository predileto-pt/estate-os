export default function ImoveisLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-4 lg:px-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2" />
        <div className="col-span-8">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-9 w-36 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Property card skeletons */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-100 p-4 space-y-3 mb-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-2/5 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
              </div>
              <div className="h-3 w-3/5 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-4">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        <div className="col-span-2" />
      </div>
    </main>
  );
}
