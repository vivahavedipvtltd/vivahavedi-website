'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import {
  User,
  Heart,
  Eye,
  MessageCircle,
  Star,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  CreditCard,
  Clock,
  CheckCircle2,
  Edit,
  Plus,
  AlertCircle
} from 'lucide-react';
import CommunicationViewsSection from '@/components/CommunicationViewsSection';
import MyPhotosManagement from '@/components/MyPhotosManagement';
import MyDocumentsManagement from '@/components/MyDocumentsManagement';
import MobileVerification from '@/components/MobileVerification';
import PasswordChangeSettings from '@/components/PasswordChangeSettings';
import PrivacySettings from '@/components/PrivacySettings';

interface MyDetails {
  basic: {
    user_id: number;
    user_fname: string;
    user_lname: string;
    user_gender: string;
    user_bday: number;
    user_bmonth: number;
    user_byear: number;
    age: number;
    user_mobile: string;
    user_phone?: string | null;
    user_email: string;
    user_address: string;
    user_email_verify: string;
    user_mobile_verify: string;
    user_hide?: string;
    rel_name: string;
    caste_name: string;
    con_name: string;
    state_name: string;
    dist_name: string;
    lpo_name: string;
  };
  detailed: {
    up_height?: string;
    up_weight?: string;
    up_complexion?: string;
    up_body_type?: string;
    up_physical_status?: string;
    up_mother_tongue?: string;
    up_marital_status?: string;
    up_no_of_children?: number;
    up_qualification_level?: string;
    up_qualification?: string;
    up_specialization?: string;
    up_profession?: string;
    up_job_status?: string;
    up_annual_income?: string;
    up_company_name?: string;
    up_company_address?: string;
    up_about_profession?: string;
    up_family_type?: string;
    up_family_status?: string;
    up_family_values?: string;
    up_father_occupation?: string;
    up_mother_occupation?: string;
    up_no_of_brothers?: number;
    up_no_of_sisters?: number;
    up_about_family?: string;
    up_hobbies?: string[] | string;
    up_music?: string[] | string;
    up_reads?: string[] | string;
    up_cuisine?: string[] | string;
    up_diet?: string;
    up_drink?: string;
    up_smoke?: string;
    up_about_myself?: string;
  };
  profile_completion: {
    registration: string; // '1' = complete, '0' = incomplete
    basic: string;        // '1' = complete, '0' = incomplete
    education: string;    // '1' = complete, '0' = incomplete
    family: string;       // '1' = complete, '0' = incomplete
    hobbies: string;      // '1' = complete, '0' = incomplete
    astro: string;        // '1' = complete, '0' = incomplete
    photo: string;        // '1' = complete, '0' = incomplete
    id_proof: string;     // '1' = complete, '0' = incomplete
    score: number;        // Overall completion percentage (0-100)
  };
}

interface CommunicationStats {
  profile_view: number;
  profile_interest: number;
  profile_chat: number;
  profile_request: number;
}

interface MyPlan {
  name: string;
  contact: string;
  chat: string;
  interest: string;
  message: string;
  expire: string;
  default: string;
}

interface MyPhotos {
  photos: {
    [key: string]: string;
  };
  photo_status: string;
  photo_all_status: string;
  lock_status: string;
  id_proof: string;
  id_proof_status: string;
  horoscope: string;
  horoscope_status: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Wrapper component to handle search params with Suspense
function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('overview');

  const [myDetails, setMyDetails] = useState<MyDetails | null>(null);
  const [communicationStats, setCommunicationStats] = useState<CommunicationStats | null>(null);
  const [myPlan, setMyPlan] = useState<MyPlan | null>(null);
  const [myPhotos, setMyPhotos] = useState<MyPhotos | null>(null);

