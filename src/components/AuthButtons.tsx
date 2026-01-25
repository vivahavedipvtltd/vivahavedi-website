'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthButtonsProps {
  onLogout?: () => void;
  isMobile?: boolean;
}

export default function AuthButtons({ onLogout, isMobile = false }: AuthButtonsProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Navigate to dashboard with a reset flag
    router.push('/dashboard?reset=true');
    if (onLogout) onLogout();
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
    if (onLogout) onLogout();
  };

  // Always show loading skeleton on initial render (both server and client)
  // This prevents hydration mismatch
  if (!isClient || isLoading) {
    if (isMobile) {
      return (
        <div className="w-full px-3 py-2 mt-2">
          <div className="w-full h-10 bg-gray-200 rounded-md animate-pulse" />
        </div>
      );
    }
    return (
      <div className="w-32 h-10 bg-gray-200 rounded-full animate-pulse" />
    );
  }

  // After client-side mount and loading is complete, show actual auth state
  if (isAuthenticated) {
    if (isMobile) {
      return (
        <>
          <Link
            href="/dashboard"
            className="flex items-center w-full px-3 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-50 rounded-md font-medium mt-2"
            onClick={handleDashboardClick}
          >
            <User className="h-5 w-5 mr-2" />
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md font-medium mt-2"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </>
      );
    }
    return (
      <div className="flex items-center space-x-3">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium transition-colors duration-200"
          onClick={handleDashboardClick}
        >
          <User className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium transition-colors duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    );
  }

  // Not authenticated
  if (isMobile) {
    return (
      <>
        <Link
          href="/login"
          className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md font-medium mt-2"
          onClick={onLogout}
        >
          Login
        </Link>
        <Link
          href="/register"
          className="block w-full text-center bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md font-medium mt-2"
          onClick={onLogout}
        >
          Register
        </Link>
      </>
    );
  }
  return (
    <div className="flex items-center space-x-3">
      <Link
        href="/login"
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-medium transition-colors duration-200"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200"
      >
        Register
      </Link>
    </div>
  );
}