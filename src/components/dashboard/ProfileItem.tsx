import React from 'react';

interface ProfileItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const ProfileItem: React.FC<ProfileItemProps> = React.memo(({ icon, label, value }) => {
  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
      <div className="text-red-500 mt-1">{icon}</div>
      <div>
        <p className="text-xs text-gray-600 mb-1">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
});

ProfileItem.displayName = 'ProfileItem';

export default ProfileItem;
