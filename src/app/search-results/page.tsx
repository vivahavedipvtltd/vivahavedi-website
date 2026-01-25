'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useMasterData } from '@/hooks/useMasterData';
import {
  Search,
  SlidersHorizontal,
  User,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  ArrowLeft,
  Bookmark,
} from 'lucide-react';
import { searchProfiles, getSearchCount, saveSearch, executeSavedSearch, getSavedSearchCount } from '@/lib/searchApi';
import MultiSelectCheckbox from '@/components/MultiSelectCheckbox';

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

  useEffect(() => {
    if (token) {
      loadUserGender();
      loadSearchFromParams();
    }
  }, [token]);

  const loadUserGender = async () => {
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
  };

  const loadSearchFromParams = () => {
    const type = searchParams.get('type') as 'advanced' | 'id' | 'saved' || 'advanced';
    const sort = searchParams.get('sort') as 'featured' | 'new' | 'photo' || 'featured';

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
        executeSavedSearchById(id, 1);
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
      executeAdvancedSearch(parsedFilters, sort, 1);
    }
  };

  const executeAdvancedSearch = async (searchFilters: SearchFilters, sort: 'featured' | 'new' | 'photo', page: number) => {
    if (!token) return;

    setLoading(true);
    try {
      // Get count
      const countResult = await getSearchCount(token, searchFilters);
      if (countResult.status === 'success') {
        setTotalCount(countResult.data);
      }

      // Get results
      const result = await searchProfiles(token, searchFilters, sort, page);
      if (result.status === 'success') {
        setSearchResults(result.data);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeIdSearch = async (id: string) => {
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
  };

  const executeSavedSearchById = async (searchId: number, page: number) => {
    if (!token) return;

    setLoading(true);
    try {
      // Get count first
      const countResult = await getSavedSearchCount(token, searchId);
      if (countResult.status === 'success') {
        setTotalCount(countResult.data);
      }

      // Get results
      const result = await executeSavedSearch(token, searchId, page);
      if (result.status === 'success') {
        setSearchResults(result.data);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Saved search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (searchType === 'saved' && savedSearchId) {
      executeSavedSearchById(savedSearchId, page);
    } else {
      executeAdvancedSearch(filters, sortBy, page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (searchType === 'id') {
      executeIdSearch(searchId);
    } else {
      executeAdvancedSearch(filters, sortBy, 1);
    }
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

  const getFilteredCastes = () => {
    if (!masterData || !filters.religion) return [];
    return masterData.caste.filter((c) => c.masterId === filters.religion);
  };

  const getFilteredStates = () => {
    if (!masterData || !filters.country) return [];
    return masterData.state.filter((s) => s.masterId === filters.country);
  };

  const getFilteredDistricts = () => {
    if (!masterData || !filters.state) return [];
    return masterData.district.filter((d) => d.masterId === filters.state);
  };

  const getFilteredQualifications = () => {
    if (!masterData || !filters.q_level || filters.q_level.length === 0) return [];
    return masterData.qualification.filter((q) =>
      filters.q_level?.includes(q.masterId)
    );
  };

  // Helper function to convert cm to feet and inches
  const cmToFeetInches = (cm: number): string => {
    const inches = cm / 2.54;
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}'${remainingInches}"`;
  };

  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <div className="min-h-screen flex flex-col">
        <Header />

        <div className="flex-grow flex bg-gray-50">
          <DashboardSidebar
            activeSection="search"
            onSectionChange={(section) => {
              // This should never be called as all navigation is handled in DashboardSidebar
              // But if it is, navigate to dashboard
              router.push('/dashboard');
            }}
          />

          <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => router.push('/search')}
                    className="text-gray-600 hover:text-gray-900 flex items-center"
                  >
                    <ArrowLeft className="h-5 w-5 mr-1" />
                    Back to Search
                  </button>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Search className="h-6 w-6 mr-2 text-red-500" />
                    Search Results
                  </h1>
                </div>
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Refine
                </button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar - Refine Filters (Hide for saved searches) */}
              {searchType !== 'saved' && (
              <div className={`lg:col-span-1 ${showMobileFilters ? 'fixed inset-0 z-50 lg:relative' : 'hidden lg:block'}`}>
                <div className={`${showMobileFilters ? 'h-full overflow-y-auto bg-white' : ''}`}>
                  {/* Mobile Filter Header */}
                  {showMobileFilters && (
                    <div className="lg:hidden sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
                      <h2 className="text-xl font-bold text-gray-900">Refine Search</h2>
                      <button
                        onClick={() => setShowMobileFilters(false)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  )}

                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4 bg-red-50 border-b border-red-100">
                      <h2 className="text-lg font-bold text-gray-900 flex items-center">
                        <SlidersHorizontal className="h-5 w-5 mr-2 text-red-600" />
                        Refine Your Search
                      </h2>
                    </div>

                    {searchType === 'advanced' && masterData && (
                      <div className="p-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
                        {/* Age Range */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Age Range
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <select
                              value={filters.age_from || ''}
                              onChange={(e) =>
                                handleFilterChange('age_from', parseInt(e.target.value) || undefined)
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              <option value="">From</option>
                              {Array.from({ length: 53 }, (_, i) => i + 18).map((age) => (
                                <option key={age} value={age}>
                                  {age}
                                </option>
                              ))}
                            </select>
                            <select
                              value={filters.age_to || ''}
                              onChange={(e) =>
                                handleFilterChange('age_to', parseInt(e.target.value) || undefined)
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              <option value="">To</option>
                              {Array.from({ length: 53 }, (_, i) => i + 18).map((age) => (
                                <option key={age} value={age}>
                                  {age}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Height Range */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Height (ft)
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <select
                              value={filters.height_from || ''}
                              onChange={(e) =>
                                handleFilterChange('height_from', e.target.value)
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              <option value="">From</option>
                              {Array.from({ length: 71 }, (_, i) => i + 140).map((height) => (
                                <option key={height} value={height}>
                                  {height} cm ({cmToFeetInches(height)})
                                </option>
                              ))}
                            </select>
                            <select
                              value={filters.height_to || ''}
                              onChange={(e) =>
                                handleFilterChange('height_to', e.target.value)
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              <option value="">To</option>
                              {Array.from({ length: 71 }, (_, i) => i + 140).map((height) => (
                                <option key={height} value={height}>
                                  {height} cm ({cmToFeetInches(height)})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Religion */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Religion
                          </label>
                          <select
                            value={filters.religion || ''}
                            onChange={(e) =>
                              handleFilterChange('religion', parseInt(e.target.value) || undefined)
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          >
                            <option value="">All Religions</option>
                            {masterData.religion.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Caste */}
                        {filters.religion && (
                          <MultiSelectCheckbox
                            label="Caste"
                            options={getFilteredCastes()}
                            selectedValues={filters.caste || []}
                            onChange={(values) => handleFilterChange('caste', values as number[])}
                            placeholder="Select castes"
                          />
                        )}

                        {/* Country */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                          </label>
                          <select
                            value={filters.country || ''}
                            onChange={(e) =>
                              handleFilterChange('country', parseInt(e.target.value) || undefined)
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          >
                            <option value="">All Countries</option>
                            {masterData.country.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* State */}
                        {filters.country && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State
                            </label>
                            <select
                              value={filters.state || ''}
                              onChange={(e) =>
                                handleFilterChange('state', parseInt(e.target.value) || undefined)
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              <option value="">All States</option>
                              {getFilteredStates().map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* District */}
                        {filters.state && (
                          <MultiSelectCheckbox
                            label="District"
                            options={getFilteredDistricts()}
                            selectedValues={filters.district || []}
                            onChange={(values) => handleFilterChange('district', values as number[])}
                            placeholder="Select districts"
                          />
                        )}

                        {/* Marital Status */}
                        <MultiSelectCheckbox
                          label="Marital Status"
                          options={masterData.marital_status?.map(ms => ({ id: ms.name.toLowerCase(), name: ms.name })) || []}
                          selectedValues={filters.marital_status || []}
                          onChange={(values) => handleFilterChange('marital_status', values as string[])}
                          placeholder="Select marital status"
                        />

                        {/* Nakshatra */}
                        <MultiSelectCheckbox
                          label="Nakshatra"
                          options={masterData.nakshathra || []}
                          selectedValues={filters.nakshatra || []}
                          onChange={(values) => handleFilterChange('nakshatra', values as number[])}
                          placeholder="Select nakshatras"
                        />

                        {/* Manglik */}
                        <MultiSelectCheckbox
                          label="Manglik"
                          options={masterData.manglik?.map(m => ({ id: m.name.toLowerCase(), name: m.name })) || []}
                          selectedValues={filters.manglik || []}
                          onChange={(values) => handleFilterChange('manglik', values as string[])}
                          placeholder="Select manglik status"
                        />

                        {/* Qualification Level */}
                        <MultiSelectCheckbox
                          label="Qualification Level"
                          options={masterData.qualification_level || []}
                          selectedValues={filters.q_level || []}
                          onChange={(values) => handleFilterChange('q_level', values as number[])}
                          placeholder="Select qualification levels"
                        />

                        {/* Qualification */}
                        {filters.q_level && filters.q_level.length > 0 && (
                          <MultiSelectCheckbox
                            label="Qualification"
                            options={getFilteredQualifications()}
                            selectedValues={filters.qualification || []}
                            onChange={(values) => handleFilterChange('qualification', values as number[])}
                            placeholder="Select qualifications"
                          />
                        )}

                        {/* Specialization */}
                        <MultiSelectCheckbox
                          label="Specialization"
                          options={masterData.specialization || []}
                          selectedValues={filters.specialization || []}
                          onChange={(values) => handleFilterChange('specialization', values as number[])}
                          placeholder="Select specializations"
                        />

                        {/* Profession */}
                        <MultiSelectCheckbox
                          label="Profession"
                          options={masterData.profession || []}
                          selectedValues={filters.profession || []}
                          onChange={(values) => handleFilterChange('profession', values as number[])}
                          placeholder="Select professions"
                        />

                        {/* Working In */}
                        <MultiSelectCheckbox
                          label="Working In"
                          options={[
                            { id: 'private', name: 'Private' },
                            { id: 'government', name: 'Government' },
                            { id: 'business', name: 'Business' },
                            { id: 'defence', name: 'Defence' }
                          ]}
                          selectedValues={filters.workedin || []}
                          onChange={(values) => handleFilterChange('workedin', values as string[])}
                          placeholder="Select work sectors"
                        />

                        {/* Physical Status */}
                        <MultiSelectCheckbox
                          label="Physical Status"
                          options={masterData.physical_status?.map(ps => ({ id: ps.name.toLowerCase(), name: ps.name })) || []}
                          selectedValues={filters.physicalstatus || []}
                          onChange={(values) => handleFilterChange('physicalstatus', values as string[])}
                          placeholder="Select physical status"
                        />

                        {/* Sort By */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sort By
                          </label>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'featured' | 'new' | 'photo')}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          >
                            <option value="featured">Featured Profiles</option>
                            <option value="new">Newest First</option>
                            <option value="photo">With Photos</option>
                          </select>
                        </div>

                        {/* Apply Filters Button */}
                        <button
                          onClick={handleRefineSearch}
                          disabled={loading}
                          className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                              Searching...
                            </>
                          ) : (
                            <>
                              <Search className="h-5 w-5 mr-2" />
                              Apply Filters
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {searchType === 'id' && (
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile ID
                          </label>
                          <input
                            type="text"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            placeholder="Enter Profile ID"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <button
                          onClick={handleRefineSearch}
                          disabled={loading || !searchId}
                          className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                              Searching...
                            </>
                          ) : (
                            <>
                              <Search className="h-5 w-5 mr-2" />
                              Search by ID
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              )}

              {/* Right Side - Search Results */}
              <div className={searchType === 'saved' ? 'lg:col-span-4' : 'lg:col-span-3'}>
                {/* Search Count Banner */}
                {totalCount > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-gray-900">
                        {searchType === 'saved' ? 'Saved Search Results: ' : 'Total Results: '}
                        <span className="text-red-600">{totalCount}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-600">
                          Page {currentPage} of {totalPages || 1}
                        </div>
                        {searchType === 'advanced' && (
                          <button
                            onClick={() => setShowSaveModal(true)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                          >
                            <Bookmark className="h-4 w-4 mr-2" />
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
                        <div
                          key={profile.id}
                          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                          onClick={() => router.push(`/profile/${profile.id}`)}
                        >
                          <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                            <img
                              src={profile.photo}
                              alt={profile.name}
                              className="w-full h-[22rem] object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              {profile.name}
                            </h3>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>
                                <span className="font-medium">Age:</span> {profile.age} years
                              </p>
                              <p>
                                <span className="font-medium">Height:</span> {profile.height}
                              </p>
                              <p>
                                <span className="font-medium">Status:</span>{' '}
                                {profile.marital_status}
                              </p>
                              <p>
                                <span className="font-medium">Religion:</span> {profile.religion}
                              </p>
                              <p>
                                <span className="font-medium">Caste:</span> {profile.caste}
                              </p>
                              <p>
                                <span className="font-medium">Location:</span> {profile.district}
                              </p>
                              <p>
                                <span className="font-medium">Education:</span>{' '}
                                {profile.qualification}
                              </p>
                            </div>
                            <button className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
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

        <Footer />

        {/* Save Search Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Bookmark className="h-5 w-5 mr-2 text-red-500" />
                  Save This Search
                </h3>
                <button
                  onClick={() => {
                    setShowSaveModal(false);
                    setSearchName('');
                    setSaveMessage(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Save your current search filters to quickly access them later from your dashboard.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Name
                </label>
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="e.g., Young Professionals in Mumbai"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  maxLength={50}
                  disabled={saving}
                />
              </div>

              {saveMessage && (
                <div
                  className={`mb-4 p-3 rounded-lg ${
                    saveMessage.type === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {saveMessage.text}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSaveModal(false);
                    setSearchName('');
                    setSaveMessage(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSearch}
                  disabled={saving || !searchName.trim()}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-5 w-5 mr-2" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export default function SearchResultsPageWrapper() {
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
      <SearchResultsPage />
    </Suspense>
  );
}
