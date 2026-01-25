'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface PasswordChangeSettingsProps {
  onPasswordChanged?: () => void;
}

const PasswordChangeSettings = ({ onPasswordChanged }: PasswordChangeSettingsProps) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    old_password?: string[];
    new_password?: string[];
    confirm_password?: string[];
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when user types
    setError(null);
    setSuccess(null);
    setValidationErrors({});
  };

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};
    let isValid = true;

    // Old password validation
    if (!formData.old_password) {
      errors.old_password = ['The old password field is required.'];
      isValid = false;
    } else if (formData.old_password.length < 6 || formData.old_password.length > 20) {
      errors.old_password = ['The old password must be between 6 and 20 characters.'];
      isValid = false;
    }

    // New password validation
    if (!formData.new_password) {
      errors.new_password = ['The new password field is required.'];
      isValid = false;
    } else if (formData.new_password.length < 6 || formData.new_password.length > 20) {
      errors.new_password = ['The new password must be between 6 and 20 characters.'];
      isValid = false;
    } else if (formData.new_password === formData.old_password) {
      errors.new_password = ['The new password must be different from old password.'];
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirm_password) {
      errors.confirm_password = ['Please confirm your new password.'];
      isValid = false;
    } else if (formData.new_password !== formData.confirm_password) {
      errors.confirm_password = ['The passwords do not match.'];
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: formData.old_password,
          new_password: formData.new_password,
        }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('Password changed successfully! Please use your new password for future logins.');
        // Clear form
        setFormData({
          old_password: '',
          new_password: '',
          confirm_password: '',
        });
        // Call callback if provided
        if (onPasswordChanged) {
          onPasswordChanged();
        }
      } else {
        // Handle different error scenarios
        if (result.message === 'Password Not Changed') {
          setError('Current password is incorrect. Please try again.');
        } else if (result.errors) {
          setValidationErrors(result.errors);
          const errorMessages = Object.values(result.errors).flat().join(' ');
          setError(errorMessages);
        } else {
          setError(result.message || 'Failed to change password. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError('An error occurred while changing password. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Lock className="h-6 w-6 text-red-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Update your password to keep your account secure. Your password must be 6-20 characters long.
      </p>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showOldPassword ? 'text' : 'password'}
              name="old_password"
              value={formData.old_password}
              onChange={handleChange}
              className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                validationErrors.old_password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showOldPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {validationErrors.old_password && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.old_password[0]}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                validationErrors.new_password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {validationErrors.new_password && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.new_password[0]}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Password must be 6-20 characters and different from your current password
          </p>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                validationErrors.confirm_password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {validationErrors.confirm_password && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.confirm_password[0]}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => {
              setFormData({ old_password: '', new_password: '', confirm_password: '' });
              setError(null);
              setSuccess(null);
              setValidationErrors({});
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Changing Password...
              </>
            ) : (
              <>
                <Lock className="h-5 w-5 mr-2" />
                Change Password
              </>
            )}
          </button>
        </div>
      </form>

      {/* Security Tips */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Password Security Tips:</h3>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Use a mix of letters, numbers, and special characters</li>
          <li>• Avoid using personal information like birthdate or name</li>
          <li>• Don&apos;t reuse passwords from other websites</li>
          <li>• Change your password regularly for better security</li>
          <li>• Never share your password with anyone</li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordChangeSettings;
