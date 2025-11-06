'use client';

import { useState } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react';
import { RegistrationFormData } from '@/types/registration';

interface RegistrationStepOneProps {
  formData: RegistrationFormData;
  onComplete: (data: Partial<RegistrationFormData>) => void;
}

const RegistrationStepOne = ({ formData, onComplete }: RegistrationStepOneProps) => {
  const [localFormData, setLocalFormData] = useState({
    mobile: formData.mobile,
    email: formData.email,
    password: formData.password,
    confirmPassword: formData.confirmPassword || '',
    name: formData.name,
    last_name: formData.last_name,
    gender: formData.gender,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFormData({ ...localFormData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate mobile
    if (!localFormData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(localFormData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }

    // Validate email
    if (!localFormData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localFormData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Validate password
    if (!localFormData.password) {
      newErrors.password = 'Password is required';
    } else if (localFormData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Validate confirm password
    if (!localFormData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (localFormData.password !== localFormData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Validate name
    if (!localFormData.name) {
      newErrors.name = 'First name is required';
    } else if (localFormData.name.length > 255) {
      newErrors.name = 'First name is too long';
    }

    // Validate last name
    if (!localFormData.last_name) {
      newErrors.last_name = 'Last name is required';
    } else if (localFormData.last_name.length > 255) {
      newErrors.last_name = 'Last name is too long';
    }

    // Validate gender
    if (!localFormData.gender) {
      newErrors.gender = 'Gender is required';
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>

      {/* Mobile Number */}
      <div>
        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
          Mobile Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={localFormData.mobile}
            onChange={handleChange}
            maxLength={10}
            className={`pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
              errors.mobile ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter 10 digit mobile number"
          />
        </div>
        {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="email"
            id="email"
            name="email"
            value={localFormData.email}
            onChange={handleChange}
            className={`pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      {/* First Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          First Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            id="name"
            name="name"
            value={localFormData.name}
            onChange={handleChange}
            className={`pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your first name"
          />
        </div>
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Last Name */}
      <div>
        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
          Last Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={localFormData.last_name}
            onChange={handleChange}
            className={`pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
              errors.last_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your last name"
          />
        </div>
        {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={localFormData.password}
            onChange={handleChange}
            className={`pl-10 pr-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter password (min 6 characters)"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={localFormData.confirmPassword}
            onChange={handleChange}
            className={`pl-10 pr-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Re-enter password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
      </div>

      {/* Gender */}
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
          Gender <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label
            className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              localFormData.gender === 'male'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 hover:border-red-300'
            }`}
          >
            <input
              type="radio"
              name="gender"
              value="male"
              checked={localFormData.gender === 'male'}
              onChange={handleChange}
              className="sr-only"
            />
            <span className={`font-medium ${localFormData.gender === 'male' ? 'text-red-500' : 'text-gray-700'}`}>
              Male
            </span>
          </label>
          <label
            className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              localFormData.gender === 'female'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 hover:border-red-300'
            }`}
          >
            <input
              type="radio"
              name="gender"
              value="female"
              checked={localFormData.gender === 'female'}
              onChange={handleChange}
              className="sr-only"
            />
            <span className={`font-medium ${localFormData.gender === 'female' ? 'text-red-500' : 'text-gray-700'}`}>
              Female
            </span>
          </label>
        </div>
        {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
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

export default RegistrationStepOne;
