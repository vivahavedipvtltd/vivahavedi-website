'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import CommunicationViewsSection from '@/components/CommunicationViewsSection';
import MyPhotosManagement from '@/components/MyPhotosManagement';
import MyDocumentsManagement from '@/components/MyDocumentsManagement';
import MobileVerification from '@/components/MobileVerification';
import OverviewSection from '@/components/dashboard/OverviewSection';
import MyProfileSection from '@/components/dashboard/MyProfileSection';
import AccountSettingsSection from '@/components/dashboard/AccountSettingsSection';
import ChangePasswordSection from '@/components/dashboard/ChangePasswordSection';
import PlaceholderSection from '@/components/dashboard/PlaceholderSection';
import PartnerPreferencesCard from '@/components/dashboard/PartnerPreferencesCard';
import ErrorBoundary from '@/components/ErrorBoundary';
import { MyDetails, CommunicationStats, MyPlan, MyPhotos } from '@/types/dashboard';

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
        return <PlaceholderSection title="Redirecting..." message="Taking you to search page..." />;
      case 'matching-profiles':
        return <PlaceholderSection title="Redirecting..." message="Taking you to matching profiles page..." />;
      case 'saved-searches':
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
        return <PlaceholderSection title="Redirecting..." message="Taking you to blocked profiles page..." />;
      case 'upgrade-plan':
        return <PlaceholderSection title="Redirecting..." message="Taking you to plan upgrade page..." />;
      case 'account-settings':
        return <AccountSettingsSection myDetails={myDetails} myPhotos={myPhotos} onRefresh={fetchDashboardData} />;
      case 'change-password':
        return <ChangePasswordSection />;
      default:
        return <OverviewSection myDetails={myDetails} communicationStats={communicationStats} myPlan={myPlan} onSectionChange={setActiveSection} />;
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


// Main export with ErrorBoundary and Suspense boundary
export default function DashboardPage() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
