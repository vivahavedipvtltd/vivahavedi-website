'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, ArrowLeft, Loader2, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword = ({ onBack }: ForgotPasswordProps) => {
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const [step, setStep] = useState<'mobile' | 'verify' | 'reset'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Step 1: Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate mobile number
    if (!/^[0-9]{10}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ mobile }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('OTP sent successfully! Please check your mobile.');
        setStep('verify');
      } else {
        if (result.message === 'invalid_number') {
          setError('Mobile number not registered. Please check your number.');
        } else if (result.errors?.mobile) {
          setError(result.errors.mobile[0]);
        } else {
          setError(result.message || 'Failed to send OTP. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('An error occurred while sending OTP. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP (Optional - can skip to reset)
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate OTP
    if (!/^[0-9]{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ mobile, otp }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('OTP verified successfully!');
        setStep('reset');
      } else {
        if (result.message === 'invalid_otp') {
          setError('Invalid OTP. Please check and try again.');
        } else if (result.errors?.otp) {
          setError(result.errors.otp[0]);
        } else {
          setError(result.message || 'Failed to verify OTP. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('An error occurred while verifying OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate passwords
    if (password.length < 6 || password.length > 20) {
      setError('Password must be between 6 and 20 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!/^[0-9]{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ mobile, otp, password }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        // Store token and user ID
        auth.setToken(result.data.token);
        auth.setUserId(result.data.user_id);

        // Update auth context
        authLogin(result.data.token, result.data.user_id);

        setSuccess('Password reset successful! Redirecting to dashboard...');

        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        if (result.message === 'invalid_otp') {
          setError('Invalid OTP. Please check and try again.');
        } else if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(' ');
          setError(errorMessages);
        } else {
          setError(result.message || 'Failed to reset password. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('An error occurred while resetting password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp('');
    setError(null);
    await handleSendOTP({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </button>
        <div className="flex items-center mb-2">
          <KeyRound className="h-6 w-6 text-red-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
        </div>
        <p className="text-sm text-gray-600">
          {step === 'mobile' && 'Enter your registered mobile number'}
          {step === 'verify' && 'Verify the OTP sent to your mobile'}
          {step === 'reset' && 'Create a new password for your account'}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium ${step === 'mobile' ? 'text-red-500' : 'text-gray-500'}`}>
            Mobile
          </span>
          <span className={`text-xs font-medium ${step === 'verify' ? 'text-red-500' : 'text-gray-500'}`}>
            Verify OTP
          </span>
          <span className={`text-xs font-medium ${step === 'reset' ? 'text-red-500' : 'text-gray-500'}`}>
            New Password
          </span>
        </div>
        <div className="flex space-x-2">
          <div className={`h-2 flex-1 rounded-full ${step === 'mobile' || step === 'verify' || step === 'reset' ? 'bg-red-500' : 'bg-gray-200'}`} />
          <div className={`h-2 flex-1 rounded-full ${step === 'verify' || step === 'reset' ? 'bg-red-500' : 'bg-gray-200'}`} />
          <div className={`h-2 flex-1 rounded-full ${step === 'reset' ? 'bg-red-500' : 'bg-gray-200'}`} />
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Step 1: Mobile Number */}
      {step === 'mobile' && (
        <form onSubmit={handleSendOTP} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || mobile.length !== 10}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Sending OTP...
              </>
            ) : (
              <>
                <Smartphone className="h-5 w-5 mr-2" />
                Send OTP
              </>
            )}
          </button>
        </form>
      )}

      {/* Step 2: Verify OTP */}
      {step === 'verify' && (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">OTP sent to:</p>
            <p className="text-lg font-semibold text-gray-900">{mobile}</p>
            <button
              type="button"
              onClick={() => {
                setStep('mobile');
                setOtp('');
                setError(null);
                setSuccess(null);
              }}
              className="text-sm text-red-500 hover:text-red-600 mt-1"
            >
              Change Number
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-center text-2xl tracking-widest"
              placeholder="000000"
              maxLength={6}
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setStep('reset')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Skip to Reset
            </button>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Verify OTP'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading}
              className="text-sm text-red-500 hover:text-red-600 disabled:opacity-50"
            >
              Resend OTP
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Reset Password */}
      {step === 'reset' && (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Resetting password for:</p>
            <p className="text-lg font-semibold text-gray-900">{mobile}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OTP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-center"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter new password (6-20 characters)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !otp || !password || !confirmPassword}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Resetting Password...
              </>
            ) : (
              <>
                <Lock className="h-5 w-5 mr-2" />
                Reset Password
              </>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading}
              className="text-sm text-red-500 hover:text-red-600 disabled:opacity-50"
            >
              Resend OTP
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