  // Check for section parameter from URL and reset parameter
  useEffect(() => {
    const resetParam = searchParams.get('reset');
    const sectionParam = searchParams.get('section');

    if (resetParam === 'true') {
      setActiveSection('overview');
      // Remove the reset parameter from URL
      router.replace('/dashboard');
    } else if (sectionParam) {
      // Set active section from URL parameter
      setActiveSection(sectionParam);
      // Clean up URL after setting section
      router.replace('/dashboard');
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Handle navigation for sections that redirect
  useEffect(() => {
    if (activeSection === 'search') {
      router.push('/search-results');
    } else if (activeSection === 'blocked-profiles') {
      router.push('/dashboard/blocked-profiles');
    } else if (activeSection === 'matching-profiles') {
      router.push('/dashboard/matching-profiles');
    } else if (activeSection === 'upgrade-plan') {
      router.push('/dashboard/settings/plan-upgrade');
    } else if (activeSection === 'saved-searches') {
      router.push('/dashboard/saved-searches');
    }
  }, [activeSection, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      // Fetch all data in parallel
      const [detailsRes, statsRes, planRes, photosRes] = await Promise.all([
        fetch(`${API_BASE_URL}/my-details`, { headers }),
        fetch(`${API_BASE_URL}/communication-views`, {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'communication_statistics' }),
        }),
        fetch(`${API_BASE_URL}/my-plan`, { headers }),
        fetch(`${API_BASE_URL}/my-photos`, { headers }),
      ]);

      const detailsData = await detailsRes.json();
      const statsData = await statsRes.json();
      const planData = await planRes.json();
      const photosData = await photosRes.json();

      if (detailsData.status === 'success') {
        setMyDetails(detailsData.data);
      }
      if (statsData.status === 'success') {
        setCommunicationStats(statsData.data);
      }
      if (planData.status === 'success') {
        setMyPlan(planData.data);
      }
      if (photosData.status === 'success') {
        setMyPhotos(photosData.data);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard requireAuth={true} redirectTo="/login">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
              <p className="text-gray-600">Loading your dashboard...</p>
            </div>
          </main>
          <Footer />
        </div>
      </AuthGuard>
    );
  }

  if (error || !myDetails) {
    return (
      <AuthGuard requireAuth={true} redirectTo="/login">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error || 'Failed to load dashboard'}</p>
              <button
                onClick={fetchDashboardData}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full"
              >
                Retry
              </button>
            </div>
          </main>
          <Footer />
        </div>
      </AuthGuard>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection myDetails={myDetails} communicationStats={communicationStats} myPlan={myPlan} onSectionChange={setActiveSection} />;
      case 'my-profile':
        return <MyProfileSection myDetails={myDetails} />;
      case 'my-photos':
        return myPhotos ? <MyPhotosManagement myPhotos={myPhotos} onRefresh={fetchDashboardData} /> : null;
      case 'my-documents':
        return myPhotos ? <MyDocumentsManagement myPhotos={myPhotos} onRefresh={fetchDashboardData} /> : null;
      case 'mobile-verification':
        return <MobileVerification onVerificationComplete={fetchDashboardData} />;
      case 'partner-preferences':
        return <PartnerPreferencesCard />;
      case 'search':
        // Navigation handled in useEffect
        return <PlaceholderSection title="Redirecting..." message="Taking you to search page..." />;
      case 'matching-profiles':
        // Navigation handled in useEffect
        return <PlaceholderSection title="Redirecting..." message="Taking you to matching profiles page..." />;
      case 'saved-searches':
        // Navigation handled in useEffect
        return <PlaceholderSection title="Redirecting..." message="Taking you to saved searches page..." />;
      case 'interests':
      case 'messages':
      case 'profile-views':
      case 'requests':
      case 'shortlisted':
      case 'viewed-profiles':
      case 'contacted':
        return <CommunicationViewsSection initialSection={activeSection} />;
      case 'blocked-profiles':
        // Navigation handled in useEffect
        return <PlaceholderSection title="Redirecting..." message="Taking you to blocked profiles page..." />;
      case 'upgrade-plan':
        // Navigation handled in useEffect
        return <PlaceholderSection title="Redirecting..." message="Taking you to plan upgrade page..." />;
      case 'account-settings':
        return <AccountSettingsSection myDetails={myDetails} myPhotos={myPhotos} onRefresh={fetchDashboardData} />;
      case 'change-password':
        return <ChangePasswordSection />;
      default:
        return <OverviewSection myDetails={myDetails} communicationStats={communicationStats} myPlan={myPlan} />;
    }
  };

  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <div className="min-h-screen flex flex-col">
        <Header />

        <div className="flex-grow flex bg-gray-50">
          {/* Sidebar */}
          <DashboardSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            stats={communicationStats || undefined}
          />

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              {renderSection()}
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </AuthGuard>
  );
}

