'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import {
  Heart,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';
import { getMatchingProfiles, getMatchingProfilesCount, MatchingProfile } from '@/lib/matchingProfilesApi';

type MatchTab = 'latest' | 'perfect';

const MatchingProfilesPage = () => {
  const router = useRouter();
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<MatchTab>('latest');
  const [profiles, setProfiles] = useState<MatchingProfile[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [latestCount, setLatestCount] = useState(0);
  const [perfectCount, setPerfectCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const perPage = 5;
  const totalCount = activeTab === 'latest' ? latestCount : perfectCount;
  const totalPages = Math.ceil(totalCount / perPage);

  const fetchCounts = useCallback(async () => {
    if (!token) return;

    try {
      const [latestResult, perfectResult] = await Promise.all([
        getMatchingProfilesCount(token, 'latest_match_count'),
        getMatchingProfilesCount(token, 'perfect_match_count'),
      ]);

      if (latestResult.status === 'success' && latestResult.data !== undefined) {
        setLatestCount(latestResult.data);
      }

      if (perfectResult.status === 'success' && perfectResult.data !== undefined) {
        setPerfectCount(perfectResult.data);
      }
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  }, [token]);

  const fetchProfiles = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const matchType = activeTab === 'latest' ? 'latest_match' : 'perfect_match';
      const result = await getMatchingProfiles(token, matchType, currentPage);

      if (result.status === 'success') {
        setProfiles(result.data || []);
      } else {
        setError(result.message || 'Failed to load matching profiles');
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setError('An error occurred while loading matching profiles');
    } finally {
      setLoading(false);
    }
  }, [token, activeTab, currentPage]);

  useEffect(() => {
    if (token) {
      fetchCounts();
    }
  }, [token, fetchCounts]);

  useEffect(() => {
    if (token) {
      fetchProfiles();
    }
  }, [token, fetchProfiles]);

  const handleTabChange = (tab: MatchTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleProfileClick = (profileId: number) => {
    router.push(`/profile/${profileId}`);
  };

  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <div className="min-h-screen flex flex-col">
        <Header />

        <div className="flex-grow flex bg-gray-50">
          <DashboardSidebar
            activeSection="matching-profiles"
            onSectionChange={() => {
              // Navigate to dashboard for sections handled there
              router.push('/dashboard');
            }}
          />

          <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Heart className="h-6 w-6 mr-3 text-red-500" />
                      Matching Profiles
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Profiles that match your partner preferences
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-md mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    <button
                      onClick={() => handleTabChange('latest')}
                      className={`flex-1 py-4 px-6 text-center border-b-2 font-medium transition-colors ${
                        activeTab === 'latest'
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <Users className="h-5 w-5 mr-2" />
                        <span>Latest Matches</span>
                        {latestCount > 0 && (
                          <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600">
                            {latestCount}
                          </span>
                        )}
                      </div>
                    </button>
                    <button
                      onClick={() => handleTabChange('perfect')}
                      className={`flex-1 py-4 px-6 text-center border-b-2 font-medium transition-colors ${
                        activeTab === 'perfect'
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <Sparkles className="h-5 w-5 mr-2" />
                        <span>Perfect Matches</span>
                        {perfectCount > 0 && (
                          <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600">
                            {perfectCount}
                          </span>
                        )}
                      </div>
                    </button>
                  </nav>
                </div>

                {/* Tab Info */}
                <div className="p-4 bg-blue-50 border-t border-blue-100">
                  {activeTab === 'latest' ? (
                    <p className="text-sm text-blue-800">
                      <strong>Latest Matches:</strong> Profiles matching your basic partner preferences
                      (age, height, religion, caste, marital status, state)
                    </p>
                  ) : (
                    <p className="text-sm text-blue-800">
                      <strong>Perfect Matches:</strong> Profiles with stricter matching criteria
                      (includes district and qualification level filters for better compatibility)
                    </p>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
                  <p className="text-gray-600">Loading matching profiles...</p>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <div className="flex items-center justify-center text-red-600 mb-4">
                    <AlertCircle className="h-12 w-12" />
                  </div>
                  <p className="text-center text-gray-900 font-semibold mb-2">
                    Error Loading Profiles
                  </p>
                  <p className="text-center text-gray-600 mb-4">{error}</p>
                  <div className="text-center">
                    <button
                      onClick={fetchProfiles}
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && profiles.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No Matching Profiles Found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {activeTab === 'latest'
                      ? 'We couldn\'t find any profiles matching your partner preferences. Try updating your preferences to find more matches.'
                      : 'No perfect matches found. Try the Latest Matches tab or update your partner preferences for more options.'}
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => router.push('/dashboard/profile/partner-basic')}
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      Update Preferences
                    </button>
                    {activeTab === 'perfect' && (
                      <button
                        onClick={() => handleTabChange('latest')}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                      >
                        View Latest Matches
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Profiles Grid */}
              {!loading && !error && profiles.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                    {profiles.map((profile) => (
                      <div
                        key={profile.id}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col"
                        onClick={() => handleProfileClick(profile.id)}
                      >
                        <div className="bg-gray-200 relative flex-shrink-0">
                          <Image
                            src={profile.photo || '/images/default-avatar.png'}
                            alt={profile.name}
                            width={400}
                            height={352}
                            className="w-full h-[22rem] object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          {activeTab === 'perfect' && (
                            <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Perfect Match
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex flex-col h-[19rem]">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                            {profile.name}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600 flex-grow overflow-y-auto">
                            <p>
                              <span className="font-medium">Age:</span> {profile.age} years
                            </p>
                            <p>
                              <span className="font-medium">Height:</span> {profile.height}
                            </p>
                            <p>
                              <span className="font-medium">Status:</span>{' '}
                              {profile.marital_status}
                            </p>
                            <p>
                              <span className="font-medium">Religion:</span> {profile.religion}
                            </p>
                            <p>
                              <span className="font-medium">Caste:</span> {profile.caste}
                            </p>
                            <p>
                              <span className="font-medium">Location:</span> {profile.district}
                            </p>
                            <p>
                              <span className="font-medium">Education:</span>{' '}
                              {profile.qualification}
                            </p>
                          </div>
                          <button className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex-shrink-0">
                            View Profile
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="bg-white rounded-lg shadow-md p-4">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1 || loading}
                          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="h-5 w-5 mr-1" />
                          Previous
                        </button>

                        <div className="flex items-center space-x-2">
                          <span className="text-gray-700">
                            Page {currentPage} of {totalPages}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({profiles.length} of {totalCount} profiles)
                          </span>
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages || loading}
                          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                          <ChevronRight className="h-5 w-5 ml-1" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Info Box */}
              {!loading && !error && profiles.length > 0 && (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">💡 Tip</h4>
                  <ul className="text-sm text-yellow-800 space-y-1 ml-4 list-disc">
                    <li>Click on any profile to view complete details</li>
                    <li>Perfect matches use stricter criteria for better compatibility</li>
                    <li>Update your partner preferences anytime from the dashboard</li>
                    <li>New profiles are added regularly - check back often!</li>
                  </ul>
                </div>
              )}
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </AuthGuard>
  );
};

export default MatchingProfilesPage;
