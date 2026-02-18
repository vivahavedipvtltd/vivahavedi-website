import React from 'react';
import Link from 'next/link';
import { Star, CheckCircle2, AlertCircle, Edit, Plus } from 'lucide-react';

interface ProfileCompletion {
  registration: string;
  basic: string;
  education: string;
  family: string;
  hobbies: string;
  astro: string;
  photo: string;
  id_proof: string;
  horoscope: string;
  score: number;
}

interface ProfileCompletionCardProps {
  profileCompletion: ProfileCompletion;
  onSectionChange?: (section: string) => void;
}

function CompletionItem({
  label,
  status,
  editLink,
  onClick,
  points
}: {
  label: string;
  status: string;
  editLink?: string;
  onClick?: () => void;
  points?: string;
}) {
  const isComplete = status === '1' || status === 'yes';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:border-gray-300 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-800 mb-1">
            {label}
          </h4>
          {points && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium text-gray-500">{points}</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 ml-2">
          {isComplete ? (
            <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </div>
          )}
        </div>
      </div>
      {editLink ? (
        <Link
          href={editLink}
          className={`w-full flex items-center justify-center text-xs font-medium py-2 rounded-lg transition-all duration-200 ${
            isComplete
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              : 'bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md'
          }`}
        >
          {isComplete ? (
            <>
              <Edit className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Now
            </>
          )}
        </Link>
      ) : (
        <button
          onClick={onClick}
          className={`w-full flex items-center justify-center text-xs font-medium py-2 rounded-lg transition-all duration-200 ${
            isComplete
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              : 'bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md'
          }`}
        >
          {isComplete ? (
            <>
              <Edit className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Now
            </>
          )}
        </button>
      )}
    </div>
  );
}

const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = React.memo(({ profileCompletion, onSectionChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-200">
      {/* Header with Score */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Profile Completion</h2>
          <p className="text-sm text-gray-600">Complete your profile to get better matches</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900">
              {profileCompletion.score}%
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {profileCompletion.score === 100
                ? 'Complete'
                : profileCompletion.score >= 75
                ? 'Almost there'
                : profileCompletion.score >= 50
                ? 'Keep going'
                : 'Get started'}
            </div>
          </div>
          <div className="w-12 h-12 flex-shrink-0">
            {profileCompletion.score === 100 ? (
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              </div>
            ) : profileCompletion.score >= 75 ? (
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Star className="h-7 w-7 text-blue-600" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertCircle className="h-7 w-7 text-orange-500" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Elegant Progress Bar */}
      <div className="mb-8">
        <div className="relative w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-700 ease-out relative ${
              profileCompletion.score === 100
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : profileCompletion.score >= 75
                ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                : profileCompletion.score >= 50
                ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                : 'bg-gradient-to-r from-red-500 to-red-600'
            }`}
            style={{ width: `${profileCompletion.score}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Completion Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <CompletionItem
          label="Basic Info"
          status={profileCompletion.basic}
          editLink="/dashboard/profile/basic"
          points="10 pts"
        />
        <CompletionItem
          label="Education"
          status={profileCompletion.education}
          editLink="/dashboard/profile/education"
          points="10 pts"
        />
        <CompletionItem
          label="Family"
          status={profileCompletion.family}
          editLink="/dashboard/profile/family"
          points="10 pts"
        />
        <CompletionItem
          label="Hobbies"
          status={profileCompletion.hobbies}
          editLink="/dashboard/profile/hobbies"
          points="5 pts"
        />
        <CompletionItem
          label="Astrology"
          status={profileCompletion.astro}
          editLink="/dashboard/profile/astrological"
          points="10 pts"
        />
        <CompletionItem
          label="Photos"
          status={profileCompletion.photo}
          onClick={() => onSectionChange?.('my-photos')}
          points="20 pts"
        />
        <CompletionItem
          label="ID Proof"
          status={profileCompletion.id_proof}
          onClick={() => onSectionChange?.('my-documents')}
          points="15 pts"
        />
        <CompletionItem
          label="Horoscope"
          status={profileCompletion.horoscope ?? '0'}
          editLink="/dashboard/horoscope"
          points="Optional"
        />
      </div>
    </div>
  );
});

ProfileCompletionCard.displayName = 'ProfileCompletionCard';

export default ProfileCompletionCard;
