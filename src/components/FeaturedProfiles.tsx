'use client';

import { useState, useEffect, useRef } from 'react';
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
    per_page: 5,
    total: 0,
    total_pages: 0
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load profiles from API
  const loadProfiles = async (page: number, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await getHomepageProfiles(page, 5);

      if (response.status === 'success') {
        if (append) {
          setProfiles((prev) => [...prev, ...response.data]);
        } else {
          setProfiles(response.data);
        }
        setPagination(response.pagination);
      } else {
        setError(response.message || 'Failed to load profiles');
      }
    } catch (err) {
      console.error('Error loading profiles:', err);
      setError('Unable to load profiles. Please try again later.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load profiles on component mount
  useEffect(() => {
    loadProfiles(1);
  }, []);

  // Handle scroll event for infinite scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;

      // Check if scrolled near the end (within 100px)
      if (scrollWidth - scrollLeft - clientWidth < 100) {
        // Load more if there are more pages and not already loading
        if (pagination.current_page < pagination.total_pages && !loadingMore && !loading) {
          loadProfiles(pagination.current_page + 1, true);
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [pagination.current_page, pagination.total_pages, loadingMore, loading]);

  // Handle mouse drag to scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier

    // Mark as moved if mouse moved more than 5 pixels
    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }

    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setHasMoved(false);
  };

  // Handle View Profile - Check authentication and redirect accordingly
  const handleViewProfile = (profileId: number, e: React.MouseEvent) => {
    // Prevent navigation if user was actually dragging (not just clicking)
    if (hasMoved) {
      e.preventDefault();
      return;
    }

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
              ref={scrollContainerRef}
              className="flex gap-6 min-h-[500px] overflow-x-auto pb-4 scrollbar-hide select-none"
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col flex-shrink-0 w-64"
                  onClick={(e) => handleViewProfile(profile.id, e)}
                >
                  <div className="bg-gray-200 flex-shrink-0 relative h-[18rem]">
                    <Image
                      src={profile.photo || '/placeholder-avatar.png'}
                      alt={`${profile.name} - ${profile.age} years old ${profile.qualification ? profile.qualification + ' professional' : 'matrimonial profile'} from ${profile.district || 'India'}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover"
                      unoptimized={profile.photo?.includes('vivahavedimatrimony.com')}
                    />
                  </div>
                  <div className="p-4 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                      {profile.name}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 flex-grow">
                      <p>
                        <span className="font-medium">User ID:</span> {profile.user_id}
                      </p>
                      <p>
                        {profile.age} Yrs{profile.qualification && `, ${profile.qualification}`}
                      </p>
                      {profile.district && (
                        <p>{profile.district}</p>
                      )}
                    </div>
                    <button className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex-shrink-0">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
              {/* Loading more indicator */}
              {loadingMore && (
                <div className="flex items-center justify-center w-64 flex-shrink-0">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
              )}
            </div>

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
