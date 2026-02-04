'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, Unlock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { lockUnlockPhoto, hideShowProfile } from '@/lib/profileSettingsApi';
import { lockUnlockContactView } from '@/lib/contactRequestApi';

interface PrivacySettingsProps {
  initialPhotoLocked?: boolean;
  initialProfileHidden?: boolean;
  initialContactLocked?: boolean;
  onUpdate?: () => void;
}

const PrivacySettings = ({
  initialPhotoLocked = false,
  initialProfileHidden = false,
  initialContactLocked = false,
  onUpdate
}: PrivacySettingsProps) => {
  const { token } = useAuth();
  const [photoLocked, setPhotoLocked] = useState(initialPhotoLocked);
  const [profileHidden, setProfileHidden] = useState(initialProfileHidden);
  const [contactLocked, setContactLocked] = useState(initialContactLocked);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setPhotoLocked(initialPhotoLocked);
  }, [initialPhotoLocked]);

  useEffect(() => {
    setProfileHidden(initialProfileHidden);
  }, [initialProfileHidden]);

  useEffect(() => {
    setContactLocked(initialContactLocked);
  }, [initialContactLocked]);

  const handlePhotoLockToggle = async () => {
    if (!token || photoLoading) return;

    const newLockState = !photoLocked;

    try {
      setPhotoLoading(true);
      setMessage(null);

      const result = await lockUnlockPhoto(token, newLockState);

      if (result.status === 'success') {
        setPhotoLocked(newLockState);
        setMessage({
          type: 'success',
          text: result.mesage || (newLockState ? 'Photos locked successfully' : 'Photos unlocked successfully')
        });

        // Call onUpdate callback if provided
        if (onUpdate) {
          onUpdate();
        }
      } else {
        setMessage({
          type: 'error',
          text: result.message || result.mesage || 'Failed to update photo lock status'
        });
      }
    } catch (error) {
      console.error('Error toggling photo lock:', error);
      setMessage({
        type: 'error',
        text: 'An error occurred while updating photo lock status'
      });
    } finally {
      setPhotoLoading(false);

      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleProfileHideToggle = async () => {
    if (!token || profileLoading) return;

    const newHideState = !profileHidden;

    try {
      setProfileLoading(true);
      setMessage(null);

      const result = await hideShowProfile(token, newHideState);

      if (result.status === 'success') {
        setProfileHidden(newHideState);
        setMessage({
          type: 'success',
          text: result.mesage || (newHideState ? 'Profile hidden successfully' : 'Profile visible successfully')
        });

        // Call onUpdate callback if provided
        if (onUpdate) {
          onUpdate();
        }
      } else {
        setMessage({
          type: 'error',
          text: result.message || result.mesage || 'Failed to update profile visibility'
        });
      }
    } catch (error) {
      console.error('Error toggling profile visibility:', error);
      setMessage({
        type: 'error',
        text: 'An error occurred while updating profile visibility'
      });
    } finally {
      setProfileLoading(false);

      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleContactLockToggle = async () => {
    if (!token || contactLoading) return;

    const newLockState = !contactLocked;

    try {
      setContactLoading(true);
      setMessage(null);

      const result = await lockUnlockContactView(token, newLockState);

      if (result.status === 'success') {
        setContactLocked(newLockState);
        setMessage({
          type: 'success',
          text: result.mesage || (newLockState ? 'Contact view locked successfully' : 'Contact view unlocked successfully')
        });

        // Call onUpdate callback if provided
        if (onUpdate) {
          onUpdate();
        }
      } else {
        setMessage({
          type: 'error',
          text: result.message || result.mesage || 'Failed to update contact lock status'
        });
      }
    } catch (error) {
      console.error('Error toggling contact lock:', error);
      setMessage({
        type: 'error',
        text: 'An error occurred while updating contact lock status'
      });
    } finally {
      setContactLoading(false);

      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacy Settings</h2>
      <p className="text-gray-600 mb-6">Control who can see your profile and photos</p>

      {/* Feedback Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-start ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
          )}
          <p className={`text-sm font-medium ${
            message.type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {message.text}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Photo Lock Setting */}
        <div className="border border-gray-200 rounded-lg p-6 hover:border-red-300 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                {photoLocked ? (
                  <Lock className="h-6 w-6 text-red-500 mr-3" />
                ) : (
                  <Unlock className="h-6 w-6 text-green-500 mr-3" />
                )}
                <h3 className="text-lg font-semibold text-gray-900">Photo Privacy</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {photoLocked
                  ? 'Your photos are currently locked and only visible to you.'
                  : 'Your photos are currently visible to other users based on your plan settings.'}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <p className="font-medium mb-1">ℹ️ How it works:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li><strong>Locked:</strong> Photos are only visible to you</li>
                  <li><strong>Unlocked:</strong> Photos are visible based on your plan permissions</li>
                </ul>
              </div>
            </div>
            <div className="ml-6">
              <button
                onClick={handlePhotoLockToggle}
                disabled={photoLoading}
                className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors ${
                  photoLocked
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {photoLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white mx-auto" />
                ) : (
                  <>
                    <span
                      className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform ${
                        photoLocked ? 'translate-x-1' : 'translate-x-12'
                      }`}
                    >
                      {photoLocked ? (
                        <Lock className="h-6 w-6 text-red-500 m-2" />
                      ) : (
                        <Unlock className="h-6 w-6 text-green-500 m-2" />
                      )}
                    </span>
                    <span className={`absolute text-xs font-semibold text-white ${
                      photoLocked ? 'right-2' : 'left-2'
                    }`}>
                      {photoLocked ? 'ON' : 'OFF'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Visibility Setting */}
        <div className="border border-gray-200 rounded-lg p-6 hover:border-red-300 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                {profileHidden ? (
                  <EyeOff className="h-6 w-6 text-red-500 mr-3" />
                ) : (
                  <Eye className="h-6 w-6 text-green-500 mr-3" />
                )}
                <h3 className="text-lg font-semibold text-gray-900">Profile Visibility</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {profileHidden
                  ? 'Your profile is currently hidden from search results.'
                  : 'Your profile is currently visible in search results and matching profiles.'}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <p className="font-medium mb-1">ℹ️ How it works:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li><strong>Hidden:</strong> Profile won&apos;t appear in searches or matching profiles</li>
                  <li><strong>Visible:</strong> Profile appears normally in search results</li>
                  <li>Direct profile links may still be accessible when hidden</li>
                </ul>
              </div>
            </div>
            <div className="ml-6">
              <button
                onClick={handleProfileHideToggle}
                disabled={profileLoading}
                className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors ${
                  profileHidden
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {profileLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white mx-auto" />
                ) : (
                  <>
                    <span
                      className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform ${
                        profileHidden ? 'translate-x-1' : 'translate-x-12'
                      }`}
                    >
                      {profileHidden ? (
                        <EyeOff className="h-6 w-6 text-red-500 m-2" />
                      ) : (
                        <Eye className="h-6 w-6 text-green-500 m-2" />
                      )}
                    </span>
                    <span className={`absolute text-xs font-semibold text-white ${
                      profileHidden ? 'right-2' : 'left-2'
                    }`}>
                      {profileHidden ? 'ON' : 'OFF'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Contact Lock Setting */}
        <div className="border border-gray-200 rounded-lg p-6 hover:border-red-300 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                {contactLocked ? (
                  <ShieldCheck className="h-6 w-6 text-red-500 mr-3" />
                ) : (
                  <ShieldCheck className="h-6 w-6 text-green-500 mr-3" />
                )}
                <h3 className="text-lg font-semibold text-gray-900">Contact View Protection</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {contactLocked
                  ? 'Your contact details are protected. Users must send a request to view your contact information.'
                  : 'Users can view your contact details directly based on their plan permissions.'}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <p className="font-medium mb-1">ℹ️ How it works:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li><strong>Locked:</strong> Users must send a request to view your contact details</li>
                  <li><strong>Unlocked:</strong> Users can view your contact directly (based on plan)</li>
                  <li>You can approve or reject each request individually</li>
                  <li>Contact view count decreases only when you accept a request</li>
                </ul>
              </div>
              {contactLocked && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                  <p className="font-medium">✅ Your contact details are now protected!</p>
                  <p className="mt-1">You&apos;ll receive requests in the &quot;Contacted Me&quot; section when someone wants to view your contact information.</p>
                </div>
              )}
            </div>
            <div className="ml-6">
              <button
                onClick={handleContactLockToggle}
                disabled={contactLoading}
                className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors ${
                  contactLocked
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {contactLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white mx-auto" />
                ) : (
                  <>
                    <span
                      className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform ${
                        contactLocked ? 'translate-x-1' : 'translate-x-12'
                      }`}
                    >
                      <ShieldCheck className={`h-6 w-6 m-2 ${contactLocked ? 'text-red-500' : 'text-green-500'}`} />
                    </span>
                    <span className={`absolute text-xs font-semibold text-white ${
                      contactLocked ? 'right-2' : 'left-2'
                    }`}>
                      {contactLocked ? 'ON' : 'OFF'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Information Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Important Privacy Information
          </h4>
          <ul className="text-sm text-yellow-800 space-y-1 ml-7 list-disc">
            <li>These settings help protect your privacy on the platform</li>
            <li>You can change these settings anytime</li>
            <li>Changes take effect immediately</li>
            <li>Hiding your profile may reduce your chances of receiving matches</li>
            <li>Locking photos prevents others from viewing them regardless of plan permissions</li>
            <li>Contact lock allows you to control who can view your contact details through a request system</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
