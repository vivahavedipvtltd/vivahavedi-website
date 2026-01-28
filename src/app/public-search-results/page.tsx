'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Loader2, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { publicSearch, PublicSearchParams } from '@/lib/publicSearchApi';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileResult {
  id: number;
  name: string;
  age: number;
  height: string;
  marital_status: string;
  religion: string;
  caste: string;
  district: string;
  qualification: string;
  photo: string;
}

const PublicSearchResultsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ProfileResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const executeSearch = useCallback(async (page: number) => {
    setLoading(true);
    try {
      // Build search params from URL
      const params: PublicSearchParams = {
        page,
        per_page: 12,
      };

      const gender = searchParams.get('gender');
      if (gender) params.gender = gender as 'male' | 'female';

      const ageFrom = searchParams.get('age_from');
      if (ageFrom) params.age_from = parseInt(ageFrom);

      const ageTo = searchParams.get('age_to');
      if (ageTo) params.age_to = parseInt(ageTo);

      const heightFrom = searchParams.get('height_from');
      if (heightFrom) params.height_from = parseInt(heightFrom);

      const heightTo = searchParams.get('height_to');
      if (heightTo) params.height_to = parseInt(heightTo);

      const religion = searchParams.get('religion');
      if (religion) params.religion = parseInt(religion);

      const caste = searchParams.get('caste');
      if (caste) params.caste = parseInt(caste);

      const maritalStatus = searchParams.get('marital_status');
      if (maritalStatus) params.marital_status = maritalStatus;

      const state = searchParams.get('state');
      if (state) params.state = parseInt(state);

      const district = searchParams.get('district');
      if (district) params.district = parseInt(district);

      // Execute search
      const result = await publicSearch(params);

      if (result.status === 'success') {
        setSearchResults(result.data);
        setCurrentPage(result.pagination.current_page);
        setTotalPages(result.pagination.total_pages);
        setTotalCount(result.pagination.total);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    executeSearch(1);
  }, [executeSearch]);

  const handlePageChange = (page: number) => {
    executeSearch(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProfileClick = (profileId: number) => {
    if (isAuthenticated) {
      // User is logged in, go directly to profile details
      router.push(`/profile/${profileId}`);
    } else {
      // User is not logged in, redirect to login page with return URL
      router.push(`/login?returnTo=/profile/${profileId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/')}
                  className="text-gray-600 hover:text-gray-900 flex items-center"
                >
                  <ArrowLeft className="h-5 w-5 mr-1" />
                  Back to Home
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Search className="h-6 w-6 mr-2 text-red-500" />
                  Search Results
                </h1>
              </div>
            </div>
          </div>

          {/* Search Count Banner */}
          {totalCount > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-gray-900">
                  Total Results: <span className="text-red-600">{totalCount}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages || 1}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Loader2 className="h-16 w-16 text-red-500 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Searching...</h3>
              <p className="text-gray-600">Please wait while we find matching profiles</p>
            </div>
          )}

          {/* Search Results Grid */}
          {!loading && searchResults.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                {searchResults.map((profile) => (
                  <div
                    key={profile.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col"
                    onClick={() => handleProfileClick(profile.id)}
                  >
                    <div className="bg-gray-200 flex-shrink-0 relative h-[18rem]">
                      <Image
                        src={profile.photo || '/placeholder-avatar.png'}
                        alt={profile.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover"
                        unoptimized={profile.photo?.includes('vivahavedimatrimony.com')}
                      />
                    </div>
                    <div className="p-4 flex flex-col h-[12rem]">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                        {profile.name}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600 flex-grow overflow-y-auto">
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
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5 mr-1" />
                      Previous
                    </button>

                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || loading}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <ChevronRight className="h-5 w-5 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* No Results */}
          {!loading && searchResults.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search filters to find more profiles
              </p>
              <button
                onClick={() => router.push('/')}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default function PublicSearchResultsPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <Loader2 className="h-12 w-12 animate-spin text-red-500" />
        </main>
        <Footer />
      </div>
    }>
      <PublicSearchResultsPage />
    </Suspense>
  );
}
