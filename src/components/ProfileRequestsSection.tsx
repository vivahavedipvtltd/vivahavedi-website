'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Phone, Loader2, ChevronLeft, ChevronRight, Check, X, Image as ImageIcon } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ProfileRequest {
  request_id: number;
  request_type: string;
  request_messgae: string | null;
  request_status: number | string; // 0 or "0" = pending, 1 or "1" = accepted, 2 or "2" = rejected
  request_seen: number | string; // 0 or "0" = not seen, 1 or "1" = seen
  id: number; // Sender's user ID
  name: string;
  photo: string;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const ProfileRequestsSection = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [requests, setRequests] = useState<ProfileRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [respondingTo, setRespondingTo] = useState<number | null>(null);

  const fetchProfileRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/profile-request/list?page=${currentPage}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.status === 'success') {
        setRequests(result.data || []);
        setPagination(result.pagination || null);
      } else {
        setRequests([]);
        setPagination(null);
      }
    } catch (error) {
      console.error('Error fetching profile requests:', error);
      setRequests([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [token, currentPage]);

  useEffect(() => {
    if (token) {
      fetchProfileRequests();
    }
  }, [token, fetchProfileRequests]);

  const handlePhotoResponse = useCallback(async (matchId: number, status: 'accept' | 'reject') => {
    try {
      setRespondingTo(matchId);
      const response = await fetch(`${API_BASE_URL}/profile-request/photo-respond`, {
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
        // Refresh the requests list to show updated status
        await fetchProfileRequests();
      } else {
        console.error('Failed to respond to request:', result.message);
      }
    } catch (error) {
      console.error('Error responding to photo request:', error);
    } finally {
      setRespondingTo(null);
    }
  }, [token, fetchProfileRequests]);

  const handleProfileClick = useCallback((profileId: number) => {
    router.push(`/profile/${profileId}`);
  }, [router]);

  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const handleNext = useCallback(() => {
    if (pagination && currentPage < pagination.last_page) {
      setCurrentPage(currentPage + 1);
    }
  }, [pagination, currentPage]);

  const getRequestTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      photo_view: 'Photo View Request',
      photo_lock: 'Photo View Request', // Legacy type
      photo_add: 'Photo Addition Request',
      basic: 'Basic Info Request',
      education: 'Education Details Request',
      family: 'Family Info Request',
      hobbies: 'Hobbies Request',
      astro: 'Astrology Request',
      horoscope: 'Horoscope Request',
      partner_basic: 'Partner Preference Request',
      partner_religion: 'Partner Religion Request',
      partner_location: 'Partner Location Request',
      partner_education: 'Partner Education Request',
      contact_details: 'Contact Details Request',
    };
    return typeLabels[type] || 'Profile Request';
  };

  const getStatusBadge = (status: number | string) => {
    if (status === '1' || status === 1) {
      return (
        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
          Accepted
        </span>
      );
    } else if (status === '2' || status === 2) {
      return (
        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
          Rejected
        </span>
      );
    } else {
      return (
        <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
          Pending
        </span>
      );
    }
  };

  const isPhotoRequest = (type: string) => {
    // Handle both photo_view (new) and photo_lock (old/legacy)
    return type === 'photo_view' || type === 'photo_lock';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Phone className="h-6 w-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-900 ml-3">Profile Requests</h2>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-6">
        Requests received from other users to view your profile information
      </p>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4 text-gray-400">
            <Phone className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-500">No profile requests received yet.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.request_id}
                className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  {/* Profile Photo */}
                  <div
                    className="relative w-16 h-16 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleProfileClick(request.id)}
                  >
                    <Image
                      src={request.photo || '/placeholder-avatar.png'}
                      alt={request.name}
                      fill
                      sizes="64px"
                      className="rounded-full object-cover"
                      unoptimized={request.photo?.includes('vivahavedimatrimony.com')}
                    />
                  </div>

                  {/* Request Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4
                        onClick={() => handleProfileClick(request.id)}
                        className="font-semibold text-gray-900 cursor-pointer hover:text-purple-600 transition-colors"
                      >
                        {request.name}
                      </h4>
                      {getStatusBadge(request.request_status)}
                    </div>

                    {/* Request Type */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <ImageIcon className="h-4 w-4" />
                      <span className="font-medium">{getRequestTypeLabel(request.request_type)}</span>
                    </div>

                    {/* Request Message */}
                    {request.request_messgae && (
                      <p className="text-sm text-gray-600 mb-3">
                        {request.request_messgae}
                      </p>
                    )}

                    {/* Action Buttons for Photo Requests (only if pending) */}
                    {isPhotoRequest(request.request_type) && (request.request_status === '0' || request.request_status === 0) && (
                      <div className="flex items-center space-x-3 mt-3">
                        <button
                          onClick={() => handlePhotoResponse(request.id, 'accept')}
                          disabled={respondingTo === request.id}
                          className="flex items-center space-x-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {respondingTo === request.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="h-4 w-4" />
                              <span className="text-sm font-medium">Accept</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handlePhotoResponse(request.id, 'reject')}
                          disabled={respondingTo === request.id}
                          className="flex items-center space-x-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {respondingTo === request.id ? (
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
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.last_page > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
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
                Page {pagination.current_page} of {pagination.last_page}
              </span>

              <button
                onClick={handleNext}
                disabled={currentPage === pagination.last_page}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  currentPage === pagination.last_page
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

export default ProfileRequestsSection;
