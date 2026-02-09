'use client';

import { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useMasterData } from '@/hooks/useMasterData';
import ProfileCard from '@/components/search-results/ProfileCard';
import FilterSidebar from '@/components/search-results/FilterSidebar';
import SaveSearchModal from '@/components/search-results/SaveSearchModal';
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowLeft,
  Bookmark,
} from 'lucide-react';
import { searchProfiles, getSearchCount, saveSearch, executeSavedSearch, getSavedSearchCount } from '@/lib/searchApi';

interface MasterData {
  religion: Array<{ id: number; name: string }>;
  caste: Array<{ id: number; name: string; masterId: number }>;
  country: Array<{ id: number; name: string }>;
  state: Array<{ id: number; name: string; masterId: number }>;
  district: Array<{ id: number; name: string; masterId: number }>;
  nakshathra: Array<{ id: number; name: string }>;
  qualification: Array<{ id: number; name: string; masterId: number }>;
  qualification_level: Array<{ id: number; name: string }>;
  specialization: Array<{ id: number; name: string }>;
  profession: Array<{ id: number; name: string }>;
  marital_status: Array<{ id: number; name: string }>;
  body_type: Array<{ id: number; name: string }>;
  complexion: Array<{ id: number; name: string }>;
  physical_status: Array<{ id: number; name: string }>;
  manglik: Array<{ id: number; name: string }>;
}

interface SearchFilters {
  age_from?: number;
  age_to?: number;
  height_from?: string;
  height_to?: string;
  religion?: number;
  country?: number;
  state?: number;
  marital_status?: string[];
  caste?: number[];
  nakshatra?: number[];
  district?: number[];
  qualification?: number[];
  q_level?: number[];
  specialization?: number[];
  profession?: number[];
  workedin?: string[];
  manglik?: string[];
  physicalstatus?: string[];
}

