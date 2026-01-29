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
          <div className="grid grid-cols-1 gap-5">
            {requests.map((request) => (
              <div
                key={request.request_id}
                className="group relative bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-xl hover:border-purple-200 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative flex items-start space-x-5">
                  {/* Profile Photo with Badge */}
                  <div
                    className="relative flex-shrink-0 cursor-pointer"
                    onClick={() => handleProfileClick(request.id)}
                  >
                    <div className="relative w-20 h-20 ring-4 ring-white shadow-lg rounded-2xl overflow-hidden">
                      <Image
                        src={request.photo || '/placeholder-avatar.png'}
                        alt={`${request.name}'s matrimonial profile - ${request.request_status} profile request on vivahavedi`}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        unoptimized={request.photo?.includes('vivahavedimatrimony.com')}
                      />
                    </div>
                    {/* Request Type Badge */}
                    <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-purple-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="flex-1 min-w-0">
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4
                          onClick={() => handleProfileClick(request.id)}
                          className="text-lg font-bold text-gray-900 cursor-pointer hover:text-purple-600 transition-colors truncate"
                        >
                          {request.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm">
                            {getRequestTypeLabel(request.request_type)}
                          </span>
                          {getStatusBadge(request.request_status)}
                        </div>
                      </div>
                    </div>

                    {/* Request Message */}
                    {request.request_messgae && (
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl px-4 py-3 mb-3 border-l-4 border-purple-500">
                        <p className="text-sm text-gray-700 italic">
                          &ldquo;{request.request_messgae}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Action Buttons for Photo Requests (only if pending) */}
                    {isPhotoRequest(request.request_type) && (request.request_status === '0' || request.request_status === 0) && (
                      <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handlePhotoResponse(request.id, 'accept')}
                          disabled={respondingTo === request.id}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {respondingTo === request.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="h-5 w-5" />
                              <span>Accept</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handlePhotoResponse(request.id, 'reject')}
                          disabled={respondingTo === request.id}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {respondingTo === request.id ? (
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
                <div className="absolute top-5 right-5 w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center group-hover:bg-purple-500 transition-all duration-300">
                  <svg className="w-4 h-4 text-purple-500 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
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
