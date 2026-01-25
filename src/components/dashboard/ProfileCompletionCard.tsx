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

  const containerClasses = isComplete
    ? 'bg-white border-2 border-green-200 hover:border-green-400'
    : 'bg-white border-2 border-orange-200 hover:border-orange-400';

  const buttonClasses = `w-full flex items-center justify-center text-xs font-semibold py-2.5 rounded-lg transition-all duration-200 ${
    isComplete
      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg'
      : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg'
  }`;

  const ButtonContent = () => (
    <>
      {isComplete ? (
        <>
          <Edit className="h-4 w-4 mr-1.5" />
          Edit
        </>
      ) : (
        <>
          <Plus className="h-4 w-4 mr-1.5" />
          Add Now
        </>
      )}
    </>
  );

  return (
    <div className={`p-4 rounded-xl ${containerClasses} transition-all duration-300 hover:shadow-lg group`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className={`text-sm font-bold mb-1 ${isComplete ? 'text-gray-800' : 'text-gray-800'}`}>
            {label}
          </h4>
          {points && (
            <div className="flex items-center gap-1">
              <Star className={`h-3 w-3 ${isComplete ? 'text-green-500' : 'text-orange-500'}`} />
              <span className="text-xs font-medium text-gray-600">{points}</span>
            </div>
          )}
        </div>
        <div className={`flex-shrink-0 ml-2 ${isComplete ? 'text-green-500' : 'text-orange-500'}`}>
          {isComplete ? (
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5" />
            </div>
          )}
        </div>
      </div>
      {editLink ? (
        <Link href={editLink} className={buttonClasses}>
          <ButtonContent />
        </Link>
      ) : (
        <button onClick={onClick} className={buttonClasses}>
          <ButtonContent />
        </button>
      )}
    </div>
  );
}

const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = React.memo(({ profileCompletion, onSectionChange }) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-100">
      {/* Header with Score */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Profile Completion</h2>
          <p className="text-sm text-gray-600">Complete your profile to get better matches</p>
        </div>
        <div className="text-center">
          <div className={`text-4xl font-extrabold ${
            profileCompletion.score === 100
              ? 'text-green-600'
              : profileCompletion.score >= 75
              ? 'text-blue-600'
              : profileCompletion.score >= 50
              ? 'text-yellow-600'
              : 'text-red-500'
          }`}>
            {profileCompletion.score}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {profileCompletion.score === 100
              ? 'Complete'
              : profileCompletion.score >= 75
              ? 'Almost there'
              : profileCompletion.score >= 50
              ? 'Keep going'
              : 'Get started'}
          </div>
        </div>
      </div>

      {/* Elegant Progress Bar */}
      <div className="mb-8">
        <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className={`h-3 rounded-full transition-all duration-700 ease-out relative ${
              profileCompletion.score === 100
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : profileCompletion.score >= 75
                ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                : profileCompletion.score >= 50
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                : 'bg-gradient-to-r from-red-500 to-red-600'
            }`}
            style={{ width: `${profileCompletion.score}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Completion Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
      </div>
    </div>
  );
});

ProfileCompletionCard.displayName = 'ProfileCompletionCard';

export default ProfileCompletionCard;
