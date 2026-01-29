'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, Heart, Star, Phone, Loader2, ChevronLeft, ChevronRight, PhoneCall, Check, X } from 'lucide-react';
import ProfileRequestsSection from './ProfileRequestsSection';
import ChatListSection from './ChatListSection';
import { useCommunicationViews } from '@/hooks/useDashboardData';
import type { CommunicationViewType } from '@/types/dashboard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface CommunicationViewsSectionProps {
  initialSection?: string;
}

// Map section IDs to communication types
const sectionConfig: Record<string, {
  title: string;
  icon: React.ReactNode;
  byMeType: string;
  toMeType: string;
  byMeLabel: string;
  toMeLabel: string;
}> = {
  'interests': {
    title: 'Interests',
    icon: <Heart className="h-6 w-6 text-red-500" />,
    byMeType: 'interested_by_me',
    toMeType: 'interested_to_me',
    byMeLabel: 'Sent by Me',
    toMeLabel: 'Received'
  },
  'profile-views': {
    title: 'Profile Views',
    icon: <Eye className="h-6 w-6 text-blue-500" />,
    byMeType: 'profile_viewed_by_me',
    toMeType: 'profile_viewed_to_me',
    byMeLabel: 'Viewed by Me',
    toMeLabel: 'Viewed Me'
  },
  'shortlisted': {
    title: 'Shortlisted',
    icon: <Star className="h-6 w-6 text-yellow-500" />,
    byMeType: 'shortlised_by_me',
    toMeType: 'shortlised_to_me',
    byMeLabel: 'Shortlisted by Me',
    toMeLabel: 'Shortlisted Me'
  },
  'contacted': {
    title: 'Contacted',
    icon: <PhoneCall className="h-6 w-6 text-green-500" />,
    byMeType: 'contacted_by_me',
    toMeType: 'contacted_to_me',
    byMeLabel: 'Contacted by Me',
    toMeLabel: 'Contacted Me'
  },
  'viewed-profiles': {
    title: 'Viewed Profiles',
    icon: <Eye className="h-6 w-6 text-purple-500" />,
    byMeType: 'profile_viewed_by_me',
    toMeType: 'profile_viewed_to_me',
    byMeLabel: 'I Viewed',
    toMeLabel: 'Viewed Me'
  }
};

