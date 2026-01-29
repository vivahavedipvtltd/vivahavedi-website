export default function SearchSectionSkeleton() {
  return (
    <section className="bg-gradient-to-br from-red-50 via-white to-pink-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12 animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto"></div>
        </div>

        {/* Search Form Skeleton */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-12 bg-gray-100 rounded-lg"></div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <div className="h-14 bg-gray-200 rounded-full w-48"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
