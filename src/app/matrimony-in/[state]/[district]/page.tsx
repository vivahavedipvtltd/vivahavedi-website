'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import FAQSection from '@/components/FAQSection';
import Breadcrumb from '@/components/Breadcrumb';
import UserReviews from '@/components/UserReviews';

interface State {
  id: number;
  name: string;
}

interface District {
  id: number;
  name: string;
  masterId: number;
}

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

const FEATURED_STATE_IDS = [24, 35, 1, 15, 10002, 219];

export default function DistrictMatrimonyPage() {
  const params = useParams();
  const router = useRouter();
  const stateSlug = params.state as string;
  const districtSlug = params.district as string;

  const [state, setState] = useState<State | null>(null);
  const [district, setDistrict] = useState<District | null>(null);
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
  const [religions, setReligions] = useState<Religion[]>([]);
  const [allCastes, setAllCastes] = useState<Caste[]>([]);
  const [castes, setCastes] = useState<Caste[]>([]);
  const [maritalStatuses, setMaritalStatuses] = useState<MaritalStatus[]>([]);

  // Search filters
  const [filters, setFilters] = useState({
    gender: '',
    age_from: '',
    age_to: '',
    marital_status: '',
    religion: '',
    caste: ''
  });

  // Generate age options (18-80)
  const ageOptions = Array.from({ length: 63 }, (_, i) => i + 18);

  const fetchDistrictAndState = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/masters`);
      const data = await response.json();

      if (data.status === 'success') {
        const allStates: State[] = data.data.state;
        const allDistricts: District[] = data.data.district;

        // Set master data
        setReligions(data.data.religion || []);
        setAllCastes(data.data.caste || []);
        setMaritalStatuses(data.data.marital_status || []);

        // Find state by slug - only from featured states
        const foundState = allStates.find(
          s => FEATURED_STATE_IDS.includes(s.id) &&
               s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === stateSlug
        );

        if (foundState) {
          setState(foundState);

          // Find district by slug and state
          const foundDistrict = allDistricts.find(
            d => d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === districtSlug &&
                 d.masterId === foundState.id
          );

          if (foundDistrict) {
            setDistrict(foundDistrict);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [stateSlug, districtSlug]);

  useEffect(() => {
    fetchDistrictAndState();
  }, [stateSlug, districtSlug, fetchDistrictAndState]);

  // Handle religion change and filter castes
  const handleReligionChange = (religionId: string) => {
    setFilters({ ...filters, religion: religionId, caste: '' });
    if (religionId) {
      const filteredCastes = allCastes.filter(
        c => c.masterId === parseInt(religionId)
      );
      setCastes(filteredCastes);
    } else {
      setCastes([]);
    }
  };

  const handleSearch = async (e?: React.FormEvent, page: number = 1) => {
    if (e) e.preventDefault();

    if (!district) return;

    // Validate required fields (only for initial search, not pagination)
    if (page === 1) {
      if (!filters.gender || !filters.age_from || !filters.age_to || !filters.marital_status || !filters.religion || !filters.caste) {
        alert('Please fill all required fields');
        return;
      }
    }

    try {
      setSearching(true);
      if (page === 1) {
        setSearchPerformed(true);
      }

      // Build search params - district is pre-selected
      const searchParams: Record<string, string> = {
        district: district.id.toString(),
        page: page.toString(),
        per_page: '12'
      };

      // Add other filters
      if (filters.gender) searchParams.gender = filters.gender;
      if (filters.age_from) searchParams.age_from = filters.age_from;
      if (filters.age_to) searchParams.age_to = filters.age_to;
      if (filters.marital_status) searchParams.marital_status = filters.marital_status;
      if (filters.religion) searchParams.religion = filters.religion;
      if (filters.caste) searchParams.caste = filters.caste;

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

  if (!state || !district) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-8">The matrimony page you are looking for does not exist.</p>
            <button
              onClick={() => router.push('/matrimony-in')}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Go to Regional Matrimony
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
      <Breadcrumb
        customItems={[
          { label: 'Home', href: '/' },
          { label: 'Matrimony by Region', href: '/matrimony-in' },
          { label: `${state.name} Matrimony`, href: `/matrimony-in/${stateSlug}` },
          { label: `${district.name} Matrimony`, href: `/matrimony-in/${stateSlug}/${districtSlug}` },
        ]}
      />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {district.name} Matrimony
            </h1>
            <p className="text-xl md:text-2xl mb-2">
              Find your perfect life partner from {district.name}, {state.name}
            </p>
            <p className="text-lg opacity-90">
              Thousands of verified {district.name} brides and grooms
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About {district.name} Matrimony
            </h2>
            <div className="prose max-w-none text-gray-600 leading-relaxed">
              <p className="mb-4 text-lg">
                Welcome to {district.name} Matrimony by vivahavedi - your premier platform for finding the perfect life partner from {district.name}, {state.name}. We specialize in connecting {district.name} brides and grooms from all communities, making it easy to find matches who share your hometown, culture, and local traditions.
              </p>
              <p className="mb-4">
                Finding a life partner from your own district offers numerous advantages - easier family meetings, shared understanding of local culture and customs, common social networks, and convenient logistics for wedding arrangements. Our {district.name} matrimony service is designed specifically to help you connect with verified profiles from your hometown across all religions, castes, and communities.
              </p>
              <p className="mb-4">
                Whether you&apos;re from {district.name} and looking for a local match, or you prefer a partner from this vibrant district of {state.name}, vivahavedi provides comprehensive access to verified {district.name} profiles. Our advanced search filters allow you to refine your search by religion, caste, age, education, profession, and many other criteria while keeping the district focus on {district.name}.
              </p>
              <p className="mb-4">
                Every profile from {district.name} on our platform undergoes thorough verification to ensure authenticity and safety. We verify identity documents, contact information, and photos to maintain the highest quality standards. Your privacy is our priority, with complete control over who can view your profile and contact you.
              </p>
              <p className="mb-4">
                Our {district.name} matrimony service has successfully helped hundreds of families find their ideal matches within the district. With new {district.name} profiles added regularly, smart matchmaking recommendations, and dedicated customer support, finding your {district.name} life partner has never been easier.
              </p>
              <p>
                Start your search today using our advanced filters below. Browse {district.name} matrimony profiles by religion, caste, age, education, and more to find matches that truly align with your preferences and family values. Join thousands of successful couples who found their life partner through vivahavedi&apos;s {district.name} matrimony service.
              </p>
            </div>
          </div>
        </section>

        {/* Success Stories Highlight */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-8 border border-red-100">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Success in {district.name} Matchmaking
                </h2>
                <p className="text-lg text-gray-700">
                  Join hundreds of happy {district.name} couples who found their perfect match on vivahavedi
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">500+</div>
                  <p className="text-gray-600">Verified {district.name} Profiles</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">200+</div>
                  <p className="text-gray-600">Successful Matches</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">24/7</div>
                  <p className="text-gray-600">Customer Support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Search {district.name} Profiles
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

                {/* Religion */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Religion <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={filters.religion}
                    onChange={(e) => handleReligionChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Religion</option>
                    {religions.map((religion) => (
                      <option key={religion.id} value={religion.id}>
                        {religion.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Caste */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caste <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={filters.caste}
                    onChange={(e) => setFilters({ ...filters, caste: e.target.value })}
                    disabled={!filters.religion}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">Select Caste</option>
                    {castes.map((caste) => (
                      <option key={caste.id} value={caste.id}>
                        {caste.name}
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
                              alt={`${profile.name} - ${profile.age} years old ${profile.qualification ? profile.qualification + ' ' : ''}${filters.gender === 'female' ? 'Bride' : 'Groom'} from ${district.name}, ${state.name}`}
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
                              <p>{district.name}</p>
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
              Why Choose vivahavedi for {district.name} Matrimony?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center bg-gray-50 p-6 rounded-lg">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">100% Verified</h3>
                <p className="text-gray-600">
                  All {district.name} profiles are manually verified for authenticity
                </p>
              </div>

              <div className="text-center bg-gray-50 p-6 rounded-lg">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Local Matches</h3>
                <p className="text-gray-600">
                  Find matches specifically from {district.name} for easy meetings
                </p>
              </div>

              <div className="text-center bg-gray-50 p-6 rounded-lg">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Search</h3>
                <p className="text-gray-600">
                  Advanced filters to find the most compatible {district.name} matches
                </p>
              </div>

              <div className="text-center bg-gray-50 p-6 rounded-lg">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Privacy</h3>
                <p className="text-gray-600">
                  Your contact details stay private until you decide to share
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection
          title={`Frequently Asked Questions - ${district.name} Matrimony`}
          faqs={[
            {
              question: `How do I find ${district.name} matrimony profiles?`,
              answer: `Use the search form above to browse verified profiles from ${district.name}, ${state.name}. You can filter by gender, age, marital status, religion, and caste to find the most compatible matches.`,
            },
            {
              question: `Are ${district.name} matrimony profiles verified?`,
              answer: `Yes, all profiles from ${district.name} on our platform undergo thorough verification. We verify identity documents, contact details, and photos to ensure authenticity and safety.`,
            },
            {
              question: `Can I search across all religions and castes in ${district.name}?`,
              answer: `Yes, our ${district.name} matrimony service covers all religions and castes. You can search across all communities or filter by specific religion and caste based on your preferences.`,
            },
            {
              question: `Is registration required to view ${district.name} profiles?`,
              answer: `You can browse basic profile information without registration, but creating a free account gives you access to complete profiles, allows you to send interests, and enables direct communication with matches from ${district.name}.`,
            },
          ]}
        />

        {/* User Reviews Section */}
        <UserReviews
          title={`Success Stories from ${district.name}`}
          community={`${district.name} Matrimony`}
          reviews={[
            {
              id: 1,
              name: 'Priya & Rajesh',
              location: `${district.name}, ${state.name}`,
              rating: 5,
              date: '2024-01-15',
              review: `Found our perfect match from ${district.name}! Being from the same district made everything so convenient. Family meetings were easy and we share the same local culture. Thank you vivahavedi!`,
            },
            {
              id: 2,
              name: 'Anjali & Vikram',
              location: `${district.name}, ${state.name}`,
              rating: 5,
              date: '2024-02-20',
              review: `Excellent ${district.name} matrimony service! The district-specific search helped us find someone from our hometown. We are now happily married and grateful to vivahavedi for this wonderful platform.`,
            },
            {
              id: 3,
              name: 'Sneha & Karthik',
              location: `${district.name}, ${state.name}`,
              rating: 5,
              date: '2024-03-10',
              review: `Best platform for finding ${district.name} matches! We connected through this service and our families loved that we are from the same district. The verification process gave us confidence. Highly recommended!`,
            },
          ]}
        />

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-red-600 to-pink-600 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Find Your {district.name} Match?
            </h2>
            <p className="text-xl text-white opacity-90 mb-8">
              Join hundreds of {district.name} members who found their life partner
            </p>
            <button
              onClick={() => router.push('/register')}
              className="bg-white text-red-600 hover:bg-gray-100 px-12 py-4 rounded-lg font-bold text-lg transition-colors duration-200 shadow-lg"
            >
              Register Now - It&apos;s Free!
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
