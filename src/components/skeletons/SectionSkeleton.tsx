interface SectionSkeletonProps {
  variant?: 'default' | 'compact' | 'grid';
}

export default function SectionSkeleton({ variant = 'default' }: SectionSkeletonProps) {
  if (variant === 'grid') {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-md animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'compact') {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg w-48 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto mb-8"></div>
        </div>
        <div className="space-y-8 animate-pulse">
          <div className="h-64 bg-gray-100 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-gray-100 rounded-xl"></div>
            <div className="h-48 bg-gray-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
