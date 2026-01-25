'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import {
  User,
  Heart,
  Star,
  MapPin,
  GraduationCap,
  Users,
  Home,
  Calendar,
  Eye,
  MessageCircle,
  Phone,
  Loader2,
  ArrowLeft,
  Ban,
  Flag,
  Bookmark,
  CheckCircle,
  XCircle,
  Image as ImageIcon
} from 'lucide-react';
import ChatModal from '@/components/ChatModal';
import { blockProfile, unblockProfile } from '@/lib/profileBlockApi';
import { reportProfile, REPORT_REASONS } from '@/lib/reportProfileApi';

interface ProfileData {
  basic: {
    user_id: number;
    user_fname: string;
    user_lname: string;
    user_gender: string;
    age: number;
    user_mobile?: string;
    user_email?: string;
    rel_name?: string;
    caste_name?: string;
    con_name?: string;
    state_name?: string;
    dist_name?: string;
    lpo_name?: string;
  };
  detailed: {
    up_height?: string;
    up_body_weight?: string;
    up_marital_status?: string;
    up_children?: string;
    up_body_type?: string;
    up_complexion?: string;
    up_physical_status?: string;
    up_mother_tongue?: string;
    up_personal_values?: string;
    // Education fields
    qual_id?: number;
    ql_id?: number;
    speci_id?: number;
    pro_id?: number;
    up_job_status?: string;
    up_working_in?: string;
    up_working_at?: string;
    up_working_as?: string;
    up_company_name?: string;
    up_designation?: string;
    up_annualincome?: string;
    up_income?: string;
    // Family fields
    up_family_values?: string;
    up_native?: string;
    up_father_name?: string;
    up_father_occupation?: string;
    up_mother_name?: string;
    up_mother_occupation?: string;
    up_brothers?: string;
    up_mbrothers?: string;
    up_sisters?: string;
    up_msisters?: string;
    // Hobbies & Lifestyle fields
    up_hobbies?: string[] | string;
    up_music?: string[] | string;
    up_reads?: string[] | string;
    up_cuisine?: string[] | string;
    up_diet?: string;
    up_drink?: string;
    up_smoke?: string;
    // About
    up_about_myself?: string;
  };
  photo: {
    photo: string[];
    photo_status: string;
  };
  astro?: {
    nak_name?: string;
    manglik?: string;
    place_of_birth?: string;
    time_of_birth?: string;
    horoscope?: string;
  };
  partner?: {
    upp_age_f?: number;
    upp_age_t?: number;
    upp_height_f?: number;
    upp_height_t?: number;
    religion?: string[];
    caste?: string[];
    state?: string[];
    district?: string[];
    qualification?: string[];
    profession?: string[];
  };
  match?: {
    score: number;
    age: string;
    height: string;
    marital_status: string;
    body_type: string;
    complexion: string;
    physical_status: string;
    relegion: string;
    caste: string;
    nakshathra: string;
    country: string;
    state: string;
    district: string;
    qualification: string;
    profession: string;
  };
  communicaton?: {
    interest: string;
    shortlist: string;
    block: string;
    report: string;
  };
  request?: {
    photo_add: boolean;
    photo_view: boolean;
    basic: boolean;
    education: boolean;
    family: boolean;
    hobbies: boolean;
    astro: boolean;
    horoscope: boolean;
    partner_basic: boolean;
    partner_religion: boolean;
    partner_location: boolean;
    partner_education: boolean;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const ProfileDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const profileId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [isInterestSent, setIsInterestSent] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactDetails, setContactDetails] = useState<{
    mobile: string;
    phone: string;
    address: string;
    remaining_contact: number;
  } | null>(null);

  useEffect(() => {
    if (token && profileId) {
      fetchProfileDetails();
    }
  }, [token, profileId]);

