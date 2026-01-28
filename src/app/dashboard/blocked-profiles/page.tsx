'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Ban, Loader2, User, AlertCircle, CheckCircle } from 'lucide-react';
import { getBlockedProfiles, unblockProfile, BlockedProfile } from '@/lib/profileBlockApi';

const BlockedProfilesPage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [blockedProfiles, setBlockedProfiles] = useState<BlockedProfile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [unblockingId, setUnblockingId] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    profileId: number;
    profileName: string;
  }>({ isOpen: false, profileId: 0, profileName: '' });

  useEffect(() => {
    if (token) {
      fetchBlockedProfiles();
    }
  }, [token]);

  const fetchBlockedProfiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getBlockedProfiles(token!);

      if (result.status === 'success') {
        setBlockedProfiles(result.data || []);
      } else {
        setError(result.message || 'Failed to load blocked profiles');
      }
    } catch (error) {
      console.error('Error fetching blocked profiles:', error);
      setError('An error occurred while loading blocked profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockClick = (profileId: number, profileName: string) => {
    setConfirmDialog({ isOpen: true, profileId, profileName });
  };

  const handleUnblockConfirm = async () => {
    const { profileId, profileName } = confirmDialog;
    setConfirmDialog({ isOpen: false, profileId: 0, profileName: '' });

    if (unblockingId !== null) return;

    try {
      setUnblockingId(profileId);

      const result = await unblockProfile(token!, profileId);

      if (result.status === 'success') {
        // Remove from list
        setBlockedProfiles(prev => prev.filter(profile => profile.id !== profileId));

        // Show success message
        showSuccess(`${profileName} has been unblocked successfully!`);
      } else {
        showError(result.message || 'Failed to unblock profile');
      }
    } catch (error) {
      console.error('Error unblocking profile:', error);
      showError('An error occurred while unblocking profile');
    } finally {
      setUnblockingId(null);
    }
  };

  const handleUnblockCancel = () => {
    setConfirmDialog({ isOpen: false, profileId: 0, profileName: '' });
  };

  const handleViewProfile = (profileId: number) => {
    router.push(`/profile/${profileId}`);
  };

  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <div className="h-screen flex flex-col">
        <Header />

        <div className="flex-1 flex bg-gray-50 overflow-hidden">
          <DashboardSidebar
            activeSection="blocked-profiles"
            onSectionChange={(section) => {
              // Navigate to dashboard for sections handled there
              router.push('/dashboard');
            }}
          />

          <main className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-6xl mx-auto">
              {/* Page Header */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Ban className="h-6 w-6 mr-3 text-red-500" />
                      Blocked Profiles
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Manage profiles you have blocked
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Total Blocked</div>
                    <div className="text-2xl font-bold text-red-600">
                      {blockedProfiles.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
                  <p className="text-gray-600">Loading blocked profiles...</p>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <div className="flex items-center justify-center text-red-600 mb-4">
                    <AlertCircle className="h-12 w-12" />
                  </div>
                  <p className="text-center text-gray-900 font-semibold mb-2">
                    Error Loading Blocked Profiles
                  </p>
                  <p className="text-center text-gray-600 mb-4">{error}</p>
                  <div className="text-center">
                    <button
                      onClick={fetchBlockedProfiles}
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && blockedProfiles.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <div className="flex items-center justify-center text-gray-400 mb-4">
                    <CheckCircle className="h-16 w-16" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No Blocked Profiles
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You haven&apos;t blocked any profiles yet.
                  </p>
                  <button
                    onClick={() => router.push('/search')}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Search Profiles
                  </button>
                </div>
              )}

              {/* Blocked Profiles Grid */}
              {!loading && !error && blockedProfiles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blockedProfiles.map((profile) => (
                    <div
                      key={profile.block_id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Profile Photo */}
                      <div className="aspect-w-16 aspect-h-12 bg-gray-200 relative h-48">
                        <Image
                          src={profile.photo || '/images/default-avatar.png'}
                          alt={profile.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Blocked
                        </div>
                      </div>

                      {/* Profile Info */}
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          {profile.name}
                        </h3>

                        <div className="text-sm text-gray-600 mb-4">
                          <p>Profile ID: {profile.id}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewProfile(profile.id)}
                            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => handleUnblockClick(profile.id, profile.name)}
                            disabled={unblockingId === profile.id}
                            className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          >
                            {unblockingId === profile.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Unblocking...
                              </>
                            ) : (
                              'Unblock'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Info Box */}
              {!loading && !error && blockedProfiles.length > 0 && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">About Blocked Profiles</h4>
                  <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
                    <li>Blocked profiles will not appear in your search results</li>
                    <li>They cannot send you messages or express interest</li>
                    <li>You can unblock a profile at any time</li>
                    <li>Blocked users are not notified about being blocked</li>
                  </ul>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title="Unblock Profile"
          message={`Are you sure you want to unblock ${confirmDialog.profileName}? They will be able to see your profile and contact you again.`}
          confirmText="Unblock"
          cancelText="Cancel"
          confirmButtonClass="bg-green-500 hover:bg-green-600"
          onConfirm={handleUnblockConfirm}
          onCancel={handleUnblockCancel}
        />
      </div>
    </AuthGuard>
  );
};

export default BlockedProfilesPage;
