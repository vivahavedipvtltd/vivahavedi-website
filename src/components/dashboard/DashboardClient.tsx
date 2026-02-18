'use client';

import { useState, useEffect, useCallback, Suspense, useTransition } from 'react';
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

  // Use SWR for data fetching with automatic caching, revalidation, and retry
  const {
    myDetails,
    communicationStats,
    myPlan,
    myPhotos,
    partnerProfile,
    isLoading,
    error,
    refresh,
  } = useDashboardData(token);

  // Optimized section change handler - combines state update + navigation + URL update
  // updateUrl parameter prevents infinite loops when called from useEffect
  const handleSectionChange = useCallback((section: string, updateUrl = true) => {
    // Update state
    setActiveSection(section);

    // Handle redirects for sections with dedicated pages
    const redirectPath = REDIRECT_SECTIONS[section];
    if (redirectPath) {
      router.push(redirectPath);
      return;
    }

    // Update URL to reflect current section (for browser history and deep linking)
    // This enables: browser back/forward, bookmarks, sharing links, page refresh
    if (updateUrl) {
      const url = section === 'overview' ? '/dashboard' : `/dashboard?section=${section}`;

      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    }
  }, [router, startTransition]);

  // Sync state with URL on mount and when URL changes
  // Optimized to prevent infinite loops
  useEffect(() => {
    const resetParam = searchParams.get('reset');
    const refreshParam = searchParams.get('refresh');
    const sectionParam = searchParams.get('section');

    // Handle refresh parameter (invalidate cache and reload data)
    if (refreshParam === 'true') {
      refresh();
      // Clear the refresh parameter from URL while preserving the section
      const url = sectionParam ? `/dashboard?section=${sectionParam}` : '/dashboard';
      router.replace(url, { scroll: false });
      return;
    }

    // Handle reset parameter (return to overview)
    if (resetParam === 'true') {
      // Don't update URL here, let handleSectionChange do it
      handleSectionChange('overview', true);
      return;
    }

    // Get target section from URL or default to overview
    const targetSection = sectionParam || 'overview';

    // Only update if section actually changed (prevents infinite loops)
    if (targetSection !== activeSection) {
      // Pass false to prevent URL update (URL is already correct)
      handleSectionChange(targetSection, false);
    }
  }, [searchParams, activeSection, handleSectionChange, refresh, router]);

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
            partnerProfile={partnerProfile || null}
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
        return <PartnerPreferencesCard partnerProfile={partnerProfile || null} detailed />;
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
            partnerProfile={partnerProfile || null}
            onSectionChange={handleSectionChange}
          />
        );
    }
  };

  // Main dashboard view - uses DashboardLayout without centering and without footer
  return (
    <DashboardLayout showFooter={false}>
      <div className="flex-1 flex bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          stats={communicationStats || undefined}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar">
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
