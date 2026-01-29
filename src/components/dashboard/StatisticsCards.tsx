import React from 'react';
import { Eye, Heart, MessageCircle, Phone } from 'lucide-react';
import StatCard from './StatCard';
import { CommunicationStats } from '@/types/dashboard';

interface StatisticsCardsProps {
  stats: CommunicationStats | null;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = React.memo(({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<Eye className="h-6 w-6" />}
        title="Profile Views"
        value={stats?.profile_view || 0}
        color="blue"
        href="/dashboard?section=profile-views"
      />
      <StatCard
        icon={<Heart className="h-6 w-6" />}
        title="Interests"
        value={stats?.profile_interest || 0}
        color="red"
        href="/dashboard?section=interests"
      />
      <StatCard
        icon={<MessageCircle className="h-6 w-6" />}
        title="Messages"
        value={stats?.profile_chat || 0}
        color="green"
        href="/dashboard?section=messages"
      />
      <StatCard
        icon={<Phone className="h-6 w-6" />}
        title="Requests"
        value={stats?.profile_request || 0}
        color="purple"
        href="/dashboard?section=requests"
      />
    </div>
  );
});

StatisticsCards.displayName = 'StatisticsCards';

export default StatisticsCards;
