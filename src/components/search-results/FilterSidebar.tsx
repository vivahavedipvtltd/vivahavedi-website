'use client';

import { SlidersHorizontal, X, Search, Loader2 } from 'lucide-react';
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

interface MasterDataItem {
  id: number;
  name: string;
  masterId?: number;
}

interface FilterSidebarProps {
  searchType: 'advanced' | 'id' | 'saved';
  searchId: string;
  filters: SearchFilters;
  loading: boolean;
  showMobileFilters: boolean;
  masterData: Record<string, MasterDataItem[]> | null | undefined;
  filteredCastes: MasterDataItem[];
  filteredStates: MasterDataItem[];
  filteredDistricts: MasterDataItem[];
  filteredQualifications: MasterDataItem[];
  maritalStatusOptions: Array<{ id: string; name: string }>;
  manglikOptions: Array<{ id: string; name: string }>;
  physicalStatusOptions: Array<{ id: string; name: string }>;
  workingSectorOptions: Array<{ id: string; name: string }>;
  sortBy: 'featured' | 'new' | 'photo';
  ageOptions: number[];
  heightOptions: number[];
  onCloseMobileFilters: () => void;
  onFilterChange: (key: string, value: string | number | string[] | number[] | undefined) => void;
  onSortChange: (sort: 'featured' | 'new' | 'photo') => void;
  onSearchIdChange: (id: string) => void;
  onRefineSearch: () => void;
  cmToFeetInches: (cm: number) => string;
}

export default function FilterSidebar({
  searchType,
  searchId,
  filters,
  loading,
  showMobileFilters,
  masterData,
  filteredCastes,
  filteredStates,
  filteredDistricts,
  filteredQualifications,
  maritalStatusOptions,
  manglikOptions,
  physicalStatusOptions,
  workingSectorOptions,
  sortBy,
  ageOptions,
  heightOptions,
  onCloseMobileFilters,
  onFilterChange,
  onSortChange,
  onSearchIdChange,
  onRefineSearch,
  cmToFeetInches,
}: FilterSidebarProps) {
  return (
    <div className={`lg:col-span-1 ${showMobileFilters ? 'fixed inset-0 z-50 lg:relative' : 'hidden lg:block'}`}>
      <div className={`${showMobileFilters ? 'h-full overflow-y-auto bg-white' : ''}`}>
        {/* Mobile Filter Header */}
        {showMobileFilters && (
          <div className="lg:hidden sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-bold text-gray-900">Refine Search</h2>
            <button
              onClick={onCloseMobileFilters}
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
                      onFilterChange('age_from', parseInt(e.target.value) || undefined)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">From</option>
                    {ageOptions.map((age) => (
                      <option key={age} value={age}>
                        {age}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filters.age_to || ''}
                    onChange={(e) =>
                      onFilterChange('age_to', parseInt(e.target.value) || undefined)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">To</option>
                    {ageOptions.map((age) => (
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
                      onFilterChange('height_from', e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">From</option>
                    {heightOptions.map((height) => (
                      <option key={height} value={height}>
                        {height} cm ({cmToFeetInches(height)})
                      </option>
                    ))}
                  </select>
                  <select
                    value={filters.height_to || ''}
                    onChange={(e) =>
                      onFilterChange('height_to', e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">To</option>
                    {heightOptions.map((height) => (
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
                    onFilterChange('religion', parseInt(e.target.value) || undefined)
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
                  options={filteredCastes}
                  selectedValues={filters.caste || []}
                  onChange={(values) => onFilterChange('caste', values as number[])}
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
                    onFilterChange('country', parseInt(e.target.value) || undefined)
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
                      onFilterChange('state', parseInt(e.target.value) || undefined)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">All States</option>
                    {filteredStates.map((s) => (
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
                  options={filteredDistricts}
                  selectedValues={filters.district || []}
                  onChange={(values) => onFilterChange('district', values as number[])}
                  placeholder="Select districts"
                />
              )}

              {/* Marital Status */}
              <MultiSelectCheckbox
                label="Marital Status"
                options={maritalStatusOptions}
                selectedValues={filters.marital_status || []}
                onChange={(values) => onFilterChange('marital_status', values as string[])}
                placeholder="Select marital status"
              />

              {/* Nakshatra */}
              <MultiSelectCheckbox
                label="Nakshatra"
                options={masterData.nakshathra || []}
                selectedValues={filters.nakshatra || []}
                onChange={(values) => onFilterChange('nakshatra', values as number[])}
                placeholder="Select nakshatras"
              />

              {/* Manglik */}
              <MultiSelectCheckbox
                label="Manglik"
                options={manglikOptions}
                selectedValues={filters.manglik || []}
                onChange={(values) => onFilterChange('manglik', values as string[])}
                placeholder="Select manglik status"
              />

              {/* Qualification Level */}
              <MultiSelectCheckbox
                label="Qualification Level"
                options={masterData.qualification_level || []}
                selectedValues={filters.q_level || []}
                onChange={(values) => onFilterChange('q_level', values as number[])}
                placeholder="Select qualification levels"
              />

              {/* Qualification */}
              {filters.q_level && filters.q_level.length > 0 && (
                <MultiSelectCheckbox
                  label="Qualification"
                  options={filteredQualifications}
                  selectedValues={filters.qualification || []}
                  onChange={(values) => onFilterChange('qualification', values as number[])}
                  placeholder="Select qualifications"
                />
              )}

              {/* Specialization */}
              <MultiSelectCheckbox
                label="Specialization"
                options={masterData.specialization || []}
                selectedValues={filters.specialization || []}
                onChange={(values) => onFilterChange('specialization', values as number[])}
                placeholder="Select specializations"
              />

              {/* Profession */}
              <MultiSelectCheckbox
                label="Profession"
                options={masterData.profession || []}
                selectedValues={filters.profession || []}
                onChange={(values) => onFilterChange('profession', values as number[])}
                placeholder="Select professions"
              />

              {/* Working In */}
              <MultiSelectCheckbox
                label="Working In"
                options={workingSectorOptions}
                selectedValues={filters.workedin || []}
                onChange={(values) => onFilterChange('workedin', values as string[])}
                placeholder="Select work sectors"
              />

              {/* Physical Status */}
              <MultiSelectCheckbox
                label="Physical Status"
                options={physicalStatusOptions}
                selectedValues={filters.physicalstatus || []}
                onChange={(values) => onFilterChange('physicalstatus', values as string[])}
                placeholder="Select physical status"
              />

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value as 'featured' | 'new' | 'photo')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="featured">Featured Profiles</option>
                  <option value="new">Newest First</option>
                  <option value="photo">With Photos</option>
                </select>
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={onRefineSearch}
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
                  onChange={(e) => onSearchIdChange(e.target.value)}
                  placeholder="Enter Profile ID"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={onRefineSearch}
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
  );
}
