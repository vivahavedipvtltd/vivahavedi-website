export default function FeaturedProfilesSkeleton() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12 animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto"></div>
        </div>

        {/* Profile Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
              {/* Image Skeleton */}
              <div className="h-64 bg-gray-200"></div>

              {/* Content Skeleton */}
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                <div className="flex items-center justify-between pt-2">
                  <div className="h-10 bg-gray-200 rounded-full w-24"></div>
                  <div className="h-10 bg-gray-200 rounded-full w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