interface ProfileResult {
  id: number;
  user_id: number;
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Constants for dropdown options (defined outside component to avoid recreation on every render)
const AGE_OPTIONS = Array.from({ length: 53 }, (_, i) => i + 18); // 18-70 years
const HEIGHT_OPTIONS = Array.from({ length: 71 }, (_, i) => i + 140); // 140-210 cm

// Helper function to convert cm to feet and inches
const cmToFeetInches = (cm: number): string => {
  const inches = cm / 2.54;
  const feet = Math.floor(inches / 12);
  const remainingInches = Math.round(inches % 12);
  return `${feet}'${remainingInches}"`;
};

const SearchResultsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const { data: masterDataResponse, isLoading: masterLoading } = useMasterData();
  const masterData = masterDataResponse?.data;

  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ProfileResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get search params from URL
  const [searchType, setSearchType] = useState<'advanced' | 'id' | 'saved'>('advanced');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchId, setSearchId] = useState('');
  const [savedSearchId, setSavedSearchId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'new' | 'photo'>('featured');
  const [userGender, setUserGender] = useState<string>('');

  // Save search modal states
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Memoized function to execute advanced search
  const executeAdvancedSearch = useCallback(async (searchFilters: SearchFilters, sort: 'featured' | 'new' | 'photo', page: number) => {
    if (!token) return;

    setLoading(true);
    try {
      // Execute count and search in parallel for better performance
      const [countResult, result] = await Promise.all([
        getSearchCount(token, searchFilters),
        searchProfiles(token, searchFilters, sort, page)
      ]);

      // Update state with results
      if (countResult.status === 'success') {
        setTotalCount(countResult.data);
      }

      if (result.status === 'success') {
        setSearchResults(result.data);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Memoized function to execute ID search
  const executeIdSearch = useCallback(async (id: string) => {
    if (!token || !id) return;

    setLoading(true);
    try {
      const result = await searchProfiles(
        token,
        { user_id: id },
        'featured',
        1,
        'id_search'
      );
      if (result.status === 'success') {
        setSearchResults(result.data);
        setTotalCount(result.data.length);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('ID search failed:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Memoized function to execute saved search
  const executeSavedSearchById = useCallback(async (searchId: number, page: number) => {
    if (!token) return;

    setLoading(true);
    try {
      // Execute count and search in parallel for better performance
      const [countResult, result] = await Promise.all([
        getSavedSearchCount(token, searchId),
        executeSavedSearch(token, searchId, page)
      ]);

      // Update state with results
      if (countResult.status === 'success') {
        setTotalCount(countResult.data);
      }

      if (result.status === 'success') {
        setSearchResults(result.data);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Saved search failed:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Memoized function to load user gender
  const loadUserGender = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/my-details`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success' && result.data?.basic?.user_gender) {
          setUserGender(result.data.basic.user_gender.toLowerCase());
        }
      }
    } catch (error) {
      console.error('Failed to load user gender:', error);
    }
  }, [token]);

  // Memoized function to load search parameters from URL
  const loadSearchFromParams = useCallback(() => {
    const type = searchParams.get('type') as 'advanced' | 'id' | 'saved' || 'advanced';
    const sort = searchParams.get('sort') as 'featured' | 'new' | 'photo' || 'featured';
    const pageParam = searchParams.get('page');
    const page = pageParam ? parseInt(pageParam) : 1;

    setSearchType(type);
    setSortBy(sort);

    if (type === 'id') {
      const id = searchParams.get('id') || '';
      setSearchId(id);
      if (id) {
        executeIdSearch(id);
      }
    } else if (type === 'saved') {
      const savedId = searchParams.get('id');
      if (savedId) {
        const id = parseInt(savedId);
        setSavedSearchId(id);
        executeSavedSearchById(id, page);
      }
    } else {
      // Parse advanced search filters from URL
      const parsedFilters: SearchFilters = {};

      const ageFrom = searchParams.get('age_from');
      const ageTo = searchParams.get('age_to');
      if (ageFrom) parsedFilters.age_from = parseInt(ageFrom);
      if (ageTo) parsedFilters.age_to = parseInt(ageTo);

      const heightFrom = searchParams.get('height_from');
      const heightTo = searchParams.get('height_to');
      if (heightFrom) parsedFilters.height_from = heightFrom;
      if (heightTo) parsedFilters.height_to = heightTo;

      const religion = searchParams.get('religion');
      if (religion) parsedFilters.religion = parseInt(religion);

      const country = searchParams.get('country');
      if (country) parsedFilters.country = parseInt(country);

      const state = searchParams.get('state');
      if (state) parsedFilters.state = parseInt(state);

      const caste = searchParams.get('caste');
      if (caste) parsedFilters.caste = caste.split(',').map(Number);

      const district = searchParams.get('district');
      if (district) parsedFilters.district = district.split(',').map(Number);

      const maritalStatus = searchParams.get('marital_status');
      if (maritalStatus) parsedFilters.marital_status = maritalStatus.split(',');

      const nakshatra = searchParams.get('nakshatra');
      if (nakshatra) parsedFilters.nakshatra = nakshatra.split(',').map(Number);

      const manglik = searchParams.get('manglik');
      if (manglik) parsedFilters.manglik = manglik.split(',');

      const qLevel = searchParams.get('q_level');
      if (qLevel) parsedFilters.q_level = qLevel.split(',').map(Number);

      const qualification = searchParams.get('qualification');
      if (qualification) parsedFilters.qualification = qualification.split(',').map(Number);

      const specialization = searchParams.get('specialization');
      if (specialization) parsedFilters.specialization = specialization.split(',').map(Number);

      const profession = searchParams.get('profession');
      if (profession) parsedFilters.profession = profession.split(',').map(Number);

      const workedin = searchParams.get('workedin');
      if (workedin) parsedFilters.workedin = workedin.split(',');

      const physicalstatus = searchParams.get('physicalstatus');
      if (physicalstatus) parsedFilters.physicalstatus = physicalstatus.split(',');

      setFilters(parsedFilters);
      executeAdvancedSearch(parsedFilters, sort, page);
    }
  }, [searchParams, executeIdSearch, executeSavedSearchById, executeAdvancedSearch]);

  // Effect to load data when token or search params change
  useEffect(() => {
    if (token) {
      loadUserGender();
      loadSearchFromParams();
    }
  }, [token, loadUserGender, loadSearchFromParams]);

  const handlePageChange = (page: number) => {
    // Update URL with the new page number while preserving all params
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/search-results?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (key: string, value: string | number | string[] | number[] | undefined) => {
    const newFilters = { ...filters };
    if (value === undefined) {
      delete newFilters[key as keyof SearchFilters];
    } else {
      newFilters[key as keyof SearchFilters] = value as never;
    }
    setFilters(newFilters);
  };

  const handleRefineSearch = () => {
    // Build URL params with all current filter values
    const params = new URLSearchParams();
    params.set('type', searchType);
    params.set('sort', sortBy);
    params.set('page', '1');

    if (searchType === 'id') {
      if (searchId) {
        params.set('id', searchId);
      }
    } else {
      // Add all filter values to URL
      if (filters.age_from) params.set('age_from', filters.age_from.toString());
      if (filters.age_to) params.set('age_to', filters.age_to.toString());
      if (filters.height_from) params.set('height_from', filters.height_from);
      if (filters.height_to) params.set('height_to', filters.height_to);
      if (filters.religion) params.set('religion', filters.religion.toString());
      if (filters.country) params.set('country', filters.country.toString());
      if (filters.state) params.set('state', filters.state.toString());
      if (filters.caste && filters.caste.length > 0) params.set('caste', filters.caste.join(','));
      if (filters.district && filters.district.length > 0) params.set('district', filters.district.join(','));
      if (filters.marital_status && filters.marital_status.length > 0) params.set('marital_status', filters.marital_status.join(','));
      if (filters.nakshatra && filters.nakshatra.length > 0) params.set('nakshatra', filters.nakshatra.join(','));
      if (filters.manglik && filters.manglik.length > 0) params.set('manglik', filters.manglik.join(','));
      if (filters.q_level && filters.q_level.length > 0) params.set('q_level', filters.q_level.join(','));
      if (filters.qualification && filters.qualification.length > 0) params.set('qualification', filters.qualification.join(','));
      if (filters.specialization && filters.specialization.length > 0) params.set('specialization', filters.specialization.join(','));
      if (filters.profession && filters.profession.length > 0) params.set('profession', filters.profession.join(','));
      if (filters.workedin && filters.workedin.length > 0) params.set('workedin', filters.workedin.join(','));
      if (filters.physicalstatus && filters.physicalstatus.length > 0) params.set('physicalstatus', filters.physicalstatus.join(','));
    }

    // Update URL - this will trigger the useEffect which will execute the search
    router.push(`/search-results?${params.toString()}`, { scroll: false });
    setShowMobileFilters(false);
  };

  const handleSaveSearch = async () => {
    if (!token || !searchName.trim()) {
      setSaveMessage({ type: 'error', text: 'Please enter a search name' });
      return;
    }

    if (!userGender) {
      setSaveMessage({ type: 'error', text: 'User gender not available. Please try again.' });
      return;
    }

    setSaving(true);
    setSaveMessage(null);

    try {
      // Include gender in filters as required by the API
      const filtersWithGender = {
        ...filters,
        gender: userGender,
      };

      const result = await saveSearch(token, searchName.trim(), filtersWithGender, sortBy);
      if (result.status === 'success') {
        setSaveMessage({ type: 'success', text: result.message });
        setTimeout(() => {
          setShowSaveModal(false);
          setSearchName('');
          setSaveMessage(null);
        }, 2000);
      } else {
        setSaveMessage({ type: 'error', text: result.message || 'Failed to save search' });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save search. Please try again.';
      setSaveMessage({ type: 'error', text: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.ceil(totalCount / 6);

  // Memoized filtered castes based on selected religion
  const filteredCastes = useMemo(() => {
    if (!masterData || !filters.religion) return [];
    return masterData.caste.filter((c) => c.masterId === filters.religion);
  }, [masterData, filters.religion]);

  // Memoized filtered states based on selected country
  const filteredStates = useMemo(() => {
    if (!masterData || !filters.country) return [];
    return masterData.state.filter((s) => s.masterId === filters.country);
  }, [masterData, filters.country]);

  // Memoized filtered districts based on selected state
  const filteredDistricts = useMemo(() => {
    if (!masterData || !filters.state) return [];
    return masterData.district.filter((d) => d.masterId === filters.state);
  }, [masterData, filters.state]);

  // Memoized filtered qualifications based on selected qualification levels
  const filteredQualifications = useMemo(() => {
    if (!masterData || !filters.q_level || filters.q_level.length === 0) return [];
    return masterData.qualification.filter((q) =>
      filters.q_level?.includes(q.masterId)
    );
  }, [masterData, filters.q_level]);

  // Memoized transformed marital status options
  const maritalStatusOptions = useMemo(() => {
    if (!masterData?.marital_status) return [];
    return masterData.marital_status.map(ms => ({
      id: ms.name.toLowerCase(),
      name: ms.name
    }));
  }, [masterData?.marital_status]);

  // Memoized transformed manglik options
  const manglikOptions = useMemo(() => {
    if (!masterData?.manglik) return [];
    return masterData.manglik.map(m => ({
      id: m.name.toLowerCase(),
      name: m.name
    }));
  }, [masterData?.manglik]);

  // Memoized transformed physical status options
  const physicalStatusOptions = useMemo(() => {
    if (!masterData?.physical_status) return [];
    return masterData.physical_status.map(ps => ({
      id: ps.name.toLowerCase(),
      name: ps.name
    }));
  }, [masterData?.physical_status]);

  // Memoized working sector options (static data)
  const workingSectorOptions = useMemo(() => [
    { id: 'private', name: 'Private' },
    { id: 'government', name: 'Government' },
    { id: 'business', name: 'Business' },
    { id: 'defence', name: 'Defence' }
  ], []);

  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <div className="h-screen flex flex-col">
        <Header />

        <div className="flex-1 flex bg-gray-50 overflow-hidden">
          <DashboardSidebar
            activeSection="search"
            onSectionChange={(section) => {
              // This should never be called as all navigation is handled in DashboardSidebar
              // But if it is, navigate to dashboard
              router.push('/dashboard');
            }}
          />

          <main className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-2 md:space-x-4 flex-wrap">
                  <button
                    onClick={() => router.push('/search')}
                    className="text-gray-600 hover:text-gray-900 flex items-center text-sm md:text-base whitespace-nowrap"
                  >
                    <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                    Back to Search
                  </button>
                  <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
                  <h1 className="text-lg md:text-2xl font-bold text-gray-900 flex items-center">
                    <Search className="h-5 w-5 md:h-6 md:w-6 mr-2 text-red-500" />
                    Search Results
                  </h1>
                </div>
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden bg-red-500 hover:bg-red-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg flex items-center text-sm md:text-base whitespace-nowrap"
                >
                  <Filter className="h-4 w-4 md:h-5 md:w-5 mr-1.5" />
                  Refine
                </button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar - Refine Filters (Hide for saved searches) */}
              {searchType !== 'saved' && (
                <FilterSidebar
                  searchType={searchType}
                  searchId={searchId}
                  filters={filters}
                  loading={loading}
                  showMobileFilters={showMobileFilters}
                  masterData={masterData}
                  filteredCastes={filteredCastes}
                  filteredStates={filteredStates}
                  filteredDistricts={filteredDistricts}
                  filteredQualifications={filteredQualifications}
                  maritalStatusOptions={maritalStatusOptions}
                  manglikOptions={manglikOptions}
                  physicalStatusOptions={physicalStatusOptions}
                  workingSectorOptions={workingSectorOptions}
                  sortBy={sortBy}
                  ageOptions={AGE_OPTIONS}
                  heightOptions={HEIGHT_OPTIONS}
                  onCloseMobileFilters={() => setShowMobileFilters(false)}
                  onFilterChange={handleFilterChange}
                  onSortChange={setSortBy}
                  onSearchIdChange={setSearchId}
                  onRefineSearch={handleRefineSearch}
                  cmToFeetInches={cmToFeetInches}
                />
              )}

              {/* Right Side - Search Results */}
              <div className={searchType === 'saved' ? 'lg:col-span-4' : 'lg:col-span-3'}>
                {/* Search Count Banner */}
                {totalCount > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="text-base md:text-lg font-semibold text-gray-900">
                        {searchType === 'saved' ? 'Saved Search Results: ' : 'Total Results: '}
                        <span className="text-red-600">{totalCount}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <div className="text-xs md:text-sm text-gray-600">
                          Page {currentPage} of {totalPages || 1}
                        </div>
                        {searchType === 'advanced' && (
                          <button
                            onClick={() => setShowSaveModal(true)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg flex items-center transition-colors duration-200 text-sm md:text-base whitespace-nowrap w-full sm:w-auto justify-center"
                          >
                            <Bookmark className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                            Save Search
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <Loader2 className="h-16 w-16 text-red-500 animate-spin mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Searching...
                    </h3>
                    <p className="text-gray-600">
                      Please wait while we find matching profiles
                    </p>
                  </div>
                )}

                {/* Search Results Grid */}
                {!loading && searchResults.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                      {searchResults.map((profile) => (
                        <ProfileCard key={profile.id} profile={profile} />
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No Results Found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search filters to find more profiles
                    </p>
                    <button
                      onClick={() => router.push('/search')}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      Back to Search
                    </button>
                  </div>
                )}
              </div>
            </div>
            </div>
          </main>
        </div>

        {/* Save Search Modal */}
        <SaveSearchModal
          isOpen={showSaveModal}
          searchName={searchName}
          saving={saving}
          saveMessage={saveMessage}
          onClose={() => {
            setShowSaveModal(false);
            setSearchName('');
            setSaveMessage(null);
          }}
          onSearchNameChange={setSearchName}
          onSave={handleSaveSearch}
        />
      </div>
    </AuthGuard>
  );
};

export default function SearchResultsPageWrapper() {
  return (
    <Suspense fallback={
      <div className="h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <Loader2 className="h-12 w-12 animate-spin text-red-500" />
        </main>
      </div>
    }>
      <SearchResultsPage />
    </Suspense>
  );
}
