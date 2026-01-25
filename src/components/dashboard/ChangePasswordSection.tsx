import React from 'react';
import PasswordChangeSettings from '@/components/PasswordChangeSettings';

const ChangePasswordSection: React.FC = React.memo(() => {
  return (
    <div className="space-y-6">
      <PasswordChangeSettings />
    </div>
  );
});

ChangePasswordSection.displayName = 'ChangePasswordSection';

export default ChangePasswordSection;
