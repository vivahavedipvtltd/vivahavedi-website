import React from 'react';

interface WelcomeCardProps {
  firstName: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = React.memo(({ firstName }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome, {firstName}!
      </h1>
      <p className="text-gray-600">Here&apos;s your dashboard overview</p>
    </div>
  );
});

WelcomeCard.displayName = 'WelcomeCard';

export default WelcomeCard;
