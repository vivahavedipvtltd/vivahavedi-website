import React from 'react';
import WelcomeCard from './WelcomeCard';
import StatisticsCards from './StatisticsCards';
import MyPlanCard from './MyPlanCard';
import ProfileCompletionCard from './ProfileCompletionCard';
import PartnerPreferencesCard from './PartnerPreferencesCard';
import { MyDetails, CommunicationStats, MyPlan, PartnerProfile } from '@/types/dashboard';

interface OverviewSectionProps {
  myDetails: MyDetails;
  communicationStats: CommunicationStats | null;
  myPlan: MyPlan | null;
  partnerProfile: PartnerProfile | null;
  onSectionChange?: (section: string) => void;
}

const OverviewSection: React.FC<OverviewSectionProps> = React.memo(({ myDetails, communicationStats, myPlan, partnerProfile, onSectionChange }) => {
  return (
    <div className="space-y-6">
      <WelcomeCard firstName={myDetails.basic.user_fname} />
      <StatisticsCards stats={communicationStats} />
      {myPlan && <MyPlanCard plan={myPlan} />}
      <ProfileCompletionCard
        profileCompletion={myDetails.profile_completion}
        onSectionChange={onSectionChange}
      />
      <PartnerPreferencesCard partnerProfile={partnerProfile} />
    </div>
  );
});

OverviewSection.displayName = 'OverviewSection';

export default OverviewSection;
