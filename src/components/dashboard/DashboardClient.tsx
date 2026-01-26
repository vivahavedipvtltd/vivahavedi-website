'use client';

import { useState, useEffect, useRef, useCallback, Suspense, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
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
import { useDashboardData } from '@/hooks/useDashboardData';

// Sections that should redirect to their own dedicated pages
const REDIRECT_SECTIONS: Record<string, string> = {
  'search': '/search-results',
  'blocked-profiles': '/dashboard/blocked-profiles',
  'matching-profiles': '/dashboard/matching-profiles',
  'upgrade-plan': '/dashboard/settings/plan-upgrade',
  'saved-searches': '/dashboard/saved-searches',
};

// Internal component to handle search params with Suspense
function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [, startTransition] = useTransition();

  // Ref to track if we've already processed URL params (prevents infinite loops)
  const processedParamsRef = useRef<string | null>(null);

  // Use SWR for data fetching with automatic caching, revalidation, and retry
  const {
    myDetails,
    communicationStats,
    myPlan,
    myPhotos,
    isLoading,
    error,
    refresh,
  } = useDashboardData(token);

  // Centralized navigation handler - handles redirects for specific sections
  // Memoized to prevent recreation on every render
  const handleSectionNavigation = useCallback((section: string) => {
    const redirectPath = REDIRECT_SECTIONS[section];
    if (redirectPath) {
      router.push(redirectPath);
    }
  }, [router]);

  // Optimized section change handler - combines state update + navigation
  // This prevents the need for a second useEffect watching activeSection
  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
    // Immediately handle redirect if needed (no waiting for re-render)
    handleSectionNavigation(section);
  }, [handleSectionNavigation]);

  // Check for section parameter from URL and reset parameter
  // Optimized to prevent infinite loops and unnecessary re-renders
  useEffect(() => {
    const resetParam = searchParams.get('reset');
    const sectionParam = searchParams.get('section');

    // Create a unique key for current params
    const paramsKey = `${resetParam || ''}-${sectionParam || ''}`;

    // Skip if we've already processed these exact params
    if (processedParamsRef.current === paramsKey) {
      return;
    }

    // Process params
    if (resetParam === 'true') {
      processedParamsRef.current = paramsKey;
      handleSectionChange('overview');

      // Use startTransition for non-blocking URL update
      startTransition(() => {
        router.replace('/dashboard');
      });
    } else if (sectionParam) {
      processedParamsRef.current = paramsKey;
      handleSectionChange(sectionParam);

      // Use startTransition for non-blocking URL update
      startTransition(() => {
        router.replace('/dashboard');
      });
    } else {
      // Mark empty params as processed to prevent re-processing
      processedParamsRef.current = paramsKey;
    }
  }, [searchParams, router, startTransition, handleSectionChange]);

  // Loading state - uses DashboardLayout with centered content
  if (isLoading) {
    return (
      <DashboardLayout centered>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Error state with retry functionality (SWR handles automatic retry)
  // Uses DashboardLayout with centered content
  if (error || !myDetails) {
    return (
      <DashboardLayout centered>
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error?.message || 'Failed to load dashboard'}
          </p>
          <button
            onClick={() => refresh()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-colors"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Render different sections based on active section
  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <OverviewSection
            myDetails={myDetails}
            communicationStats={communicationStats || null}
            myPlan={myPlan || null}
            onSectionChange={handleSectionChange}
          />
        );
      case 'my-profile':
        return <MyProfileSection myDetails={myDetails} />;
      case 'my-photos':
        return myPhotos ? (
          <MyPhotosManagement myPhotos={myPhotos} onRefresh={refresh} />
        ) : null;
      case 'my-documents':
        return myPhotos ? (
          <MyDocumentsManagement myPhotos={myPhotos} onRefresh={refresh} />
        ) : null;
      case 'mobile-verification':
        return <MobileVerification onVerificationComplete={refresh} />;
      case 'partner-preferences':
        return <PartnerPreferencesCard />;
      case 'search':
        return (
          <PlaceholderSection
            title="Redirecting..."
            message="Taking you to search page..."
          />
        );
      case 'matching-profiles':
        return (
          <PlaceholderSection
            title="Redirecting..."
            message="Taking you to matching profiles page..."
          />
        );
      case 'saved-searches':
        return (
          <PlaceholderSection
            title="Redirecting..."
            message="Taking you to saved searches page..."
          />
        );
      case 'interests':
      case 'messages':
      case 'profile-views':
      case 'requests':
      case 'shortlisted':
      case 'viewed-profiles':
      case 'contacted':
        return <CommunicationViewsSection initialSection={activeSection} />;
      case 'blocked-profiles':
        return (
          <PlaceholderSection
            title="Redirecting..."
            message="Taking you to blocked profiles page..."
          />
        );
      case 'upgrade-plan':
        return (
          <PlaceholderSection
            title="Redirecting..."
            message="Taking you to plan upgrade page..."
          />
        );
      case 'account-settings':
        return (
          <AccountSettingsSection
            myDetails={myDetails}
            myPhotos={myPhotos || null}
            onRefresh={refresh}
          />
        );
      case 'change-password':
        return <ChangePasswordSection />;
      default:
        return (
          <OverviewSection
            myDetails={myDetails}
            communicationStats={communicationStats || null}
            myPlan={myPlan || null}
            onSectionChange={handleSectionChange}
          />
        );
    }
  };

  // Main dashboard view - uses DashboardLayout without centering
  return (
    <DashboardLayout>
      <div className="flex-grow flex bg-gray-50">
        {/* Sidebar */}
        <DashboardSidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          stats={communicationStats || undefined}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}

// Client component with Suspense boundary for useSearchParams
// Uses DashboardLayout in fallback to eliminate duplication
export default function DashboardClient() {
  return (
    <Suspense
      fallback={
        <DashboardLayout centered>
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </DashboardLayout>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