  const fetchProfileDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/profile-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ match_id: parseInt(profileId) }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setProfileData(result.data);
        // Set initial communication states
        setIsInterestSent(result.data.communicaton?.interest === 'yes');
        setIsShortlisted(result.data.communicaton?.shortlist === 'yes');
        setIsBlocked(result.data.communicaton?.block === 'yes');
        setIsReported(result.data.communicaton?.report === 'yes');
      } else {
        setError(result.message || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('An error occurred while loading the profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSendInterest = async () => {
    if (isInterestSent || actionLoading === 'interest') return;

    try {
      setActionLoading('interest');
      const response = await fetch(`${API_BASE_URL}/send-interest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ match_id: parseInt(profileId) }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setIsInterestSent(true);
        showSuccess(result.message === 'already_send' ? 'Interest already sent!' : 'Interest sent successfully!');
      } else if (result.message === 'plan_expired') {
        showWarning('Your plan has expired. Please upgrade to continue.');
      } else if (result.message === 'same_gender') {
        showError('Cannot send interest to same gender profile.');
      } else if (result.message === 'time_limit') {
        showWarning(`Please wait until ${result.time} to send more interests.`);
      } else {
        showError(result.message || 'Failed to send interest');
      }
    } catch (error) {
      console.error('Error sending interest:', error);
      showError('An error occurred while sending interest');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleShortlist = async () => {
    if (actionLoading === 'shortlist') return;

    try {
      setActionLoading('shortlist');
      const endpoint = isShortlisted ? 'remove-shortlist' : 'add-shortlist';
      const method = isShortlisted ? 'DELETE' : 'POST';

      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ match_id: parseInt(profileId) }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setIsShortlisted(!isShortlisted);
        showSuccess(isShortlisted ? 'Removed from shortlist!' : 'Added to shortlist!');
      } else {
        showError(result.message || `Failed to ${isShortlisted ? 'remove from' : 'add to'} shortlist`);
      }
    } catch (error) {
      console.error('Error toggling shortlist:', error);
      showError('An error occurred while updating shortlist');
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewContact = async () => {
    if (actionLoading === 'contact') return;

    try {
      setActionLoading('contact');
      const response = await fetch(`${API_BASE_URL}/contact-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ match_id: parseInt(profileId) }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        const { mobile, phone, address, remaining_contact } = result.data;
        setContactDetails({ mobile, phone, address, remaining_contact });
        setShowContactModal(true);
      } else if (result.message === 'plan_expired') {
        showWarning('Your plan has expired. Please upgrade to view contact details.');
      } else if (result.message === 'time_limit') {
        showWarning(`Please wait until ${result.time} to view more contacts.`);
      } else if (result.message === 'same_gender') {
        showError('Cannot view contact details of same gender profile.');
      } else {
        showError(result.message || 'Failed to view contact details');
      }
    } catch (error) {
      console.error('Error viewing contact:', error);
      showError('An error occurred while viewing contact details');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendProfileRequest = async (
    requestType: 'photo_add' | 'photo_view' | 'basic' | 'education' | 'family' | 'hobbies' | 'astro' | 'horoscope' | 'partner_basic' | 'partner_religion' | 'partner_location' | 'partner_education',
    sectionName?: string
  ) => {
    if (actionLoading === `request_${requestType}`) return;

    try {
      setActionLoading(`request_${requestType}`);
      const response = await fetch(`${API_BASE_URL}/profile-request/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          match_id: parseInt(profileId),
          type: requestType
        }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        const message = sectionName
          ? `Request sent for ${sectionName} successfully!`
          : 'Profile request sent successfully!';
        showSuccess(message);
        // Refresh profile data to update request status
        fetchProfileDetails();
      } else if (result.message === 'same_gender') {
        showError('Cannot send request to same gender profile.');
      } else if (result.message === 'already_requested') {
        showWarning('You have already sent a request for this.');
      } else {
        showError(result.message || 'Failed to send profile request');
      }
    } catch (error) {
      console.error('Error sending profile request:', error);
      showError('An error occurred while sending profile request');
    } finally {
      setActionLoading(null);
    }
  };

  // Helper to check if a section is empty
  const isSectionEmpty = (checkFunction: () => boolean): boolean => {
    return !checkFunction();
  };

  // Helper to render request button for sections
  const renderSectionRequestButton = (
    sectionKey: keyof NonNullable<ProfileData['request']>,
    sectionName: string,
    isEmpty: boolean
  ) => {
    if (!request || !isEmpty) return null;

    const isRequested = request[sectionKey];
    const loadingKey = `request_${sectionKey}`;

    return (
      <div className="mt-4 pt-4 border-t border-gray-200">
        {isRequested ? (
          <div className="flex items-center justify-center text-sm text-gray-500 bg-gray-50 py-2 px-4 rounded-lg">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            Request Sent - Waiting for Response
          </div>
        ) : (
          <button
            onClick={() => handleSendSectionRequest(sectionKey, sectionName)}
            disabled={actionLoading === loadingKey}
            className="w-full flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {actionLoading === loadingKey ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <User className="h-4 w-4 mr-2" />
            )}
            Request {sectionName}
          </button>
        )}
      </div>
    );
  };

  // Handle section-specific requests
  const handleSendSectionRequest = async (
    sectionKey: keyof NonNullable<ProfileData['request']>,
    sectionName: string
  ) => {
    const loadingKey = `request_${sectionKey}`;
    if (actionLoading === loadingKey) return;

    try {
      setActionLoading(loadingKey);
      const response = await fetch(`${API_BASE_URL}/profile-request/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          match_id: parseInt(profileId),
          type: sectionKey // Send the correct request type from API documentation
        }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        showSuccess(`Request sent for ${sectionName} successfully!`);
        // Refresh profile data to update request status
        fetchProfileDetails();
      } else if (result.message === 'same_gender') {
        showError('Cannot send request to same gender profile.');
      } else if (result.message === 'already_requested') {
        showWarning('You have already sent a request for this section.');
      } else {
        showError(result.message || 'Failed to send profile request');
      }
    } catch (error) {
      console.error('Error sending profile request:', error);
      showError('An error occurred while sending profile request');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle report profile
  const handleReport = async (reportType: number) => {
    if (actionLoading === 'report') return;

    try {
      setActionLoading('report');

      const result = await reportProfile(token!, parseInt(profileId), reportType);

      if (result.status === 'success') {
        setIsReported(true);
        setShowReportModal(false);
        showSuccess('Profile reported successfully. Our team will review this report.');
      } else if (result.message === 'already_reported') {
        setIsReported(true);
        setShowReportModal(false);
        showWarning('You have already reported this profile.');
      } else if (result.status === 'failed') {
        showError(result.message || 'Failed to report profile');
      } else {
        showError(result.message || 'An error occurred while reporting profile');
      }
    } catch (error) {
      console.error('Error reporting profile:', error);
      showError('An error occurred while reporting profile');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle block/unblock profile
  const handleBlockToggle = async () => {
    if (actionLoading === 'block') return;

    try {
      setActionLoading('block');

      if (isBlocked) {
        // Unblock profile
        const result = await unblockProfile(token!, parseInt(profileId));

        if (result.status === 'success') {
          setIsBlocked(false);
          showSuccess('Profile unblocked successfully!');
        } else if (result.status === 'failed') {
          showError(result.message || 'Failed to unblock profile');
        } else {
          showError(result.message || 'An error occurred while unblocking profile');
        }
      } else {
        // Block profile
        const result = await blockProfile(token!, parseInt(profileId));

        if (result.status === 'success') {
          setIsBlocked(true);
          showSuccess('Profile blocked successfully!');
        } else if (result.message === 'already_requested') {
          showWarning('This profile is already blocked.');
          setIsBlocked(true);
        } else if (result.status === 'failed') {
          showError(result.message || 'Failed to block profile');
        } else {
          showError(result.message || 'An error occurred while blocking profile');
        }
      }
    } catch (error) {
      console.error('Error toggling block status:', error);
      showError('An error occurred while updating block status');
    } finally {
      setActionLoading(null);
    }
  };

  const getMatchColor = (value: string) => {
    return value === 'yes' ? 'text-green-600' : 'text-red-600';
  };

  const getMatchIcon = (value: string) => {
    return value === 'yes' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <AuthGuard requireAuth={true} redirectTo="/login">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </main>
          <Footer />
        </div>
      </AuthGuard>
    );
  }

  if (error || !profileData) {
    return (
      <AuthGuard requireAuth={true} redirectTo="/login">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error || 'Profile not found'}</p>
              <button
                onClick={() => router.back()}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
              >
                Go Back
              </button>
            </div>
          </main>
          <Footer />
        </div>
      </AuthGuard>
    );
  }

  const { basic, detailed, photo, astro, partner, match, communicaton, request } = profileData;

  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Results
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Photos & Actions */}
              <div className="lg:col-span-1 space-y-6">
                {/* Photo Gallery */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-w-3 aspect-h-4 bg-gray-200 relative h-96">
                    <Image
                      src={photo.photo[selectedPhoto] || photo.photo[0] || '/placeholder-avatar.png'}
                      alt={`${basic.user_fname} ${basic.user_lname}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      unoptimized={photo.photo[selectedPhoto]?.includes('vivahavedimatrimony.com') || photo.photo[0]?.includes('vivahavedimatrimony.com')}
                    />
                  </div>
                  {photo.photo.length > 1 && (
                    <div className="p-4 grid grid-cols-5 gap-2">
                      {photo.photo.slice(0, 5).map((photoUrl, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedPhoto(index)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 relative ${
                            selectedPhoto === index ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <Image
                            src={photoUrl || '/placeholder-avatar.png'}
                            alt={`Photo ${index + 1}`}
                            fill
                            sizes="100px"
                            className="object-cover"
                            unoptimized={photoUrl?.includes('vivahavedimatrimony.com')}
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Photo Request Buttons */}
                  {request && (
                    <div className="p-4 space-y-2 border-t border-gray-200">
                      {/* Photo Add Request - when profile has no photos or only avatar */}
                      {photo.photo_status === 'avatar' && (
                        <div>
                          {request.photo_add ? (
                            <div className="flex items-center justify-center text-sm text-gray-500 bg-gray-50 py-2 px-4 rounded-lg">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              Photo Add Request Sent
                            </div>
                          ) : (
                            <button
                              onClick={() => handleSendProfileRequest('photo_add', 'Add Photo')}
                              disabled={actionLoading === 'request_photo_add'}
                              className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {actionLoading === 'request_photo_add' ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <ImageIcon className="h-4 w-4 mr-2" />
                              )}
                              Request to Add Photo
                            </button>
                          )}
                        </div>
                      )}

                      {/* Photo View Request - when photo is locked */}
                      {photo.photo_status === 'locked' && (
                        <div>
                          {request.photo_view ? (
                            <div className="flex items-center justify-center text-sm text-gray-500 bg-gray-50 py-2 px-4 rounded-lg">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              Photo View Request Sent
                            </div>
                          ) : (
                            <button
                              onClick={() => handleSendProfileRequest('photo_view', 'View Locked Photo')}
                              disabled={actionLoading === 'request_photo_view'}
                              className="w-full flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {actionLoading === 'request_photo_view' ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Eye className="h-4 w-4 mr-2" />
                              )}
                              Request to View Photo
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Compatibility Score */}
                {match && (
                  <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-lg p-6 border border-red-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Compatibility Match</h3>

                    {/* Score Circle */}
                    <div className="flex justify-center mb-6">
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-36 h-36 transform -rotate-90">
                          <circle
                            cx="72"
                            cy="72"
                            r="64"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="none"
                            className="text-gray-200"
                          />
                          <circle
                            cx="72"
                            cy="72"
                            r="64"
                            stroke="url(#gradient)"
                            strokeWidth="10"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 64}`}
                            strokeDashoffset={`${2 * Math.PI * 64 * (1 - match.score / 100)}`}
                            className="transition-all duration-1000 ease-out"
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ef4444" />
                              <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute text-center">
                          <div className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                            {match.score}%
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Match Score</div>
                        </div>
                      </div>
                    </div>

                    {/* Match Details */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100">
                        <span className="text-gray-700 font-medium text-sm">Age</span>
                        <div className={`flex items-center gap-2 ${getMatchColor(match.age)}`}>
                          {getMatchIcon(match.age)}
                          <span className="font-semibold text-sm">{match.age === 'yes' ? 'Match' : 'No Match'}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100">
                        <span className="text-gray-700 font-medium text-sm">Height</span>
                        <div className={`flex items-center gap-2 ${getMatchColor(match.height)}`}>
                          {getMatchIcon(match.height)}
                          <span className="font-semibold text-sm">{match.height === 'yes' ? 'Match' : 'No Match'}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100">
                        <span className="text-gray-700 font-medium text-sm">Religion</span>
                        <div className={`flex items-center gap-2 ${getMatchColor(match.relegion)}`}>
                          {getMatchIcon(match.relegion)}
                          <span className="font-semibold text-sm">{match.relegion === 'yes' ? 'Match' : 'No Match'}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100">
                        <span className="text-gray-700 font-medium text-sm">Location</span>
                        <div className={`flex items-center gap-2 ${getMatchColor(match.state)}`}>
                          {getMatchIcon(match.state)}
                          <span className="font-semibold text-sm">{match.state === 'yes' ? 'Match' : 'No Match'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Communication Actions */}
                <div className="bg-white rounded-2xl shadow-lg p-6 space-y-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>

                  {/* Primary Actions */}
                  <button
                    onClick={handleSendInterest}
                    disabled={isInterestSent || actionLoading === 'interest'}
                    className={`w-full flex items-center justify-center px-5 py-3.5 rounded-xl font-semibold transition-all duration-200 ${
                      isInterestSent
                        ? 'bg-gray-200 cursor-not-allowed text-gray-500'
                        : 'bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-lg hover:scale-[1.02] text-white'
                    }`}
                  >
                    {actionLoading === 'interest' ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Heart className={`h-5 w-5 mr-2 ${isInterestSent ? 'fill-current' : ''}`} />
                    )}
                    {isInterestSent ? 'Interest Sent' : 'Send Interest'}
                  </button>

                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg hover:scale-[1.02] text-white px-5 py-3.5 rounded-xl font-semibold transition-all duration-200"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Send Message
                  </button>

                  <button
                    onClick={handleViewContact}
                    disabled={actionLoading === 'contact'}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-lg hover:scale-[1.02] text-white px-5 py-3.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {actionLoading === 'contact' ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Phone className="h-5 w-5 mr-2" />
                    )}
                    View Contact
                  </button>

                  {/* Secondary Actions */}
                  <div className="pt-3 border-t border-gray-100">
                    <button
                      onClick={handleToggleShortlist}
                      disabled={actionLoading === 'shortlist'}
                      className={`w-full flex items-center justify-center px-5 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isShortlisted
                          ? 'bg-yellow-50 text-yellow-600 border-2 border-yellow-400 hover:bg-yellow-100'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 text-gray-700'
                      }`}
                    >
                      {actionLoading === 'shortlist' ? (
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <Bookmark className={`h-5 w-5 mr-2 ${isShortlisted ? 'fill-current' : ''}`} />
                      )}
                      {isShortlisted ? 'Shortlisted' : 'Add to Shortlist'}
                    </button>
                  </div>

                  {/* Utility Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleBlockToggle}
                      disabled={actionLoading === 'block'}
                      className={`flex-1 flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isBlocked
                          ? 'bg-green-50 hover:bg-green-100 text-green-600 border border-green-300'
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {actionLoading === 'block' ? (
                        <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                      ) : (
                        <Ban className="h-4 w-4 mr-1.5" />
                      )}
                      {isBlocked ? 'Unblock' : 'Block'}
                    </button>
                    <button
                      onClick={() => !isReported && setShowReportModal(true)}
                      disabled={isReported || actionLoading === 'report'}
                      className={`flex-1 flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isReported
                          ? 'bg-orange-50 text-orange-600 border border-orange-300 cursor-not-allowed'
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600'
                      } disabled:opacity-50`}
                    >
                      <Flag className="h-4 w-4 mr-1.5" />
                      {isReported ? 'Reported' : 'Report'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Profile Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info Header */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {basic.user_fname} {basic.user_lname}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      {basic.age} years
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      {basic.dist_name}, {basic.state_name}
                    </div>
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      {basic.user_gender}
                    </div>
                  </div>
                </div>

                {/* About Me */}
                {detailed.up_about_myself && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-red-500" />
                      About Me
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{detailed.up_about_myself}</p>
                  </div>
                )}

                {/* Basic Details */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-red-500" />
                    Basic Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Height</p>
                      <p className="text-gray-900 font-medium">{detailed.up_height || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Weight</p>
                      <p className="text-gray-900 font-medium">{detailed.up_body_weight ? `${detailed.up_body_weight} kg` : 'Not specified'}</p>
                    </div>
                    {detailed.up_children && (
                      <div>
                        <p className="text-sm text-gray-600">Children</p>
                        <p className="text-gray-900 font-medium">{detailed.up_children}</p>
                      </div>
                    )}
                    {detailed.up_personal_values && (
                      <div>
                        <p className="text-sm text-gray-600">Personal Values</p>
                        <p className="text-gray-900 font-medium">{detailed.up_personal_values}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Marital Status</p>
                      <p className="text-gray-900 font-medium">{detailed.up_marital_status || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Body Type</p>
                      <p className="text-gray-900 font-medium">{detailed.up_body_type || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Complexion</p>
                      <p className="text-gray-900 font-medium">{detailed.up_complexion || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Physical Status</p>
                      <p className="text-gray-900 font-medium">{detailed.up_physical_status || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Mother Tongue</p>
                      <p className="text-gray-900 font-medium">{detailed.up_mother_tongue || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Religion</p>
                      <p className="text-gray-900 font-medium">{basic.rel_name || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Caste</p>
                      <p className="text-gray-900 font-medium">{basic.caste_name || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-gray-900 font-medium">{basic.lpo_name || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Education & Professional Details */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-red-500" />
                    Education & Career
                  </h2>
                  {(!detailed.up_working_as && !detailed.up_company_name && !detailed.up_designation &&
                    !detailed.up_job_status && !detailed.up_working_in && !detailed.up_working_at &&
                    !detailed.up_annualincome && !detailed.up_income) ? (
                    <div>
                      <p className="text-gray-500 text-center py-4">Education and career details not provided</p>
                      {renderSectionRequestButton('education', 'Education & Career Details', true)}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {detailed.up_working_as && (
                        <div>
                          <p className="text-sm text-gray-600">Working As</p>
                          <p className="text-gray-900 font-medium">{detailed.up_working_as}</p>
                        </div>
                      )}
                      {detailed.up_company_name && (
                        <div>
                          <p className="text-sm text-gray-600">Company</p>
                          <p className="text-gray-900 font-medium">{detailed.up_company_name}</p>
                        </div>
                      )}
                      {detailed.up_designation && (
                        <div>
                          <p className="text-sm text-gray-600">Designation</p>
                          <p className="text-gray-900 font-medium">{detailed.up_designation}</p>
                        </div>
                      )}
                      {detailed.up_job_status && (
                        <div>
                          <p className="text-sm text-gray-600">Employment Status</p>
                          <p className="text-gray-900 font-medium">{detailed.up_job_status}</p>
                        </div>
                      )}
                      {detailed.up_working_in && (
                        <div>
                          <p className="text-sm text-gray-600">Working In</p>
                          <p className="text-gray-900 font-medium">{detailed.up_working_in}</p>
                        </div>
                      )}
                      {detailed.up_working_at && (
                        <div>
                          <p className="text-sm text-gray-600">Working At</p>
                          <p className="text-gray-900 font-medium">{detailed.up_working_at}</p>
                        </div>
                      )}
                      {(detailed.up_annualincome || detailed.up_income) && (
                        <div>
                          <p className="text-sm text-gray-600">Annual Income</p>
                          <p className="text-gray-900 font-medium">₹{detailed.up_annualincome || detailed.up_income}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Family Details */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Home className="h-5 w-5 mr-2 text-red-500" />
                    Family Details
                  </h2>
                  {(!detailed.up_family_values && !detailed.up_native && !detailed.up_father_name &&
                    !detailed.up_mother_name && !detailed.up_brothers && !detailed.up_sisters) ? (
                    <div>
                      <p className="text-gray-500 text-center py-4">Family details not provided</p>
                      {renderSectionRequestButton('family', 'Family Details', true)}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {detailed.up_family_values && (
                        <div>
                          <p className="text-sm text-gray-600">Family Values</p>
                          <p className="text-gray-900 font-medium">{detailed.up_family_values}</p>
                        </div>
                      )}
                      {detailed.up_native && (
                        <div>
                          <p className="text-sm text-gray-600">Native Place</p>
                          <p className="text-gray-900 font-medium">{detailed.up_native}</p>
                        </div>
                      )}
                      {detailed.up_father_name && (
                        <div>
                          <p className="text-sm text-gray-600">Father&apos;s Name</p>
                          <p className="text-gray-900 font-medium">{detailed.up_father_name}</p>
                        </div>
                      )}
                      {detailed.up_father_occupation && (
                        <div>
                          <p className="text-sm text-gray-600">Father&apos;s Occupation</p>
                          <p className="text-gray-900 font-medium">{detailed.up_father_occupation}</p>
                        </div>
                      )}
                      {detailed.up_mother_name && (
                        <div>
                          <p className="text-sm text-gray-600">Mother&apos;s Name</p>
                          <p className="text-gray-900 font-medium">{detailed.up_mother_name}</p>
                        </div>
                      )}
                      {detailed.up_mother_occupation && (
                        <div>
                          <p className="text-sm text-gray-600">Mother&apos;s Occupation</p>
                          <p className="text-gray-900 font-medium">{detailed.up_mother_occupation}</p>
                        </div>
                      )}
                      {detailed.up_brothers && (
                        <div>
                          <p className="text-sm text-gray-600">Brothers</p>
                          <p className="text-gray-900 font-medium">
                            {detailed.up_brothers} {detailed.up_mbrothers && `(${detailed.up_mbrothers} Married)`}
                          </p>
                        </div>
                      )}
                      {detailed.up_sisters && (
                        <div>
                          <p className="text-sm text-gray-600">Sisters</p>
                          <p className="text-gray-900 font-medium">
                            {detailed.up_sisters} {detailed.up_msisters && `(${detailed.up_msisters} Married)`}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Hobbies & Lifestyle */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Hobbies & Lifestyle
                  </h2>
                  {(!detailed.up_hobbies && !detailed.up_music && !detailed.up_reads && !detailed.up_cuisine &&
                    !detailed.up_diet && !detailed.up_drink && !detailed.up_smoke) ? (
                    <div>
                      <p className="text-gray-500 text-center py-4">Hobbies and lifestyle details not provided</p>
                      {renderSectionRequestButton('hobbies', 'Hobbies & Lifestyle', true)}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {detailed.up_hobbies && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Hobbies</p>
                          <p className="text-gray-900 font-medium">
                            {Array.isArray(detailed.up_hobbies)
                              ? detailed.up_hobbies.join(', ')
                              : detailed.up_hobbies}
                          </p>
                        </div>
                      )}
                      {detailed.up_music && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Music Preferences</p>
                          <p className="text-gray-900 font-medium">
                            {Array.isArray(detailed.up_music)
                              ? detailed.up_music.join(', ')
                              : detailed.up_music}
                          </p>
                        </div>
                      )}
                      {detailed.up_reads && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Reading Preferences</p>
                          <p className="text-gray-900 font-medium">
                            {Array.isArray(detailed.up_reads)
                              ? detailed.up_reads.join(', ')
                              : detailed.up_reads}
                          </p>
                        </div>
                      )}
                      {detailed.up_cuisine && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Favorite Cuisine</p>
                          <p className="text-gray-900 font-medium">
                            {Array.isArray(detailed.up_cuisine)
                              ? detailed.up_cuisine.join(', ')
                              : detailed.up_cuisine}
                          </p>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        {detailed.up_diet && (
                          <div>
                            <p className="text-sm text-gray-600">Diet</p>
                            <p className="text-gray-900 font-medium">{detailed.up_diet}</p>
                          </div>
                        )}
                        {detailed.up_drink && (
                          <div>
                            <p className="text-sm text-gray-600">Drinking Habits</p>
                            <p className="text-gray-900 font-medium">{detailed.up_drink}</p>
                          </div>
                        )}
                        {detailed.up_smoke && (
                          <div>
                            <p className="text-sm text-gray-600">Smoking Habits</p>
                            <p className="text-gray-900 font-medium">{detailed.up_smoke}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Astrological Details */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-red-500" />
                    Astrological Details
                  </h2>
                  {(!astro || (!astro.nak_name && !astro.manglik && !astro.place_of_birth && !astro.time_of_birth)) ? (
                    <div>
                      <p className="text-gray-500 text-center py-4">Astrological details not provided</p>
                      {renderSectionRequestButton('astro', 'Astrological Details', true)}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Nakshatra</p>
                        <p className="text-gray-900 font-medium">{astro.nak_name || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Manglik</p>
                        <p className="text-gray-900 font-medium">{astro.manglik || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Birth Place</p>
                        <p className="text-gray-900 font-medium">{astro.place_of_birth || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Birth Time</p>
                        <p className="text-gray-900 font-medium">{astro.time_of_birth || 'Not specified'}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Partner Preferences */}
                {partner && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-red-500" />
                      Partner Preferences
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Age Range</p>
                        <p className="text-gray-900 font-medium">
                          {partner.upp_age_f && partner.upp_age_t
                            ? `${partner.upp_age_f} - ${partner.upp_age_t} years`
                            : 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Height Range</p>
                        <p className="text-gray-900 font-medium">
                          {partner.upp_height_f && partner.upp_height_t
                            ? `${partner.upp_height_f} - ${partner.upp_height_t} cm`
                            : 'Not specified'}
                        </p>
                      </div>
                      {partner.religion && partner.religion.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Religion</p>
                          <p className="text-gray-900 font-medium">{partner.religion.join(', ')}</p>
                        </div>
                      )}
                      {partner.caste && partner.caste.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Caste</p>
                          <p className="text-gray-900 font-medium">{partner.caste.join(', ')}</p>
                        </div>
                      )}
                      {partner.state && partner.state.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Preferred States</p>
                          <p className="text-gray-900 font-medium">{partner.state.join(', ')}</p>
                        </div>
                      )}
                      {partner.qualification && partner.qualification.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Education</p>
                          <p className="text-gray-900 font-medium">{partner.qualification.join(', ')}</p>
                        </div>
                      )}
                      {partner.profession && partner.profession.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Profession</p>
                          <p className="text-gray-900 font-medium">{partner.profession.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />

        {/* Chat Modal */}
        {profileData && (
          <ChatModal
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            matchId={parseInt(profileId)}
            matchName={`${profileData.basic.user_fname} ${profileData.basic.user_lname}`}
            matchPhoto={profileData.photo.photo[0] || ''}
          />
        )}

        {/* Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Report Profile</h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <p className="text-gray-600 mb-4">
                Please select a reason for reporting this profile:
              </p>

              <div className="space-y-2">
                {REPORT_REASONS.map((reason) => (
                  <button
                    key={reason.value}
                    onClick={() => handleReport(reason.value)}
                    disabled={actionLoading === 'report'}
                    className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{reason.label}</span>
                      {actionLoading === 'report' && (
                        <Loader2 className="h-5 w-5 animate-spin text-red-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowReportModal(false)}
                disabled={actionLoading === 'report'}
                className="mt-4 w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Contact Details Modal */}
        {showContactModal && contactDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Contact Details</h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-blue-500 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Mobile</p>
                    <p className="text-lg font-semibold text-gray-900">{contactDetails.mobile}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-blue-500 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-lg font-semibold text-gray-900">{contactDetails.phone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-500 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-gray-900">{contactDetails.address}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">Remaining contacts:</span> {contactDetails.remaining_contact}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowContactModal(false)}
                className="mt-6 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export default ProfileDetailsPage;
