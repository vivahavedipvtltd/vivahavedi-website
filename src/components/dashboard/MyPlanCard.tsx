import React from 'react';
import { CreditCard, Phone, MessageCircle, Heart, Mail, Clock, Crown, TrendingUp } from 'lucide-react';
import { MyPlan } from '@/types/dashboard';
import Link from 'next/link';

interface MyPlanCardProps {
  plan: MyPlan;
}

// Helper function to calculate remaining days from timestamp
function getRemainingDays(timestamp: string): { text: string; color: string; urgent: boolean } {
  const expiryDate = new Date(parseInt(timestamp) * 1000);
  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: 'Expired', color: 'text-red-600', urgent: true };
  } else if (diffDays === 0) {
    return { text: 'Expires Today', color: 'text-red-600', urgent: true };
  } else if (diffDays === 1) {
    return { text: '1 day left', color: 'text-orange-600', urgent: true };
  } else if (diffDays <= 7) {
    return { text: `${diffDays} days left`, color: 'text-orange-600', urgent: true };
  } else if (diffDays <= 30) {
    return { text: `${diffDays} days left`, color: 'text-yellow-600', urgent: false };
  } else {
    return { text: `${diffDays} days left`, color: 'text-green-600', urgent: false };
  }
}

function PlanItem({ icon, label, value, highlight = false }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`relative p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
      highlight
        ? 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200'
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      <div className={`mb-2 ${highlight ? 'text-red-600' : 'text-gray-500'}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-600 mb-1">{label}</p>
        <p className={`text-lg font-bold ${highlight ? 'text-red-600' : 'text-gray-900'}`}>{value}</p>
      </div>
    </div>
  );
}

function ExpiryPlanItem({ timestamp }: { timestamp: string }) {
  const expiryInfo = getRemainingDays(timestamp);
  const expiryDate = new Date(parseInt(timestamp) * 1000);
  const formattedDate = expiryDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className={`relative p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
      expiryInfo.urgent
        ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200'
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      <div className={`mb-2 ${expiryInfo.urgent ? 'animate-pulse' : ''} ${
        expiryInfo.urgent ? 'text-orange-600' : 'text-gray-500'
      }`}>
        <Clock />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-600 mb-1">Expires On</p>
        <p className={`text-lg font-bold ${expiryInfo.color}`}>
          {expiryInfo.text}
        </p>
        <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
      </div>
    </div>
  );
}

const MyPlanCard: React.FC<MyPlanCardProps> = React.memo(({ plan }) => {
  const isPremium = plan.name && plan.name.toLowerCase() !== 'free';

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-red-500 to-pink-500 p-6">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-12 h-12 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white rounded-full"></div>
        </div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              {isPremium ? (
                <Crown className="h-6 w-6 text-white" />
              ) : (
                <CreditCard className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-medium text-white/90">Current Plan</h2>
              <p className="text-2xl font-bold text-white">{plan.name}</p>
            </div>
          </div>
          <Link
            href="/dashboard/settings/plan-upgrade"
            className="hidden sm:flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium border border-white/30"
          >
            <TrendingUp className="h-4 w-4" />
            Upgrade
          </Link>
        </div>
      </div>

      {/* Plan Details */}
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          <PlanItem
            icon={<Phone className="h-5 w-5" />}
            label="Contact Views"
            value={plan.contact}
          />
          <PlanItem
            icon={<MessageCircle className="h-5 w-5" />}
            label="Chats"
            value={plan.chat}
          />
          <PlanItem
            icon={<Heart className="h-5 w-5" />}
            label="Interests"
            value={plan.interest}
          />
          <PlanItem
            icon={<Mail className="h-5 w-5" />}
            label="Messages"
            value={plan.message}
          />
          <div className="col-span-2 sm:col-span-1">
            <ExpiryPlanItem timestamp={plan.expire} />
          </div>
        </div>

        {/* Mobile Upgrade Button */}
        <Link
          href="/dashboard/settings/plan-upgrade"
          className="sm:hidden mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-3 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md"
        >
          <TrendingUp className="h-4 w-4" />
          Upgrade Plan
        </Link>
      </div>
    </div>
  );
});

MyPlanCard.displayName = 'MyPlanCard';

export default MyPlanCard;
