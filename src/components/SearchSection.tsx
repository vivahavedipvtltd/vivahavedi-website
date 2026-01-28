'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useMasterData } from '@/hooks/useMasterData';

const SearchSection = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { data: masterDataResponse, isLoading: loading } = useMasterData();
  const masterData = masterDataResponse?.data ? {
    religion: masterDataResponse.data.religion,
    caste: masterDataResponse.data.caste,
    marital_status: masterDataResponse.data.marital_status,
    state: masterDataResponse.data.state,
    district: masterDataResponse.data.district
  } : null;

  const [searchData, setSearchData] = useState({
    gender: 'bride',
    ageFrom: '21',
    ageTo: '30',
    heightFrom: '150',
    heightTo: '180',
    religion: '',
    caste: '',
    marital_status: '',
    state: '',
    district: ''
  });

  interface District {
    id: number;
    name: string;
    masterId: number;
  }

  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);

  // Helper function to convert cm to feet and inches
  const cmToFeetInches = (cm: number): string => {
    const inches = cm / 2.54;
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}'${remainingInches}"`;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));

    // Reset caste when religion changes
    if (field === 'religion') {
      setSearchData(prev => ({ ...prev, caste: '' }));
    }

    // Reset district when state changes and filter districts
    if (field === 'state') {
      setSearchData(prev => ({ ...prev, district: '' }));
      if (value && masterData?.district) {
        const filtered = masterData.district.filter(
          (d: District) => d.masterId === parseInt(value)
        );
        setFilteredDistricts(filtered);
      } else {
        setFilteredDistricts([]);
      }
    }
  };

  const handleSearch = () => {
    // Validate all required fields are filled
    if (!searchData.religion || !searchData.caste || !searchData.marital_status || !searchData.state || !searchData.district) {
      alert('Please fill all required fields');
      return;
    }

    // Build query parameters for API 24 - Public Search
    const params = new URLSearchParams();

    // Map gender: bride -> female, groom -> male (API requirement)
    const gender = searchData.gender === 'bride' ? 'female' : 'male';
    params.append('gender', gender);

    // Add all search parameters
    if (searchData.ageFrom) params.append('age_from', searchData.ageFrom);
    if (searchData.ageTo) params.append('age_to', searchData.ageTo);
    if (searchData.heightFrom) params.append('height_from', searchData.heightFrom);
    if (searchData.heightTo) params.append('height_to', searchData.heightTo);
    if (searchData.religion) params.append('religion', searchData.religion);
    if (searchData.caste) params.append('caste', searchData.caste);
    if (searchData.marital_status) params.append('marital_status', searchData.marital_status);
    if (searchData.state) params.append('state', searchData.state);
    if (searchData.district) params.append('district', searchData.district);

    // Navigate to public search results page
    router.push(`/public-search-results?${params.toString()}`);
  };

  const getFilteredCastes = () => {
    if (!masterData || !searchData.religion) return [];
    return masterData.caste.filter(c => c.masterId === parseInt(searchData.religion));
  };

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Match
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search through thousands of verified profiles to find your ideal life partner
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Looking For - Gender */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                I&apos;m Looking For
              </label>
              <div className="flex bg-white rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => handleInputChange('gender', 'bride')}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 ${
                    searchData.gender === 'bride'
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Bride
                </button>
                <button
                  onClick={() => handleInputChange('gender', 'groom')}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 ${
                    searchData.gender === 'groom'
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Groom
                </button>
              </div>
            </div>

            {/* Age Range */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Age Range
              </label>
              <div className="flex space-x-2">
                <select
                  value={searchData.ageFrom}
                  onChange={(e) => handleInputChange('ageFrom', e.target.value)}
                  className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                >
                  {Array.from({ length: 53 }, (_, i) => i + 18).map((age) => (
                    <option key={age} value={age}>
                      {age}
                    </option>
                  ))}
                </select>
                <span className="flex items-center text-gray-500 text-sm">to</span>
                <select
                  value={searchData.ageTo}
                  onChange={(e) => handleInputChange('ageTo', e.target.value)}
                  className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                >
                  {Array.from({ length: 53 }, (_, i) => i + 18).map((age) => (
                    <option key={age} value={age}>
                      {age}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Height Range (cm) */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Height (ft)
              </label>
              <div className="flex space-x-2">
                <select
                  value={searchData.heightFrom}
                  onChange={(e) => handleInputChange('heightFrom', e.target.value)}
                  className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                >
                  {Array.from({ length: 71 }, (_, i) => i + 140).map((height) => (
                    <option key={height} value={height}>
                      {height} cm ({cmToFeetInches(height)})
                    </option>
                  ))}
                </select>
                <span className="flex items-center text-gray-500 text-sm">to</span>
                <select
                  value={searchData.heightTo}
                  onChange={(e) => handleInputChange('heightTo', e.target.value)}
                  className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                >
                  {Array.from({ length: 71 }, (_, i) => i + 140).map((height) => (
                    <option key={height} value={height}>
                      {height} cm ({cmToFeetInches(height)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Religion - From API 7 Masters */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Religion <span className="text-red-500">*</span>
              </label>
              <select
                value={searchData.religion}
                onChange={(e) => handleInputChange('religion', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={!mounted || loading}
                required
              >
                <option value="" disabled>
                  {loading ? 'Loading...' : 'Select Religion'}
                </option>
                {mounted && masterData?.religion.map((religion) => (
                  <option key={religion.id} value={religion.id}>
                    {religion.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Caste - From API 7 Masters (filtered by religion) */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Caste <span className="text-red-500">*</span>
              </label>
              <select
                value={searchData.caste}
                onChange={(e) => handleInputChange('caste', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={!mounted || loading || !searchData.religion}
                required
              >
                <option value="" disabled>
                  {!searchData.religion ? 'Select Religion First' : 'Select Caste'}
                </option>
                {mounted && searchData.religion && getFilteredCastes().map((caste) => (
                  <option key={caste.id} value={caste.id}>
                    {caste.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Marital Status */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Marital Status <span className="text-red-500">*</span>
              </label>
              <select
                value={searchData.marital_status}
                onChange={(e) => handleInputChange('marital_status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={!mounted || loading}
                required
              >
                <option value="" disabled>
                  Select Marital Status
                </option>
                {mounted && masterData?.marital_status?.map((status: { id: number; name: string }) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            {/* State */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={searchData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={!mounted || loading}
                required
              >
                <option value="" disabled>
                  Select State
                </option>
                {mounted && masterData?.state?.map((state: { id: number; name: string }) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                District <span className="text-red-500">*</span>
              </label>
              <select
                value={searchData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={!mounted || loading || !searchData.state}
                required
              >
                <option value="" disabled>
                  {!searchData.state ? 'Select State First' : 'Select District'}
                </option>
                {mounted && searchData.state && filteredDistricts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading || !searchData.religion || !searchData.caste || !searchData.marital_status || !searchData.state || !searchData.district}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 transition-colors duration-200 shadow-lg"
              >
                <Search className="h-5 w-5" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Quick Register */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Don&apos;t have an account? Join thousands of happy couples
            </p>
            <button
              onClick={() => router.push('/register')}
              className="bg-white text-red-600 border-2 border-red-500 hover:bg-red-500 hover:text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200"
            >
              Register Free
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
