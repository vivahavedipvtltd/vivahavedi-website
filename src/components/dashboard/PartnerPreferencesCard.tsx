import React from 'react';
import Link from 'next/link';
import { Users, Star, MapPin, GraduationCap, ChevronRight, Heart } from 'lucide-react';
import { PartnerProfile } from '@/types/dashboard';

interface PartnerPreferencesCardProps {
  partnerProfile: PartnerProfile | null;
}

const PartnerPreferencesCard: React.FC<PartnerPreferencesCardProps> = React.memo(({ partnerProfile }) => {
  const isComplete = (status: string) => status === '1';

  // Default completion status if not loaded yet
  const completion = partnerProfile?.completion || {
    basic: '0',
    religion: '0',
    location: '0',
    education: '0',
  };

  const completedCount = Object.values(completion).filter(v => v === '1').length;
  const progressPercentage = (completedCount / 4) * 100;

  return (
    <div className="relative bg-gradient-to-br from-white via-rose-50/30 to-pink-50/50 rounded-2xl shadow-lg overflow-hidden border border-rose-100/50">
      {/* Decorative background pattern */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-100/20 to-pink-100/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-rose-100/20 to-red-100/20 rounded-full blur-3xl -z-10"></div>

      <div className="relative p-6">
        {/* Header with icon */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-md">
                <Heart className="h-5 w-5 text-white" fill="white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Partner Preferences
              </h2>
            </div>
            <p className="text-sm text-gray-600 ml-11">Define your ideal life partner</p>
          </div>

          {/* Elegant completion badge */}
          <div className="flex flex-col items-end">
            <div className="px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-200">
              <span className="text-xs font-semibold text-gray-700">
                {completedCount}<span className="text-gray-400 font-normal">/4</span>
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Preference links */}
        <div className="space-y-3">
          <Link
            href="/dashboard/profile/partner-basic"
            className="group relative flex items-center justify-between p-4 bg-white hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md border border-transparent hover:border-red-200/50"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-gradient-to-br from-gray-100 to-gray-50 group-hover:from-red-100 group-hover:to-pink-100 rounded-xl transition-all duration-300">
                <Users className="h-5 w-5 text-gray-600 group-hover:text-red-600 transition-colors duration-300" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors duration-300">
                  Basic Preferences
                </span>
                <p className="text-xs text-gray-500 mt-0.5">Age, height, marital status</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isComplete(completion.basic) && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-medium text-green-700">Done</span>
                </div>
              )}
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </Link>

          <Link
            href="/dashboard/profile/partner-religion"
            className="group relative flex items-center justify-between p-4 bg-white hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md border border-transparent hover:border-red-200/50"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-gradient-to-br from-gray-100 to-gray-50 group-hover:from-red-100 group-hover:to-pink-100 rounded-xl transition-all duration-300">
                <Star className="h-5 w-5 text-gray-600 group-hover:text-red-600 transition-colors duration-300" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors duration-300">
                  Religion & Caste
                </span>
                <p className="text-xs text-gray-500 mt-0.5">Spiritual preferences</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isComplete(completion.religion) && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-medium text-green-700">Done</span>
                </div>
              )}
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </Link>

          <Link
            href="/dashboard/profile/partner-location"
            className="group relative flex items-center justify-between p-4 bg-white hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md border border-transparent hover:border-red-200/50"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-gradient-to-br from-gray-100 to-gray-50 group-hover:from-red-100 group-hover:to-pink-100 rounded-xl transition-all duration-300">
                <MapPin className="h-5 w-5 text-gray-600 group-hover:text-red-600 transition-colors duration-300" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors duration-300">
                  Location Preferences
                </span>
                <p className="text-xs text-gray-500 mt-0.5">Country, state, city</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isComplete(completion.location) && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-medium text-green-700">Done</span>
                </div>
              )}
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </Link>

          <Link
            href="/dashboard/profile/partner-education"
            className="group relative flex items-center justify-between p-4 bg-white hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md border border-transparent hover:border-red-200/50"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-gradient-to-br from-gray-100 to-gray-50 group-hover:from-red-100 group-hover:to-pink-100 rounded-xl transition-all duration-300">
                <GraduationCap className="h-5 w-5 text-gray-600 group-hover:text-red-600 transition-colors duration-300" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors duration-300">
                  Education & Career
                </span>
                <p className="text-xs text-gray-500 mt-0.5">Qualification, profession</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isComplete(completion.education) && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-medium text-green-700">Done</span>
                </div>
              )}
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
});

PartnerPreferencesCard.displayName = 'PartnerPreferencesCard';

export default PartnerPreferencesCard;