// Overview Section Component
function OverviewSection({ myDetails, communicationStats, myPlan, onSectionChange }: { myDetails: MyDetails; communicationStats: CommunicationStats | null; myPlan: MyPlan | null; onSectionChange?: (section: string) => void }) {
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {myDetails.basic.user_fname}!
        </h1>
        <p className="text-gray-600">Here's your dashboard overview</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Eye className="h-6 w-6" />}
          title="Profile Views"
          value={communicationStats?.profile_view || 0}
          color="blue"
        />
        <StatCard
          icon={<Heart className="h-6 w-6" />}
          title="Interests"
          value={communicationStats?.profile_interest || 0}
          color="red"
        />
        <StatCard
          icon={<MessageCircle className="h-6 w-6" />}
          title="Messages"
          value={communicationStats?.profile_chat || 0}
          color="green"
        />
        <StatCard
          icon={<Phone className="h-6 w-6" />}
          title="Requests"
          value={communicationStats?.profile_request || 0}
          color="purple"
        />
      </div>

      {/* My Plan */}
      {myPlan && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Plan</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <PlanItem icon={<CreditCard />} label="Plan" value={myPlan.name} />
            <PlanItem icon={<Phone />} label="Contact Views" value={myPlan.contact} />
            <PlanItem icon={<MessageCircle />} label="Chats" value={myPlan.chat} />
            <PlanItem icon={<Heart />} label="Interests" value={myPlan.interest} />
            <PlanItem icon={<Mail />} label="Messages" value={myPlan.message} />
            <ExpiryPlanItem timestamp={myPlan.expire} />
          </div>
        </div>
      )}

      {/* Profile Completion */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-100">
        {/* Header with Score */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Profile Completion</h2>
            <p className="text-sm text-gray-600">Complete your profile to get better matches</p>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-extrabold ${
              myDetails.profile_completion.score === 100
                ? 'text-green-600'
                : myDetails.profile_completion.score >= 75
                ? 'text-blue-600'
                : myDetails.profile_completion.score >= 50
                ? 'text-yellow-600'
                : 'text-red-500'
            }`}>
              {myDetails.profile_completion.score}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {myDetails.profile_completion.score === 100
                ? 'Complete'
                : myDetails.profile_completion.score >= 75
                ? 'Almost there'
                : myDetails.profile_completion.score >= 50
                ? 'Keep going'
                : 'Get started'}
            </div>
          </div>
        </div>

        {/* Elegant Progress Bar */}
        <div className="mb-8">
          <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className={`h-3 rounded-full transition-all duration-700 ease-out relative ${
                myDetails.profile_completion.score === 100
                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                  : myDetails.profile_completion.score >= 75
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                  : myDetails.profile_completion.score >= 50
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                  : 'bg-gradient-to-r from-red-500 to-red-600'
              }`}
              style={{ width: `${myDetails.profile_completion.score}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Completion Items Grid - More elegant */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <CompletionItem
            label="Basic Info"
            status={myDetails.profile_completion.basic}
            editLink="/dashboard/profile/basic"
            points="10 pts"
          />
          <CompletionItem
            label="Education"
            status={myDetails.profile_completion.education}
            editLink="/dashboard/profile/education"
            points="10 pts"
          />
          <CompletionItem
            label="Family"
            status={myDetails.profile_completion.family}
            editLink="/dashboard/profile/family"
            points="10 pts"
          />
          <CompletionItem
            label="Hobbies"
            status={myDetails.profile_completion.hobbies}
            editLink="/dashboard/profile/hobbies"
            points="5 pts"
          />
          <CompletionItem
            label="Astrology"
            status={myDetails.profile_completion.astro}
            editLink="/dashboard/profile/astrological"
            points="10 pts"
          />
          <CompletionItem
            label="Photos"
            status={myDetails.profile_completion.photo}
            onClick={() => onSectionChange?.('my-photos')}
            points="20 pts"
          />
          <CompletionItem
            label="ID Proof"
            status={myDetails.profile_completion.id_proof}
            onClick={() => onSectionChange?.('my-documents')}
            points="15 pts"
          />
        </div>

      </div>

      {/* Partner Preferences */}
      <PartnerPreferencesCard />
    </div>
  );
}

