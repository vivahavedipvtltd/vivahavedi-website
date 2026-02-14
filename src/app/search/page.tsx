'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useMasterData } from '@/hooks/useMasterData';
import {
  Search,
  SlidersHorizontal,
  User,
  Loader2,
} from 'lucide-react';
import { getSearchCount } from '@/lib/searchApi';
import MultiSelectCheckbox from '@/components/MultiSelectCheckbox';

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

const SearchPage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const { data: masterDataResponse } = useMasterData();
  const masterData = masterDataResponse?.data;

  const [activeTab, setActiveTab] = useState<'advanced' | 'id'>('advanced');
  const [loading, setLoading] = useState(false);
  const [searchCount, setSearchCount] = useState<number | null>(null);

  // Advanced Search Filters
  const [filters, setFilters] = useState<SearchFilters>({});

  // ID Search
  const [searchId, setSearchId] = useState('');

  // Sort option
  const [sortBy, setSortBy] = useState<'featured' | 'new' | 'photo'>('featured');

  // Helper function to convert cm to feet and inches
  const cmToFeetInches = (cm: number): string => {
    const inches = cm / 2.54;
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}'${remainingInches}"`;
  };

  const handleGetSearchCount = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const countResult = await getSearchCount(token, filters);
      if (countResult.status === 'success') {
        setSearchCount(countResult.data);
      }
    } catch (error) {
      console.error('Get count failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvancedSearch = () => {
    if (!token) {
      console.error('No token available');
      return;
    }

    // Build URL with query parameters
    const params = new URLSearchParams();
    params.append('type', 'advanced');
    params.append('sort', sortBy);

    if (filters.age_from) params.append('age_from', filters.age_from.toString());
    if (filters.age_to) params.append('age_to', filters.age_to.toString());
    if (filters.height_from) params.append('height_from', filters.height_from);
    if (filters.height_to) params.append('height_to', filters.height_to);
    if (filters.religion) params.append('religion', filters.religion.toString());
    if (filters.country) params.append('country', filters.country.toString());
    if (filters.state) params.append('state', filters.state.toString());
    if (filters.caste && filters.caste.length > 0) {
      params.append('caste', filters.caste.join(','));
    }
    if (filters.district && filters.district.length > 0) {
      params.append('district', filters.district.join(','));
    }
    if (filters.marital_status && filters.marital_status.length > 0) {
      params.append('marital_status', filters.marital_status.join(','));
    }
    if (filters.nakshatra && filters.nakshatra.length > 0) {
      params.append('nakshatra', filters.nakshatra.join(','));
    }
    if (filters.manglik && filters.manglik.length > 0) {
      params.append('manglik', filters.manglik.join(','));
    }
    if (filters.q_level && filters.q_level.length > 0) {
      params.append('q_level', filters.q_level.join(','));
    }
    if (filters.qualification && filters.qualification.length > 0) {
      params.append('qualification', filters.qualification.join(','));
    }
    if (filters.specialization && filters.specialization.length > 0) {
      params.append('specialization', filters.specialization.join(','));
    }
    if (filters.profession && filters.profession.length > 0) {
      params.append('profession', filters.profession.join(','));
    }
    if (filters.workedin && filters.workedin.length > 0) {
      params.append('workedin', filters.workedin.join(','));
    }
    if (filters.physicalstatus && filters.physicalstatus.length > 0) {
      params.append('physicalstatus', filters.physicalstatus.join(','));
    }

    const url = `/search-results?${params.toString()}`;
    console.log('Navigating to:', url);

    // Navigate to results page with params
    router.push(url);
  };

  const handleIdSearch = () => {
    if (!token || !searchId) {
      console.error('No token or search ID');
      return;
    }

    const url = `/search-results?type=id&id=${searchId}`;
    console.log('Navigating to:', url);

    // Navigate to results page with ID
    router.push(url);
  };

  const handleFilterChange = (key: string, value: string | number | string[] | number[] | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setSearchCount(null); // Reset count when filters change
  };

  const clearFilters = () => {
    setFilters({});
    setSearchCount(null);
  };

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
    return masterData.qualification.filter((q) => filters.q_level?.includes(q.masterId));
  };

  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <div className="h-screen flex flex-col">
        <Header />

        <div className="flex-1 flex bg-gray-50 overflow-hidden">
          <DashboardSidebar
            activeSection="search"
            onSectionChange={(section) => {
              if (section !== 'search') {
                router.push('/dashboard');
              }
            }}
          />

          <main className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                  <Search className="h-8 w-8 mr-3 text-red-500" />
                  Search Profiles
                </h1>
                <p className="text-gray-600 mt-2">
                  Find your perfect match using advanced search or ID search
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('advanced')}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                      activeTab === 'advanced'
                        ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <SlidersHorizontal className="h-5 w-5 inline-block mr-2" />
                    Advanced Search
                  </button>
                  <button
                    onClick={() => setActiveTab('id')}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                      activeTab === 'id'
                        ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <User className="h-5 w-5 inline-block mr-2" />
                    ID Search
                  </button>
                </div>
              </div>

              {/* Advanced Search Form */}
              {activeTab === 'advanced' && masterData && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Search Filters
                    </h2>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-red-600 hover:text-red-700 font-medium px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={handleGetSearchCount}
                      disabled={loading}
                      className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Get Search Count'
                      )}
                    </button>

                    <button
                      onClick={handleAdvancedSearch}
                      disabled={loading}
                      className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Search className="h-5 w-5 mr-2" />
                      Search Profiles
                    </button>
                  </div>

                  {/* Display Count */}
                  {searchCount !== null && (
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                      <p className="text-blue-900">
                        Found <span className="font-bold text-2xl">{searchCount}</span> matching profiles
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ID Search Form */}
              {activeTab === 'id' && (
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                    Search by Profile ID
                  </h2>
                  <div className="max-w-md mx-auto space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile ID
                      </label>
                      <input
                        type="text"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="Enter Profile ID (e.g., 237947)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handleIdSearch}
                      disabled={loading || !searchId}
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Search className="h-5 w-5 mr-2" />
                      Search by ID
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <SlidersHorizontal className="h-5 w-5 mr-2 text-red-600" />
                    Advanced Search
                  </h4>
                  <p className="text-sm text-gray-600">
                    Use multiple filters like age, height, religion, location, and more to find compatible matches. Select your preferences and click &quot;Search Profiles&quot; to view results.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    ID Search
                  </h4>
                  <p className="text-sm text-gray-600">
                    Already know a profile ID? Use ID search to quickly find a specific profile. Enter the ID and search directly.
                  </p>
                </div>
              </div>
            </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};

export default SearchPage;
