import React from 'react';
import { CreditCard, Phone, MessageCircle, Heart, Mail, Clock, Crown, TrendingUp, Sparkles } from 'lucide-react';
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

function PlanItem({ icon, label, value, highlight = false, iconColor }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean; iconColor?: string }) {
  return (
    <div className={`group relative p-5 rounded-lg transition-all duration-300 ${
      highlight
        ? 'bg-gradient-to-br from-red-50/50 via-pink-50/30 to-white border border-red-100 hover:shadow-lg hover:shadow-red-100/50 hover:border-red-200'
        : 'bg-white border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200'
    }`}>
      {/* Decorative gradient overlay */}
      <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
        highlight
          ? 'bg-gradient-to-br from-red-500/5 to-pink-500/5'
          : 'bg-gradient-to-br from-gray-500/5 to-gray-400/5'
      }`}></div>

      <div className="relative">
        <div className={`inline-flex p-2.5 rounded-lg mb-3 transition-transform duration-300 group-hover:scale-110 ${
          iconColor || (highlight
            ? 'bg-gradient-to-br from-red-100 to-pink-100 text-red-600'
            : 'bg-gray-50 text-gray-600 group-hover:bg-gray-100')
        }`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</p>
          <p className={`text-2xl font-bold ${highlight ? 'text-red-600' : 'text-gray-900'}`}>{value}</p>
        </div>
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
    <div className={`group relative p-5 rounded-lg transition-all duration-300 ${
      expiryInfo.urgent
        ? 'bg-gradient-to-br from-orange-50/50 via-red-50/30 to-white border border-orange-100 hover:shadow-lg hover:shadow-orange-100/50 hover:border-orange-200'
        : 'bg-white border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200'
    }`}>
      {/* Decorative gradient overlay */}
      <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
        expiryInfo.urgent
          ? 'bg-gradient-to-br from-orange-500/5 to-red-500/5'
          : 'bg-gradient-to-br from-gray-500/5 to-gray-400/5'
      }`}></div>

      <div className="relative">
        <div className={`inline-flex p-2.5 rounded-lg mb-3 transition-transform duration-300 group-hover:scale-110 ${
          expiryInfo.urgent
            ? 'bg-gradient-to-br from-orange-100 to-red-100 text-orange-600'
            : 'bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-cyan-100'
        } ${expiryInfo.urgent ? 'animate-pulse' : ''}`}>
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Expires On</p>
          <p className={`text-2xl font-bold ${expiryInfo.color}`}>
            {expiryInfo.text}
          </p>
          <p className="text-xs text-gray-500 mt-2 font-medium">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
}

const MyPlanCard: React.FC<MyPlanCardProps> = React.memo(({ plan }) => {
  const isPremium = plan.name && plan.name.toLowerCase() !== 'free';

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Elegant Header - No background color */}
      <div className="relative p-8 border-b border-gray-100">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-red-50 via-pink-50 to-transparent rounded-bl-full opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-50 via-pink-50 to-transparent rounded-tr-full opacity-30"></div>

        <div className="relative flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Elegant icon container */}
            <div className={`relative p-3.5 rounded-2xl transition-all duration-300 ${
              isPremium
                ? 'bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-50 shadow-lg shadow-amber-200/50'
                : 'bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 shadow-lg shadow-gray-200/50'
            }`}>
              {isPremium ? (
                <>
                  <Crown className="h-7 w-7 text-amber-600 relative z-10" />
                  <Sparkles className="h-3 w-3 text-amber-400 absolute top-1 right-1 animate-pulse" />
                </>
              ) : (
                <CreditCard className="h-7 w-7 text-gray-600" />
              )}
            </div>

            {/* Plan name and label - NO background */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Plan</p>
                {isPremium && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                    Premium
                  </span>
                )}
              </div>
              <h2 className={`text-3xl font-bold tracking-tight ${
                isPremium
                  ? 'bg-gradient-to-r from-amber-600 via-red-600 to-pink-600 bg-clip-text text-transparent'
                  : 'text-gray-900'
              }`}>
                {plan.name}
              </h2>
              {plan.default === 'yes' && (
                <p className="text-sm text-gray-500 mt-1 font-medium">Default subscription plan</p>
              )}
            </div>
          </div>

          {/* Desktop upgrade button */}
          <Link
            href="/dashboard/settings/plan-upgrade"
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-5 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105"
          >
            <TrendingUp className="h-4 w-4" />
            Upgrade Plan
          </Link>
        </div>
      </div>

      {/* Plan Details with elegant spacing */}
      <div className="p-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <PlanItem
            icon={<Phone className="h-5 w-5" />}
            label="Contact Views"
            value={plan.contact}
            iconColor="bg-gradient-to-br from-green-100 to-emerald-100 text-green-600 group-hover:from-green-200 group-hover:to-emerald-200"
          />
          <PlanItem
            icon={<MessageCircle className="h-5 w-5" />}
            label="Chats"
            value={plan.chat}
            iconColor="bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 group-hover:from-blue-200 group-hover:to-cyan-200"
          />
          <PlanItem
            icon={<Heart className="h-5 w-5" />}
            label="Interests"
            value={plan.interest}
            iconColor="bg-gradient-to-br from-red-100 to-pink-100 text-red-600 group-hover:from-red-200 group-hover:to-pink-200"
          />
          <PlanItem
            icon={<Mail className="h-5 w-5" />}
            label="Messages"
            value={plan.message}
            iconColor="bg-gradient-to-br from-purple-100 to-violet-100 text-purple-600 group-hover:from-purple-200 group-hover:to-violet-200"
          />
          <div className="col-span-2 lg:col-span-1">
            <ExpiryPlanItem timestamp={plan.expire} />
          </div>
        </div>

        {/* Mobile Upgrade Button */}
        <Link
          href="/dashboard/settings/plan-upgrade"
          className="sm:hidden mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-5 py-3.5 rounded-xl transition-all duration-200 text-sm font-bold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40"
        >
          <TrendingUp className="h-5 w-5" />
          Upgrade Plan
        </Link>
      </div>
    </div>
  );
});

MyPlanCard.displayName = 'MyPlanCard';

export default MyPlanCard;
