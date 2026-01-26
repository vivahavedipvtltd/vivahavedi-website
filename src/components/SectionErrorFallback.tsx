'use client';

interface SectionErrorFallbackProps {
  message: string;
}

const SectionErrorFallback = ({ message }: SectionErrorFallbackProps) => (
  <div className="flex items-center justify-center py-16 px-4">
    <div className="text-center">
      <p className="text-gray-600 mb-4">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="text-red-600 hover:text-red-700 font-medium"
      >
        Reload Page
      </button>
    </div>
  </div>
);

export default SectionErrorFallback;
