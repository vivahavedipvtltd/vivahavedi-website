import React from 'react';
import PrivacySettings from '@/components/PrivacySettings';
import { MyPhotos, MyDetails } from '@/types/dashboard';

interface AccountSettingsSectionProps {
  myDetails: MyDetails | null;
  myPhotos: MyPhotos | null;
  onRefresh: () => void;
}

const AccountSettingsSection: React.FC<AccountSettingsSectionProps> = React.memo(({ myDetails, myPhotos, onRefresh }) => {
  const photoLocked = myPhotos?.lock_status === 'yes';
  const profileHidden = myDetails?.basic?.user_hide === 'yes';
  const contactLocked = myDetails?.basic?.user_contact_lock === 'yes';

  return (
    <div className="space-y-6">
      {/* Privacy Settings */}
      <PrivacySettings
        initialPhotoLocked={photoLocked}
        initialProfileHidden={profileHidden}
        initialContactLocked={contactLocked}
        onUpdate={onRefresh}
      />

      {/* Other Settings Placeholder */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Settings</h2>
        <p className="text-gray-600 mb-4">Additional account settings and preferences</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:border-red-300 transition-colors">
            <h3 className="font-semibold text-gray-900 mb-2">Notification Preferences</h3>
            <p className="text-sm text-gray-600">Manage email and push notification settings</p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg hover:border-red-300 transition-colors">
            <h3 className="font-semibold text-gray-900 mb-2">Account Security</h3>
            <p className="text-sm text-gray-600">Manage your password and security settings</p>
          </div>
        </div>
      </div>
    </div>
  );
});

AccountSettingsSection.displayName = 'AccountSettingsSection';

export default AccountSettingsSection;
