'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, Heart, Star, Phone, Loader2, ChevronLeft, ChevronRight, Bookmark, PhoneCall, Check, X } from 'lucide-react';
import ProfileRequestsSection from './ProfileRequestsSection';
import ChatListSection from './ChatListSection';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Profile {
  id: number;
  name: string;
  age: number;
  height: string;
  marital_status: string;
  religion: string;
  caste: string;
  district: string;
  qualification: string;
  photo: string;
  content?: string | null;
  status?: string | null;
  mobile?: string | null;
  phone?: string | null;
}

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
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [respondingTo, setRespondingTo] = useState<number | null>(null);

  const config = sectionConfig[initialSection] || sectionConfig['interests'];

  // Get current view type based on active tab
  const currentViewType = activeTab === 'by_me' ? config.byMeType : config.toMeType;

  useEffect(() => {
    if (token) {
      fetchProfiles();
    }
  }, [token, currentViewType, currentPage]);

  // Reset to page 1 when changing tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // If the section is 'requests', render ProfileRequestsSection instead
  if (initialSection === 'requests') {
    return <ProfileRequestsSection />;
  }

  // If the section is 'messages', render ChatListSection instead
  if (initialSection === 'messages') {
    return <ChatListSection />;
  }

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/communication-views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: currentViewType,
          page: currentPage
        }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setProfiles(result.data || []);
        // Pagination: 5 items per page
        setHasMore(result.data?.length === 5);
      } else {
        setProfiles([]);
      }
    } catch (error) {
      console.error(`Error fetching ${currentViewType}:`, error);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (profileId: number) => {
    router.push(`/profile/${profileId}`);
  };

  const handleInterestResponse = async (matchId: number, status: 'accepted' | 'rejected') => {
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
        // Refresh the profiles list to show updated status
        await fetchProfiles();
      } else {
        console.error('Failed to respond to interest:', result.message);
      }
    } catch (error) {
      console.error('Error responding to interest:', error);
    } finally {
      setRespondingTo(null);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasMore) {
      setCurrentPage(currentPage + 1);
    }
  };

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
            onClick={() => setActiveTab('to_me')}
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
            onClick={() => setActiveTab('by_me')}
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
      ) : profiles.length === 0 ? (
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
          <div className="space-y-4">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => handleProfileClick(profile.id)}
                className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {profile.name}
                    </h4>
                    <span className="text-sm text-gray-500">{profile.age} yrs</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <span>{profile.height} cm</span>
                    <span>•</span>
                    <span>{profile.marital_status}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{profile.district}</span>
                    <span>•</span>
                    <span>{profile.religion}</span>
                  </div>

                  {/* Interest Status */}
                  {profile.status && (
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        profile.status === 'accepted'
                          ? 'bg-green-100 text-green-700'
                          : profile.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                      </span>
                    </div>
                  )}

                  {/* Contact Details */}
                  {profile.mobile && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{profile.mobile}</span>
                      {profile.phone && <span>• {profile.phone}</span>}
                    </div>
                  )}

                  {/* Interest Content */}
                  {profile.content && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {profile.content}
                    </p>
                  )}

                  {/* Action Buttons for Pending Interests (only if received and pending) */}
                  {initialSection === 'interests' && activeTab === 'to_me' && profile.status === 'pending' && (
                    <div className="flex items-center space-x-3 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInterestResponse(profile.id, 'accepted');
                        }}
                        disabled={respondingTo === profile.id}
                        className="flex items-center space-x-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {respondingTo === profile.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            <span className="text-sm font-medium">Accept</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInterestResponse(profile.id, 'rejected');
                        }}
                        disabled={respondingTo === profile.id}
                        className="flex items-center space-x-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {respondingTo === profile.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <X className="h-4 w-4" />
                            <span className="text-sm font-medium">Reject</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
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
