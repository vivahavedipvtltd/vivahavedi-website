import React from 'react';
import Link from 'next/link';
import { Users, Star, MapPin, GraduationCap } from 'lucide-react';

const PartnerPreferencesCard: React.FC = React.memo(() => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Partner Preferences</h2>
      <p className="text-sm text-gray-600 mb-4">Set your ideal partner criteria</p>

      <div className="space-y-3">
        <Link
          href="/dashboard/profile/partner-basic"
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
        >
          <div className="flex items-center">
            <Users className="h-5 w-5 text-gray-600 group-hover:text-red-600 mr-3 transition-colors" />
            <span className="font-medium text-gray-900">Basic Preferences</span>
          </div>
          <span className="text-red-600 text-sm">→</span>
        </Link>

        <Link
          href="/dashboard/profile/partner-religion"
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
        >
          <div className="flex items-center">
            <Star className="h-5 w-5 text-gray-600 group-hover:text-red-600 mr-3 transition-colors" />
            <span className="font-medium text-gray-900">Religion & Caste</span>
          </div>
          <span className="text-red-600 text-sm">→</span>
        </Link>

        <Link
          href="/dashboard/profile/partner-location"
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
        >
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-gray-600 group-hover:text-red-600 mr-3 transition-colors" />
            <span className="font-medium text-gray-900">Location Preferences</span>
          </div>
          <span className="text-red-600 text-sm">→</span>
        </Link>

        <Link
          href="/dashboard/profile/partner-education"
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
        >
          <div className="flex items-center">
            <GraduationCap className="h-5 w-5 text-gray-600 group-hover:text-red-600 mr-3 transition-colors" />
            <span className="font-medium text-gray-900">Education & Career</span>
          </div>
          <span className="text-red-600 text-sm">→</span>
        </Link>
      </div>
    </div>
  );
});

PartnerPreferencesCard.displayName = 'PartnerPreferencesCard';

export default PartnerPreferencesCard;
