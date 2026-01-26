'use client';

import { useState, useMemo } from 'react';
import { MapPin, ChevronLeft } from 'lucide-react';
import { RegistrationFormData } from '@/types/registration';
import { useToast } from '@/contexts/ToastContext';
import { useMasterData, useLocationsByDistrict } from '@/hooks/useMasterData';

interface RegistrationStepThreeProps {
  formData: RegistrationFormData;
  onComplete: (data: Partial<RegistrationFormData>) => void;
  onBack: () => void;
}

const RegistrationStepThree = ({ formData, onComplete, onBack }: RegistrationStepThreeProps) => {
  const { showError } = useToast();
  const [localFormData, setLocalFormData] = useState({
    country: formData.country,
    state: formData.state,
    district: formData.district,
    location: formData.location,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Use SWR hook for master data (automatically cached and deduplicated with Step 2)
  const { data: masterDataResponse, isLoading: masterLoading, error: masterError } = useMasterData();

  // Use SWR hook for locations (automatically fetched when district changes)
  const { data: locationsResponse, isLoading: locationsLoading, error: locationsError } = useLocationsByDistrict(
    localFormData.district || null
  );

  // Extract data from responses
  const masterData = masterDataResponse?.data;
  const locations = locationsResponse?.data || [];
  const loading = masterLoading;

  // Show error if data fetch failed
  if (masterError && !masterLoading) {
    showError('Failed to load form data. Please refresh the page.');
  }

  if (locationsError && !locationsLoading && localFormData.district) {
    showError('Failed to load locations. Please try again.');
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;

    let updates: Partial<typeof localFormData> = { [name]: numValue };

    // Reset dependent fields
    if (name === 'country') {
      updates = { ...updates, state: 0, district: 0, location: 0 };
    } else if (name === 'state') {
      updates = { ...updates, district: 0, location: 0 };
    } else if (name === 'district') {
      updates = { ...updates, location: 0 };
    }

    setLocalFormData({ ...localFormData, ...updates });

    // Clear error when user selects
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!localFormData.country) {
      newErrors.country = 'Please select your country';
    }

    if (!localFormData.state) {
      newErrors.state = 'Please select your state';
    }

    if (!localFormData.district) {
      newErrors.district = 'Please select your district';
    }

    if (!localFormData.location) {
      newErrors.location = 'Please select your location';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setSubmitting(true);
      onComplete(localFormData);
    }
  };

  // Memoize filtered states - only recalculates when masterData or country changes
  const filteredStates = useMemo(() => {
    return masterData?.state.filter(
      (state) => state.masterId === localFormData.country
    ) || [];
  }, [masterData?.state, localFormData.country]);

  // Memoize filtered districts - only recalculates when masterData or state changes
  const filteredDistricts = useMemo(() => {
    return masterData?.district.filter(
      (district) => district.masterId === localFormData.state
    ) || [];
  }, [masterData?.district, localFormData.state]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Location Details</h2>

      {/* Country */}
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
          Country <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <select
            id="country"
            name="country"
            value={localFormData.country}
            onChange={handleChange}
            className={`pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
              errors.country ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Country</option>
            {masterData?.country.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
      </div>

      {/* State */}
      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
          State <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <select
            id="state"
            name="state"
            value={localFormData.state}
            onChange={handleChange}
            disabled={!localFormData.country}
            className={`pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
              errors.state ? 'border-red-500' : 'border-gray-300'
            } ${!localFormData.country ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          >
            <option value="">
              {!localFormData.country ? 'Select Country First' : 'Select State'}
            </option>
            {filteredStates.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
      </div>

      {/* District */}
      <div>
        <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
          District <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <select
            id="district"
            name="district"
            value={localFormData.district}
            onChange={handleChange}
            disabled={!localFormData.state}
            className={`pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
              errors.district ? 'border-red-500' : 'border-gray-300'
            } ${!localFormData.state ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          >
            <option value="">
              {!localFormData.state ? 'Select State First' : 'Select District'}
            </option>
            {filteredDistricts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
        {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district}</p>}
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location / Post Office <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <select
            id="location"
            name="location"
            value={localFormData.location}
            onChange={handleChange}
            disabled={!localFormData.district || locations.length === 0}
            className={`pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            } ${!localFormData.district || locations.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          >
            <option value="">
              {!localFormData.district ? 'Select District First' : locations.length === 0 ? 'Loading locations...' : 'Select Location'}
            </option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
        {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Account...
            </>
          ) : (
            'Complete Registration'
          )}
        </button>
      </div>
    </form>
  );
};

export default RegistrationStepThree;