// Partner Preferences Component
function PartnerPreferencesCard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Partner Preferences</h2>
      <p className="text-sm text-gray-600 mb-4">Set your ideal partner criteria</p>

      <div className="space-y-3">
        <Link
          href="/dashboard/profile/partner-basic"
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
        >
          <div className="flex items-center">
            <Users className="h-5 w-5 text-gray-600 group-hover:text-red-600 mr-3 transition-colors" />
            <span className="font-medium text-gray-900">Basic Preferences</span>
          </div>
          <span className="text-red-600 text-sm">→</span>
        </Link>

        <Link
          href="/dashboard/profile/partner-religion"
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
        >
          <div className="flex items-center">
            <Star className="h-5 w-5 text-gray-600 group-hover:text-red-600 mr-3 transition-colors" />
            <span className="font-medium text-gray-900">Religion & Caste</span>
          </div>
          <span className="text-red-600 text-sm">→</span>
        </Link>

        <Link
          href="/dashboard/profile/partner-location"
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
        >
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-gray-600 group-hover:text-red-600 mr-3 transition-colors" />
            <span className="font-medium text-gray-900">Location Preferences</span>
          </div>
          <span className="text-red-600 text-sm">→</span>
        </Link>

        <Link
          href="/dashboard/profile/partner-education"
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
        >
          <div className="flex items-center">
            <GraduationCap className="h-5 w-5 text-gray-600 group-hover:text-red-600 mr-3 transition-colors" />
            <span className="font-medium text-gray-900">Education & Career</span>
          </div>
          <span className="text-red-600 text-sm">→</span>
        </Link>
      </div>
    </div>
  );
}

