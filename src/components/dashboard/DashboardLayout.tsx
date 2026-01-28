import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';

interface DashboardLayoutProps {
  children: ReactNode;
  /**
   * Whether to show full-width centered content (for loading/error states)
   * Default: false (shows normal dashboard layout)
   */
  centered?: boolean;
  /**
   * Whether to show the footer
   * Default: true (shows footer)
   */
  showFooter?: boolean;
}

/**
 * Reusable dashboard layout wrapper
 * Eliminates code duplication by providing consistent layout structure
 * for all dashboard states (loading, error, main content)
 *
 * FEATURES:
 * - AuthGuard protection (requires authentication)
 * - Consistent Header and Footer
 * - Responsive full-height layout
 * - Centered mode for loading/error states
 *
 * USAGE:
 * <DashboardLayout>
 *   <YourContent />
 * </DashboardLayout>
 *
 * <DashboardLayout centered>
 *   <LoadingSpinner />
 * </DashboardLayout>
 */
export default function DashboardLayout({ children, centered = false, showFooter = true }: DashboardLayoutProps) {
  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <div className={showFooter ? "min-h-screen flex flex-col" : "h-screen flex flex-col"}>
        <Header />

        {centered ? (
          // Centered content for loading/error states
          <main className="flex-grow flex items-center justify-center bg-gray-50">
            {children}
          </main>
        ) : (
          // Normal content (passthrough children as-is)
          children
        )}

        {showFooter && <Footer />}
      </div>
    </AuthGuard>
  );
}
