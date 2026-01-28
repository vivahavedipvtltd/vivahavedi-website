'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';

interface Religion {
  id: number;
  name: string;
}

interface Caste {
  id: number;
  name: string;
  masterId: number;
}

interface SearchProfile {
  id: number;
  name: string;
  age: number;
  qualification: string | null;
  district: string | null;
  photo: string | null;
}

interface State {
  id: number;
  name: string;
}

interface District {
  id: number;
  name: string;
  masterId: number;
}

interface MaritalStatus {
  id: number;
  name: string;
}

interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export default function CasteMatrimonyPage() {
  const params = useParams();
  const router = useRouter();
  const religionSlug = params.religion as string;
  const casteSlug = params.caste as string;

  const [religion, setReligion] = useState<Religion | null>(null);
  const [caste, setCaste] = useState<Caste | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<SearchProfile[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Pagination
  const [pagination, setPagination] = useState<Pagination>({
    current_page: 1,
    per_page: 12,
    total: 0,
    total_pages: 0
  });

  // Master data
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [allDistricts, setAllDistricts] = useState<District[]>([]);
  const [maritalStatuses, setMaritalStatuses] = useState<MaritalStatus[]>([]);

  // Search filters (excluding religion and caste)
  const [filters, setFilters] = useState({
    gender: '',
    age_from: '',
    age_to: '',
    marital_status: '',
    state: '',
    district: ''
  });

  // Generate age options (18-80)
  const ageOptions = Array.from({ length: 63 }, (_, i) => i + 18);

  useEffect(() => {
    fetchCasteAndReligion();
  }, [religionSlug, casteSlug]);

  const fetchCasteAndReligion = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/masters`);
      const data = await response.json();

      if (data.status === 'success') {
        const religions: Religion[] = data.data.religion;
        const castes: Caste[] = data.data.caste;

        // Set master data
        setStates(data.data.state || []);
        setAllDistricts(data.data.district || []);
        setMaritalStatuses(data.data.marital_status || []);

        // Find religion by slug
        const foundReligion = religions.find(
          r => r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === religionSlug
        );

        if (foundReligion) {
          setReligion(foundReligion);

          // Find caste by slug and religion
          const foundCaste = castes.find(
            c => c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === casteSlug &&
                 c.masterId === foundReligion.id
          );

          if (foundCaste) {
            setCaste(foundCaste);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle state change and filter districts
  const handleStateChange = (stateId: string) => {
    setFilters({ ...filters, state: stateId, district: '' });
    if (stateId) {
      const filteredDistricts = allDistricts.filter(
        d => d.masterId === parseInt(stateId)
      );
      setDistricts(filteredDistricts);
    } else {
      setDistricts([]);
    }
  };

  const handleSearch = async (e?: React.FormEvent, page: number = 1) => {
    if (e) e.preventDefault();

    if (!caste) return;

    // Validate all required fields (only for initial search, not pagination)
    if (page === 1) {
      if (!filters.gender || !filters.age_from || !filters.age_to || !filters.marital_status || !filters.state || !filters.district) {
        alert('Please fill all required fields');
        return;
      }
    }

    try {
      setSearching(true);
      if (page === 1) {
        setSearchPerformed(true);
      }

      // Build search params - use 'caste' not 'caste_id'
      const searchParams: Record<string, string> = {
        caste: caste.id.toString(),
        page: page.toString(),
        per_page: '12'
      };

      // Add other filters if they have values
      if (filters.gender) searchParams.gender = filters.gender;
      if (filters.age_from) searchParams.age_from = filters.age_from;
      if (filters.age_to) searchParams.age_to = filters.age_to;
      if (filters.marital_status) searchParams.marital_status = filters.marital_status;
      if (filters.state) searchParams.state = filters.state;
      if (filters.district) searchParams.district = filters.district;

      const urlParams = new URLSearchParams(searchParams);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/public-search?${urlParams.toString()}`
      );
      const data = await response.json();

      if (data.status === 'success') {
        setSearchResults(data.data || []);
        setPagination(data.pagination || {
          current_page: 1,
          per_page: 12,
          total: 0,
          total_pages: 0
        });

        // Scroll to results
        if (page > 1) {
          const resultsSection = document.getElementById('search-results');
          if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      } else {
        console.error('Search failed:', data.message);
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Error searching profiles:', err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    handleSearch(undefined, newPage);
  };

  const handleViewProfile = () => {
    router.push('/login');
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-16">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!religion || !caste) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-8">The matrimony page you are looking for does not exist.</p>
            <button
              onClick={() => router.push('/')}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Go to Home
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {caste.name} Matrimony
            </h1>
            <p className="text-xl md:text-2xl mb-2">
              Find your perfect {caste.name} life partner
            </p>
            <p className="text-lg opacity-90">
              Thousands of verified {religion.name} {caste.name} profiles
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About {caste.name} Matrimony
            </h2>
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                Welcome to {caste.name} Matrimony, the trusted platform for {religion.name} {caste.name}
                brides and grooms looking for their perfect life partner. We understand the importance of
                finding a compatible match within your community, and our platform is designed to help you
                connect with verified {caste.name} profiles.
              </p>
              <p className="mb-4">
                Our {caste.name} matrimony service offers a secure and user-friendly platform where you can
                search for potential matches based on your preferences. All profiles are verified to ensure
                authenticity and provide you with a safe matchmaking experience.
              </p>
              <p>
                Start your search today and find your ideal {caste.name} life partner from our extensive
                database of verified profiles.
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Search {caste.name} Profiles
            </h2>

            <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Looking for <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={filters.gender}
                    onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select</option>
                    <option value="female">Bride</option>
                    <option value="male">Groom</option>
                  </select>
                </div>

                {/* Age From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age From <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={filters.age_from}
                    onChange={(e) => setFilters({ ...filters, age_from: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Age</option>
                    {ageOptions.map((age) => (
                      <option key={age} value={age}>
                        {age}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Age To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age To <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={filters.age_to}
                    onChange={(e) => setFilters({ ...filters, age_to: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Age</option>
                    {ageOptions.map((age) => (
                      <option key={age} value={age}>
                        {age}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={filters.marital_status}
                    onChange={(e) => setFilters({ ...filters, marital_status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Marital Status</option>
                    {maritalStatuses.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={filters.state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={filters.district}
                    onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                    disabled={!filters.state}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  type="submit"
                  disabled={searching}
                  className="bg-red-500 hover:bg-red-600 text-white px-12 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {searching ? 'Searching...' : 'Search Profiles'}
                </button>
              </div>
            </form>

            {/* Search Results */}
            {searchPerformed && (
              <div id="search-results">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Search Results ({pagination.total} profiles found)
                </h3>

                {searchResults.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {searchResults.map((profile) => (
                        <div
                          key={profile.id}
                          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                          onClick={() => handleViewProfile()}
                        >
                          <div className="bg-gray-200 relative h-64">
                            <Image
                              src={profile.photo || '/placeholder-avatar.png'}
                              alt={profile.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              className="object-cover"
                              unoptimized={profile.photo?.includes('vivahavedimatrimony.com')}
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                              {profile.name}
                            </h3>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>
                                {profile.age} Yrs{profile.qualification && `, ${profile.qualification}`}
                              </p>
                              {profile.district && <p>{profile.district}</p>}
                            </div>
                            <button className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                              View Profile
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {pagination.total_pages > 1 && (
                      <div className="mt-8 flex justify-center items-center space-x-2">
                        {/* Previous Button */}
                        <button
                          onClick={() => handlePageChange(pagination.current_page - 1)}
                          disabled={pagination.current_page === 1 || searching}
                          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          Previous
                        </button>

                        {/* Page Numbers */}
                        <div className="flex space-x-2">
                          {/* First Page */}
                          {pagination.current_page > 3 && (
                            <>
                              <button
                                onClick={() => handlePageChange(1)}
                                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                              >
                                1
                              </button>
                              {pagination.current_page > 4 && (
                                <span className="px-2 py-2 text-gray-500">...</span>
                              )}
                            </>
                          )}

                          {/* Current and nearby pages */}
                          {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                            .filter(page => {
                              return (
                                page === pagination.current_page ||
                                page === pagination.current_page - 1 ||
                                page === pagination.current_page + 1 ||
                                page === pagination.current_page - 2 ||
                                page === pagination.current_page + 2
                              );
                            })
                            .map(page => (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                disabled={searching}
                                className={`px-4 py-2 border rounded-lg transition-colors duration-200 ${
                                  page === pagination.current_page
                                    ? 'bg-red-500 text-white border-red-500'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {page}
                              </button>
                            ))}

                          {/* Last Page */}
                          {pagination.current_page < pagination.total_pages - 2 && (
                            <>
                              {pagination.current_page < pagination.total_pages - 3 && (
                                <span className="px-2 py-2 text-gray-500">...</span>
                              )}
                              <button
                                onClick={() => handlePageChange(pagination.total_pages)}
                                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                              >
                                {pagination.total_pages}
                              </button>
                            </>
                          )}
                        </div>

                        {/* Next Button */}
                        <button
                          onClick={() => handlePageChange(pagination.current_page + 1)}
                          disabled={pagination.current_page === pagination.total_pages || searching}
                          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <p className="text-gray-600 text-lg">
                      No profiles found matching your criteria. Try adjusting your search filters.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Why Choose Our {caste.name} Matrimony Service?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Profiles</h3>
                <p className="text-gray-600">
                  All {caste.name} profiles are verified to ensure authenticity and security
                </p>
              </div>

              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Large Database</h3>
                <p className="text-gray-600">
                  Thousands of {caste.name} brides and grooms registered on our platform
                </p>
              </div>

              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Privacy & Security</h3>
                <p className="text-gray-600">
                  Your personal information is secure with our advanced privacy controls
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