// My Profile Section Component
function MyProfileSection({ myDetails }: { myDetails: MyDetails }) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-red-500" />
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProfileItem icon={<User />} label="Name" value={`${myDetails.basic.user_fname} ${myDetails.basic.user_lname}`} />
          <ProfileItem icon={<Calendar />} label="Age" value={`${myDetails.basic.age} years`} />
          <ProfileItem icon={<User />} label="Gender" value={myDetails.basic.user_gender} />
          <ProfileItem icon={<Phone />} label="Mobile" value={myDetails.basic.user_mobile} />
          {myDetails.basic.user_phone && (
            <ProfileItem icon={<Phone />} label="Phone" value={myDetails.basic.user_phone} />
          )}
          <ProfileItem icon={<Mail />} label="Email" value={myDetails.basic.user_email} />
          <ProfileItem icon={<MapPin />} label="Address" value={myDetails.basic.user_address} />
          <ProfileItem icon={<Users />} label="Religion" value={myDetails.basic.rel_name} />
          <ProfileItem icon={<Users />} label="Caste" value={myDetails.basic.caste_name} />
          <ProfileItem icon={<MapPin />} label="Country" value={myDetails.basic.con_name} />
          <ProfileItem icon={<MapPin />} label="State" value={myDetails.basic.state_name} />
          <ProfileItem icon={<MapPin />} label="District" value={myDetails.basic.dist_name} />
          <ProfileItem icon={<MapPin />} label="Location" value={myDetails.basic.lpo_name} />
        </div>
      </div>

      {/* Physical & Personal Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-red-500" />
          Physical & Personal Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProfileItem icon={<User />} label="Height" value={myDetails.detailed.up_height ? `${myDetails.detailed.up_height} cm` : 'N/A'} />
          <ProfileItem icon={<User />} label="Weight" value={myDetails.detailed.up_weight ? `${myDetails.detailed.up_weight} kg` : 'N/A'} />
          <ProfileItem icon={<User />} label="Complexion" value={myDetails.detailed.up_complexion || 'N/A'} />
          <ProfileItem icon={<User />} label="Body Type" value={myDetails.detailed.up_body_type || 'N/A'} />
          <ProfileItem icon={<User />} label="Physical Status" value={myDetails.detailed.up_physical_status || 'N/A'} />
          <ProfileItem icon={<User />} label="Mother Tongue" value={myDetails.detailed.up_mother_tongue || 'N/A'} />
          <ProfileItem icon={<Users />} label="Marital Status" value={myDetails.detailed.up_marital_status || 'N/A'} />
          {myDetails.detailed.up_no_of_children && myDetails.detailed.up_no_of_children > 0 && (
            <ProfileItem icon={<Users />} label="No. of Children" value={myDetails.detailed.up_no_of_children.toString()} />
          )}
        </div>
      </div>

      {/* Education & Career */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <GraduationCap className="h-5 w-5 mr-2 text-red-500" />
          Education & Career
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProfileItem icon={<GraduationCap />} label="Qualification Level" value={myDetails.detailed.up_qualification_level || 'N/A'} />
          <ProfileItem icon={<GraduationCap />} label="Qualification" value={myDetails.detailed.up_qualification || 'N/A'} />
          <ProfileItem icon={<GraduationCap />} label="Specialization" value={myDetails.detailed.up_specialization || 'N/A'} />
          <ProfileItem icon={<Briefcase />} label="Profession" value={myDetails.detailed.up_profession || 'N/A'} />
          <ProfileItem icon={<Briefcase />} label="Job Status" value={myDetails.detailed.up_job_status || 'N/A'} />
          <ProfileItem icon={<Briefcase />} label="Annual Income" value={myDetails.detailed.up_annual_income ? `₹${myDetails.detailed.up_annual_income}` : 'N/A'} />
          {myDetails.detailed.up_company_name && (
            <ProfileItem icon={<Briefcase />} label="Company" value={myDetails.detailed.up_company_name} />
          )}
          {myDetails.detailed.up_company_address && (
            <ProfileItem icon={<MapPin />} label="Company Address" value={myDetails.detailed.up_company_address} />
          )}
          {myDetails.detailed.up_about_profession && (
            <div className="md:col-span-2 lg:col-span-3">
              <ProfileItem icon={<Briefcase />} label="About Profession" value={myDetails.detailed.up_about_profession} />
            </div>
          )}
        </div>
      </div>

      {/* Family Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-red-500" />
          Family Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProfileItem icon={<Users />} label="Family Type" value={myDetails.detailed.up_family_type || 'N/A'} />
          <ProfileItem icon={<Users />} label="Family Status" value={myDetails.detailed.up_family_status || 'N/A'} />
          <ProfileItem icon={<Users />} label="Family Values" value={myDetails.detailed.up_family_values || 'N/A'} />
          <ProfileItem icon={<Briefcase />} label="Father's Occupation" value={myDetails.detailed.up_father_occupation || 'N/A'} />
          <ProfileItem icon={<Briefcase />} label="Mother's Occupation" value={myDetails.detailed.up_mother_occupation || 'N/A'} />
          <ProfileItem icon={<Users />} label="Brothers" value={(myDetails.detailed.up_no_of_brothers ?? 0).toString()} />
          <ProfileItem icon={<Users />} label="Sisters" value={(myDetails.detailed.up_no_of_sisters ?? 0).toString()} />
          {myDetails.detailed.up_about_family && (
            <div className="md:col-span-2 lg:col-span-3">
              <ProfileItem icon={<Users />} label="About Family" value={myDetails.detailed.up_about_family} />
            </div>
          )}
        </div>
      </div>

      {/* Hobbies & Interests */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Star className="h-5 w-5 mr-2 text-red-500" />
          Hobbies & Interests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myDetails.detailed.up_hobbies && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1 flex items-center">
                <Star className="h-4 w-4 mr-1 text-red-500" />
                Hobbies
              </p>
              <p className="text-sm font-medium text-gray-900">
                {Array.isArray(myDetails.detailed.up_hobbies)
                  ? myDetails.detailed.up_hobbies.join(', ')
                  : myDetails.detailed.up_hobbies}
              </p>
            </div>
          )}
          {myDetails.detailed.up_music && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1 flex items-center">
                <Star className="h-4 w-4 mr-1 text-red-500" />
                Music
              </p>
              <p className="text-sm font-medium text-gray-900">
                {Array.isArray(myDetails.detailed.up_music)
                  ? myDetails.detailed.up_music.join(', ')
                  : myDetails.detailed.up_music}
              </p>
            </div>
          )}
          {myDetails.detailed.up_reads && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1 flex items-center">
                <Star className="h-4 w-4 mr-1 text-red-500" />
                Reading
              </p>
              <p className="text-sm font-medium text-gray-900">
                {Array.isArray(myDetails.detailed.up_reads)
                  ? myDetails.detailed.up_reads.join(', ')
                  : myDetails.detailed.up_reads}
              </p>
            </div>
          )}
          {myDetails.detailed.up_cuisine && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1 flex items-center">
                <Star className="h-4 w-4 mr-1 text-red-500" />
                Cuisine
              </p>
              <p className="text-sm font-medium text-gray-900">
                {Array.isArray(myDetails.detailed.up_cuisine)
                  ? myDetails.detailed.up_cuisine.join(', ')
                  : myDetails.detailed.up_cuisine}
              </p>
            </div>
          )}
          {myDetails.detailed.up_diet && (
            <ProfileItem icon={<Star />} label="Diet" value={myDetails.detailed.up_diet} />
          )}
          {myDetails.detailed.up_drink && (
            <ProfileItem icon={<Star />} label="Drinking" value={myDetails.detailed.up_drink} />
          )}
          {myDetails.detailed.up_smoke && (
            <ProfileItem icon={<Star />} label="Smoking" value={myDetails.detailed.up_smoke} />
          )}
        </div>
      </div>

      {/* About Myself */}
      {myDetails.detailed.up_about_myself && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-red-500" />
            About Myself
          </h2>
          <p className="text-gray-700 leading-relaxed">{myDetails.detailed.up_about_myself}</p>
        </div>
      )}
    </div>
  );
}

