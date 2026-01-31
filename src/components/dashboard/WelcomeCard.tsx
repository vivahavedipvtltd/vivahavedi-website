import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Camera, User } from 'lucide-react';

interface WelcomeCardProps {
  firstName: string;
  userId: number;
  profilePhoto: string;
  hasProfilePhoto: boolean;
}

const WelcomeCard: React.FC<WelcomeCardProps> = React.memo(({
  firstName,
  userId,
  profilePhoto,
  hasProfilePhoto
}) => {
  const router = useRouter();

  const handlePhotoClick = () => {
    router.push('/dashboard?section=my-photos');
  };

  return (
    <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-lg shadow-lg p-6 text-white">
      <div className="flex items-center gap-6">
        {/* Profile Photo Section */}
        <div className="relative group">
          <button
            onClick={handlePhotoClick}
            className="relative block w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50"
            title={hasProfilePhoto ? "Click to manage photos" : "Click to add profile photo"}
          >
            {hasProfilePhoto ? (
              <Image
                src={profilePhoto}
                alt={`${firstName}'s profile photo`}
                fill
                sizes="96px"
                className="object-cover"
                unoptimized={profilePhoto?.includes('vivahavedimatrimony.com')}
                priority
              />
            ) : (
              <div className="w-full h-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Camera className="w-10 h-10 text-white" />
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </button>

          {/* Add Photo Badge - Only show if no photo */}
          {!hasProfilePhoto && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
              Add Photo
            </div>
          )}
        </div>

        {/* Welcome Text Section */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-white/80" />
            <span className="text-sm font-medium text-white/80">
              Profile ID: {userId}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {firstName}!
          </h1>
          <p className="text-white/90">
            {hasProfilePhoto
              ? "Here's your dashboard overview"
              : "Complete your profile by adding a photo"}
          </p>
        </div>
      </div>
    </div>
  );
});

WelcomeCard.displayName = 'WelcomeCard';

export default WelcomeCard;
