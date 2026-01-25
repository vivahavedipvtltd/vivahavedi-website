import React from 'react';
import { CreditCard, Phone, MessageCircle, Heart, Mail, Clock } from 'lucide-react';
import { MyPlan } from '@/types/dashboard';

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

function PlanItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="text-red-500">{icon}</div>
      <div>
        <p className="text-xs text-gray-600">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function ExpiryPlanItem({ timestamp }: { timestamp: string }) {
  const expiryInfo = getRemainingDays(timestamp);

  return (
    <div className="flex items-center space-x-3">
      <div className={`${expiryInfo.urgent ? 'text-red-500 animate-pulse' : 'text-red-500'}`}>
        <Clock />
      </div>
      <div>
        <p className="text-xs text-gray-600">Expires</p>
        <p className={`text-sm font-semibold ${expiryInfo.color}`}>
          {expiryInfo.text}
        </p>
      </div>
    </div>
  );
}

const MyPlanCard: React.FC<MyPlanCardProps> = React.memo(({ plan }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">My Plan</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <PlanItem icon={<CreditCard />} label="Plan" value={plan.name} />
        <PlanItem icon={<Phone />} label="Contact Views" value={plan.contact} />
        <PlanItem icon={<MessageCircle />} label="Chats" value={plan.chat} />
        <PlanItem icon={<Heart />} label="Interests" value={plan.interest} />
        <PlanItem icon={<Mail />} label="Messages" value={plan.message} />
        <ExpiryPlanItem timestamp={plan.expire} />
      </div>
    </div>
  );
});

MyPlanCard.displayName = 'MyPlanCard';

export default MyPlanCard;
