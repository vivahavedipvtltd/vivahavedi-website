'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: 'blue' | 'red' | 'green' | 'purple';
  href?: string;
}

const StatCard: React.FC<StatCardProps> = React.memo(({ icon, title, value, color, href }) => {
  const router = useRouter();

  const colorClasses = {
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  };

  const handleClick = () => {
    if (href) {
      router.push(href);
    }
  };

  const CardContent = (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-lg text-white`}>
          {icon}
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <div
        onClick={handleClick}
        className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
      >
        {CardContent}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {CardContent}
    </div>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;