const CommunicationViewsSection = ({ initialSection = 'interests' }: CommunicationViewsSectionProps) => {
  // All hooks must be called before any conditional returns
  const [activeTab, setActiveTab] = useState<'by_me' | 'to_me'>('to_me');
  const router = useRouter();
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [respondingTo, setRespondingTo] = useState<number | null>(null);

  const config = sectionConfig[initialSection] || sectionConfig['interests'];

  // Get current view type based on active tab
  const currentViewType = activeTab === 'by_me' ? config.byMeType : config.toMeType;

  // Use SWR hook for data fetching with automatic caching and deduplication
  const { data: profiles, isLoading: loading, mutate, hasMore } = useCommunicationViews(
    token,
    currentViewType as CommunicationViewType,
    currentPage
  );

  const handleProfileClick = useCallback((profileId: number) => {
    router.push(`/profile/${profileId}`);
  }, [router]);

  const handleInterestResponse = useCallback(async (matchId: number, status: 'accepted' | 'rejected') => {
    try {
      setRespondingTo(matchId);
      const response = await fetch(`${API_BASE_URL}/interest-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          match_id: matchId,
          status: status,
        }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        // Refresh the profiles list using SWR mutate
        await mutate();
      } else {
        console.error('Failed to respond to interest:', result.message);
      }
    } catch (error) {
      console.error('Error responding to interest:', error);
    } finally {
      setRespondingTo(null);
    }
  }, [token, mutate]);

  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const handleNext = useCallback(() => {
    if (hasMore) {
      setCurrentPage(currentPage + 1);
    }
  }, [hasMore, currentPage]);

  // Handle tab changes - reset page and update tab
  const handleTabChange = useCallback((tab: 'by_me' | 'to_me') => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when switching tabs
  }, []);

  // If the section is 'requests', render ProfileRequestsSection instead
  if (initialSection === 'requests') {
    return <ProfileRequestsSection />;
  }

  // If the section is 'messages', render ChatListSection instead
  if (initialSection === 'messages') {
    return <ChatListSection />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        {config.icon}
        <h2 className="text-2xl font-bold text-gray-900 ml-3">{config.title}</h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => handleTabChange('to_me')}
            className={`pb-4 px-1 relative ${
              activeTab === 'to_me'
                ? 'text-red-600 font-semibold'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {config.toMeLabel}
            {activeTab === 'to_me' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
            )}
          </button>
          <button
            onClick={() => handleTabChange('by_me')}
            className={`pb-4 px-1 relative ${
              activeTab === 'by_me'
                ? 'text-red-600 font-semibold'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {config.byMeLabel}
            {activeTab === 'by_me' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
            )}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        </div>
      ) : !profiles || profiles.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4 text-gray-400">
            {config.icon}
          </div>
          <p className="text-gray-500">
            {activeTab === 'to_me'
              ? `No ${config.title.toLowerCase()} received yet.`
              : `No ${config.title.toLowerCase()} sent yet.`}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => handleProfileClick(profile.id)}
                className="group relative bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-xl hover:border-red-200 cursor-pointer transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-pink-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative flex items-start space-x-5">
                  {/* Profile Photo with Badge */}
                  <div className="relative flex-shrink-0">
                    <div className="relative w-20 h-20 ring-4 ring-white shadow-lg rounded-2xl overflow-hidden">
                      <Image
                        src={profile.photo || '/placeholder-avatar.png'}
                        alt={`${profile.name}'s matrimonial profile - View communication on vivahavedi`}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        unoptimized={profile.photo?.includes('vivahavedimatrimony.com')}
                      />
                    </div>
                    {/* Online Status Indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
                  </div>

                  {/* Profile Information */}
                  <div className="flex-1 min-w-0">
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 truncate group-hover:text-red-600 transition-colors">
                          {profile.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm">
                            {profile.age} years
                          </span>
                          {profile.status && (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                              profile.status === 'accepted'
                                ? 'bg-green-100 text-green-700'
                                : profile.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">{profile.height} cm</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="font-medium">{profile.marital_status}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium truncate">{profile.district}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="font-medium truncate">{profile.religion}</span>
                      </div>
                    </div>

                    {/* Contact Details */}
                    {profile.mobile && (
                      <div className="flex items-center space-x-2 text-sm bg-gray-50 rounded-lg px-3 py-2 mb-3">
                        <Phone className="h-4 w-4 text-red-500" />
                        <span className="font-medium text-gray-700">{profile.mobile}</span>
                        {profile.phone && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="font-medium text-gray-700">{profile.phone}</span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Interest Content */}
                    {profile.content && (
                      <p className="text-sm text-gray-600 bg-blue-50 rounded-lg px-3 py-2 mb-3 line-clamp-2 italic">
                        &ldquo;{profile.content}&rdquo;
                      </p>
                    )}

                    {/* Action Buttons for Pending Interests (only if received and pending) */}
                    {initialSection === 'interests' && activeTab === 'to_me' && profile.status === 'pending' && (
                      <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInterestResponse(profile.id, 'accepted');
                          }}
                          disabled={respondingTo === profile.id}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {respondingTo === profile.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="h-5 w-5" />
                              <span>Accept</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInterestResponse(profile.id, 'rejected');
                          }}
                          disabled={respondingTo === profile.id}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {respondingTo === profile.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <X className="h-5 w-5" />
                              <span>Reject</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* View Profile Arrow */}
                <div className="absolute top-5 right-5 w-8 h-8 bg-red-50 rounded-full flex items-center justify-center group-hover:bg-red-500 transition-all duration-300">
                  <svg className="w-4 h-4 text-red-500 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {(currentPage > 1 || hasMore) && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {currentPage}
              </span>

              <button
                onClick={handleNext}
                disabled={!hasMore}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  !hasMore
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommunicationViewsSection;
