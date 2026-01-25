'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  getHomepageProfiles,
  type HomepageProfile,
  type ProfilesPagination
} from '@/lib/homepageProfilesApi';
import { useAuth } from '@/contexts/AuthContext';

const FeaturedProfiles = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [profiles, setProfiles] = useState<HomepageProfile[]>([]);
  const [pagination, setPagination] = useState<ProfilesPagination>({
    current_page: 1,
    per_page: 8,
    total: 0,
    total_pages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Load profiles from API
  const loadProfiles = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getHomepageProfiles(page, 8);

      if (response.status === 'success') {
        setProfiles(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.message || 'Failed to load profiles');
      }
    } catch (err) {
      console.error('Error loading profiles:', err);
      setError('Unable to load profiles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Load profiles on component mount
  useEffect(() => {
    loadProfiles(1);
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (loading || error || isPaused || pagination.total_pages <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setPagination((prev) => {
        const nextPage = prev.current_page >= prev.total_pages ? 1 : prev.current_page + 1;
        loadProfiles(nextPage);
        return prev;
      });
    }, 5000); // Change page every 5 seconds

    return () => clearInterval(interval);
  }, [loading, error, isPaused, pagination.total_pages, pagination.current_page]);

  // Go to specific page
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.total_pages) {
      loadProfiles(page);
    }
  };

  // Handle View Profile - Check authentication and redirect accordingly
  const handleViewProfile = (profileId: number) => {
    if (isAuthenticated) {
      router.push(`/profile/${profileId}`);
    } else {
      router.push('/login');
    }
  };

  // Handle View All Profiles - Redirect to login
  const handleViewAll = () => {
    router.push('/login');
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Profiles
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet verified members who are ready to start their journey of love and companionship
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => loadProfiles(1)}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Profiles Grid */}
        {!loading && !error && profiles.length > 0 && (
          <>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[700px]"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col"
                  onClick={() => handleViewProfile(profile.id)}
                >
                  <div className="bg-gray-200 flex-shrink-0 relative h-[22rem]">
                    <Image
                      src={profile.photo || '/placeholder-avatar.png'}
                      alt={profile.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover"
                      unoptimized={profile.photo?.includes('vivahavedimatrimony.com')}
                    />
                  </div>
                  <div className="p-4 flex flex-col h-[19rem]">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                      {profile.name}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 flex-grow overflow-y-auto">
                      <p>
                        <span className="font-medium">Age:</span> {profile.age} years
                      </p>
                      {profile.height && (
                        <p>
                          <span className="font-medium">Height:</span> {profile.height} cm
                        </p>
                      )}
                      {profile.marital_status && (
                        <p>
                          <span className="font-medium">Status:</span> {profile.marital_status}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Religion:</span> {profile.religion}
                      </p>
                      <p>
                        <span className="font-medium">Caste:</span> {profile.caste}
                      </p>
                      {profile.district && (
                        <p>
                          <span className="font-medium">Location:</span> {profile.district}
                        </p>
                      )}
                      {profile.qualification && (
                        <p>
                          <span className="font-medium">Education:</span> {profile.qualification}
                        </p>
                      )}
                    </div>
                    <button className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex-shrink-0">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            {pagination.total_pages > 1 && (
              <div className="flex items-center justify-center mt-8 space-x-2">
                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`h-3 w-3 rounded-full transition-all duration-300 ${
                      page === pagination.current_page
                        ? 'bg-red-500 w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to page ${page}`}
                  />
                ))}
              </div>
            )}

            {/* View All Button */}
            <div className="text-center mt-8">
              <button
                onClick={handleViewAll}
                className="bg-white text-red-600 border-2 border-red-500 hover:bg-red-500 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors duration-200 shadow-lg"
              >
                View All Profiles
              </button>
            </div>
          </>
        )}

        {/* No Profiles State */}
        {!loading && !error && profiles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No featured profiles available at the moment.</p>
            <p className="text-gray-500 mt-2">Please check back later.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProfiles;
