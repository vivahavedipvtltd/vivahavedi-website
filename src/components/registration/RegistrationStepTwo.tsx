'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { RegistrationFormData } from '@/types/registration';
import { useToast } from '@/contexts/ToastContext';
import { useMasterData } from '@/hooks/useMasterData';

// Static arrays - moved outside component to avoid recreation on every render
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

interface RegistrationStepTwoProps {
  formData: RegistrationFormData;
  onComplete: (data: Partial<RegistrationFormData>) => void;
  onBack: () => void;
}

const RegistrationStepTwo = ({ formData, onComplete, onBack }: RegistrationStepTwoProps) => {
  const { showError } = useToast();
  const [localFormData, setLocalFormData] = useState({
    birth_day: formData.birth_day,
    birth_month: formData.birth_month,
    birth_year: formData.birth_year,
    religion: formData.religion,
    caste: formData.caste,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use SWR hook for master data (automatically cached and deduplicated)
  const { data: masterDataResponse, isLoading, error: masterError } = useMasterData();

  // Extract master data from response
  const masterData = masterDataResponse?.data;
  const loading = isLoading;

  // Show error if master data fetch failed
  if (masterError && !loading) {
    showError('Failed to load form data. Please refresh the page.');
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    setLocalFormData({ ...localFormData, [name]: numValue });

    // Clear error when user selects
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    // Reset caste when religion changes
    if (name === 'religion') {
      setLocalFormData({ ...localFormData, religion: numValue, caste: 0 });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate birth day
    if (!localFormData.birth_day || localFormData.birth_day < 1 || localFormData.birth_day > 31) {
      newErrors.birth_day = 'Please select a valid day';
    }

    // Validate birth month
    if (!localFormData.birth_month || localFormData.birth_month < 1 || localFormData.birth_month > 12) {
      newErrors.birth_month = 'Please select a valid month';
    }

    // Validate birth year (must be 18+ years old)
    const currentYear = new Date().getFullYear();
    if (!localFormData.birth_year || localFormData.birth_year < 1950 || localFormData.birth_year > currentYear - 18) {
      newErrors.birth_year = 'You must be at least 18 years old';
    }

    // Validate religion
    if (!localFormData.religion) {
      newErrors.religion = 'Please select your religion';
    }

    // Validate caste
    if (!localFormData.caste) {
      newErrors.caste = 'Please select your caste';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onComplete(localFormData);
    }
  };

  // Memoize years array - only recalculates if needed (once per session typically)
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1950 - 18 + 1 }, (_, i) => currentYear - 18 - i);
  }, []); // Empty dependency array - year rarely changes during a session

  // Memoize filtered castes - only recalculates when masterData or religion changes
  const filteredCastes = useMemo(() => {
    return masterData?.caste.filter(
      (caste) => caste.masterId === localFormData.religion
    ) || [];
  }, [masterData?.caste, localFormData.religion]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Details</h2>

      {/* Date of Birth */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-4">
          {/* Day */}
          <div>
            <select
              name="birth_day"
              value={localFormData.birth_day}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.birth_day ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Day</option>
              {DAYS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            {errors.birth_day && <p className="mt-1 text-xs text-red-600">{errors.birth_day}</p>}
          </div>

          {/* Month */}
          <div>
            <select
              name="birth_month"
              value={localFormData.birth_month}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.birth_month ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Month</option>
              {MONTHS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            {errors.birth_month && <p className="mt-1 text-xs text-red-600">{errors.birth_month}</p>}
          </div>

          {/* Year */}
          <div>
            <select
              name="birth_year"
              value={localFormData.birth_year}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.birth_year ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.birth_year && <p className="mt-1 text-xs text-red-600">{errors.birth_year}</p>}
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">You must be 18 years or older to register</p>
      </div>

      {/* Religion */}
      <div>
        <label htmlFor="religion" className="block text-sm font-medium text-gray-700 mb-1">
          Religion <span className="text-red-500">*</span>
        </label>
        <select
          id="religion"
          name="religion"
          value={localFormData.religion}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
            errors.religion ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select Religion</option>
          {masterData?.religion.map((religion) => (
            <option key={religion.id} value={religion.id}>
              {religion.name}
            </option>
          ))}
        </select>
        {errors.religion && <p className="mt-1 text-sm text-red-600">{errors.religion}</p>}
      </div>

      {/* Caste */}
      <div>
        <label htmlFor="caste" className="block text-sm font-medium text-gray-700 mb-1">
          Caste <span className="text-red-500">*</span>
        </label>
        <select
          id="caste"
          name="caste"
          value={localFormData.caste}
          onChange={handleChange}
          disabled={!localFormData.religion}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
            errors.caste ? 'border-red-500' : 'border-gray-300'
          } ${!localFormData.religion ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        >
          <option value="">
            {!localFormData.religion ? 'Select Religion First' : 'Select Caste'}
          </option>
          {filteredCastes.map((caste) => (
            <option key={caste.id} value={caste.id}>
              {caste.name}
            </option>
          ))}
        </select>
        {errors.caste && <p className="mt-1 text-sm text-red-600">{errors.caste}</p>}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          Next Step
        </button>
      </div>
    </form>
  );
};

export default RegistrationStepTwo;