// Account Settings Section Component
function AccountSettingsSection({ myDetails, myPhotos, onRefresh }: { myDetails: MyDetails | null; myPhotos: MyPhotos | null; onRefresh: () => void }) {
  // Extract privacy settings from API data
  const photoLocked = myPhotos?.lock_status === 'yes';
  const profileHidden = myDetails?.basic?.user_hide === 'yes';

  return (
    <div className="space-y-6">
      {/* Privacy Settings */}
      <PrivacySettings
        initialPhotoLocked={photoLocked}
        initialProfileHidden={profileHidden}
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
}

// Change Password Section Component
function ChangePasswordSection() {
  return (
    <div className="space-y-6">
      <PasswordChangeSettings />
    </div>
  );
}

// Placeholder Section Component
function PlaceholderSection({ title, message }: { title: string; message: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Star className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <p className="text-sm text-gray-500">This feature is coming soon!</p>
      </div>
    </div>
  );
}

// Reusable Components
function StatCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: number; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${colorClasses[color as keyof typeof colorClasses]} p-3 rounded-lg text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function CompletionItem({ label, status, editLink, onClick, points }: { label: string; status: string; editLink?: string; onClick?: () => void; points?: string }) {
  // API returns '1' for complete, '0' for incomplete
  const isComplete = status === '1' || status === 'yes';

  // Define elegant colors and styles based on completion status
  const containerClasses = isComplete
    ? 'bg-white border-2 border-green-200 hover:border-green-400'
    : 'bg-white border-2 border-orange-200 hover:border-orange-400';

  const buttonClasses = `w-full flex items-center justify-center text-xs font-semibold py-2.5 rounded-lg transition-all duration-200 ${
    isComplete
      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg'
      : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg'
  }`;

  const ButtonContent = () => (
    <>
      {isComplete ? (
        <>
          <Edit className="h-4 w-4 mr-1.5" />
          Edit
        </>
      ) : (
        <>
          <Plus className="h-4 w-4 mr-1.5" />
          Add Now
        </>
      )}
    </>
  );

  return (
    <div className={`p-4 rounded-xl ${containerClasses} transition-all duration-300 hover:shadow-lg group`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className={`text-sm font-bold mb-1 ${isComplete ? 'text-gray-800' : 'text-gray-800'}`}>
            {label}
          </h4>
          {points && (
            <div className="flex items-center gap-1">
              <Star className={`h-3 w-3 ${isComplete ? 'text-green-500' : 'text-orange-500'}`} />
              <span className="text-xs font-medium text-gray-600">{points}</span>
            </div>
          )}
        </div>
        <div className={`flex-shrink-0 ml-2 ${isComplete ? 'text-green-500' : 'text-orange-500'}`}>
          {isComplete ? (
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5" />
            </div>
          )}
        </div>
      </div>
      {editLink ? (
        <Link href={editLink} className={buttonClasses}>
          <ButtonContent />
        </Link>
      ) : (
        <button onClick={onClick} className={buttonClasses}>
          <ButtonContent />
        </button>
      )}
    </div>
  );
}

function PlanItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="text-red-500">{icon}</div>
      <div>
        <p className="text-xs text-gray-600">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

// Helper function to calculate remaining days from timestamp
function getRemainingDays(timestamp: string): { text: string; color: string; urgent: boolean } {
  const expiryDate = new Date(parseInt(timestamp) * 1000);
  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: 'Expired', color: 'text-red-600', urgent: true };
  } else if (diffDays === 0) {
    return { text: 'Expires Today', color: 'text-red-600', urgent: true };
  } else if (diffDays === 1) {
    return { text: '1 day left', color: 'text-orange-600', urgent: true };
  } else if (diffDays <= 7) {
    return { text: `${diffDays} days left`, color: 'text-orange-600', urgent: true };
  } else if (diffDays <= 30) {
    return { text: `${diffDays} days left`, color: 'text-yellow-600', urgent: false };
  } else {
    return { text: `${diffDays} days left`, color: 'text-green-600', urgent: false };
  }
}

function ExpiryPlanItem({ timestamp }: { timestamp: string }) {
  const expiryInfo = getRemainingDays(timestamp);

  return (
    <div className="flex items-center space-x-3">
      <div className={`${expiryInfo.urgent ? 'text-red-500 animate-pulse' : 'text-red-500'}`}>
        <Clock />
      </div>
      <div>
        <p className="text-xs text-gray-600">Expires</p>
        <p className={`text-sm font-semibold ${expiryInfo.color}`}>
          {expiryInfo.text}
        </p>
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
      <div className="text-red-500 mt-1">{icon}</div>
      <div>
        <p className="text-xs text-gray-600 mb-1">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function DashboardPage() {
  return (
    <Suspense fallback={
      <AuthGuard requireAuth={true} redirectTo="/login">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
              <p className="text-gray-600">Loading your dashboard...</p>
            </div>
          </main>
          <Footer />
        </div>
      </AuthGuard>
    }>
      <DashboardContent />
    </Suspense>
  );
}
