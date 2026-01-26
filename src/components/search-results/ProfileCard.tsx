'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProfileCardProps {
  profile: {
    id: number;
    name: string;
    age: number;
    height: string;
    marital_status: string;
    religion: string;
    caste: string;
    district: string;
    qualification: string;
    photo: string;
  };
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const router = useRouter();

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={() => router.push(`/profile/${profile.id}`)}
    >
      <div className="aspect-w-16 aspect-h-12 bg-gray-200 relative h-[22rem]">
        <Image
          src={profile.photo || '/placeholder-avatar.png'}
          alt={profile.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          unoptimized={profile.photo?.includes('vivahavedimatrimony.com')}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {profile.name}
        </h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p>
            <span className="font-medium">Age:</span> {profile.age} years
          </p>
          <p>
            <span className="font-medium">Height:</span> {profile.height}
          </p>
          <p>
            <span className="font-medium">Status:</span>{' '}
            {profile.marital_status}
          </p>
          <p>
            <span className="font-medium">Religion:</span> {profile.religion}
          </p>
          <p>
            <span className="font-medium">Caste:</span> {profile.caste}
          </p>
          <p>
            <span className="font-medium">Location:</span> {profile.district}
          </p>
          <p>
            <span className="font-medium">Education:</span>{' '}
            {profile.qualification}
          </p>
        </div>
        <button className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
          View Profile
        </button>
      </div>
    </div>
  );
}
