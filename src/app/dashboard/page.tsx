import { Metadata } from 'next';
import ErrorBoundary from '@/components/ErrorBoundary';
import DashboardClient from '@/components/dashboard/DashboardClient';

// Metadata for SEO (Server Component feature)
export const metadata: Metadata = {
  title: 'Dashboard | VivahAvedi Matrimony',
  description: 'Manage your matrimonial profile, view matches, messages, and partner preferences on VivahAvedi.',
  robots: 'noindex, nofollow', // Dashboard should not be indexed by search engines
  openGraph: {
    title: 'Dashboard | VivahAvedi Matrimony',
    description: 'Manage your matrimonial profile and connections',
    type: 'website',
  },
};

// Server Component - No 'use client' directive needed
export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <DashboardClient />
    </ErrorBoundary>
  );
}
