'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, ArrowLeft, Loader2, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface LoginWithOTPProps {
  onBack: () => void;
}

const LoginWithOTP = ({ onBack }: LoginWithOTPProps) => {
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      const response = await fetch(`${API_BASE_URL}/login-otp/send-otp`, {
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
        setStep('otp');
      } else {
        if (result.message === 'invalid_number') {
          setError('Mobile number not registered. Please sign up first.');
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
      const response = await fetch(`${API_BASE_URL}/login-otp/verify-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ mobile, otp }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        // Update auth context (which also stores token, user ID, and expiry)
        authLogin(result.data.token, result.data.user_id, result.data.expire_date);

        setSuccess('Login successful! Redirecting...');

        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        if (result.message === 'Invalid OTP' || result.message === 'invalid_otp') {
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
          <Shield className="h-6 w-6 text-red-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Login with OTP</h2>
        </div>
        <p className="text-sm text-gray-600">
          {step === 'mobile'
            ? 'Enter your registered mobile number to receive OTP'
            : 'Enter the 6-digit OTP sent to your mobile'}
        </p>
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

      {/* Mobile Number Step */}
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
            <p className="mt-1 text-xs text-gray-500">
              Enter the mobile number you used to register
            </p>
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

      {/* OTP Verification Step */}
      {step === 'otp' && (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          {/* Mobile Number Display */}
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
            <p className="mt-1 text-xs text-gray-500 text-center">
              Enter the 6-digit OTP sent to your mobile
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="h-5 w-5 mr-2" />
                Verify & Login
              </>
            )}
          </button>

          {/* Resend OTP */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading}
              className="text-sm text-red-500 hover:text-red-600 disabled:opacity-50"
            >
              Didn't receive OTP? Resend
            </button>
          </div>
        </form>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> OTP is valid for one-time use only. For security reasons, please do not share your OTP with anyone.
        </p>
      </div>
    </div>
  );
};

export default LoginWithOTP;
