'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = false,
  redirectTo = '/',
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const hasRedirected = useRef(false);

  // Handle redirect during render to prevent flash of content
  // Only redirect once to avoid multiple navigation attempts
  useEffect(() => {
    if (!isLoading && !hasRedirected.current) {
      if (requireAuth && !isAuthenticated) {
        // User is not authenticated but trying to access protected route
        hasRedirected.current = true;
        router.replace('/login'); // Use replace() to avoid polluting browser history
      } else if (!requireAuth && isAuthenticated) {
        // User is authenticated but trying to access auth pages (login/register)
        hasRedirected.current = true;
        router.replace(redirectTo); // Use replace() to avoid polluting browser history
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, router, redirectTo]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // If requireAuth is true and user is not authenticated, show loading (will redirect)
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // If requireAuth is false (auth pages) and user is authenticated, show loading (will redirect)
  if (!requireAuth && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // User has correct auth state, show the page
  return <>{children}</>;
};
