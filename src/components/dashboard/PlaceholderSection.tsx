import React from 'react';
import { Star } from 'lucide-react';

interface PlaceholderSectionProps {
  title: string;
  message: string;
}

const PlaceholderSection: React.FC<PlaceholderSectionProps> = React.memo(({ title, message }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Star className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <p className="text-sm text-gray-500">This feature is coming soon!</p>
      </div>
    </div>
  );
});

PlaceholderSection.displayName = 'PlaceholderSection';

export default PlaceholderSection;
