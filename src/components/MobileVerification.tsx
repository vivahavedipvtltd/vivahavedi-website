'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shield,
  X
} from 'lucide-react';
import { otpSchema } from '@/lib/validation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface MobileVerificationProps {
  onVerificationComplete?: () => void;
}

interface VerificationStatus {
  mobile: string | null;
  is_verified: boolean;
  has_mobile: boolean;
}

const MobileVerification = ({ onVerificationComplete }: MobileVerificationProps) => {
  const { token } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const fetchVerificationStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/profile/mobile-verification/status`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.status === 'success') {
        setVerificationStatus(result.data);
      } else {
        setError(result.message || 'Failed to fetch verification status');
      }
    } catch (error) {
      console.error('Verification status fetch error:', error);
      setError('An error occurred while fetching verification status');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchVerificationStatus();
    }
  }, [token, fetchVerificationStatus]);

  const handleSendOtp = async () => {
    try {
      setSendingOtp(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`${API_BASE_URL}/profile/mobile-verification/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('OTP sent successfully to your mobile number!');
        setShowOtpInput(true);
      } else {
        setError(result.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setError('An error occurred while sending OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    // Validate OTP using Zod schema
    const result = otpSchema.safeParse({ otp });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      setVerifyingOtp(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`${API_BASE_URL}/profile/mobile-verification/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ otp }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('Mobile number verified successfully!');
        setShowOtpInput(false);
        setOtp('');

        // Refresh verification status
        setTimeout(() => {
          fetchVerificationStatus();
          if (onVerificationComplete) {
            onVerificationComplete();
          }
          setSuccess(null);
        }, 2000);
      } else {
        setError(result.message === 'invalid_otp' ? 'Invalid OTP. Please try again.' : result.message || 'Failed to verify OTP');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setError('An error occurred while verifying OTP');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleCancelOtp = () => {
    setShowOtpInput(false);
    setOtp('');
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-red-500" />
          <span className="ml-2 text-gray-600">Loading verification status...</span>
        </div>
      </div>
    );
  }

  if (!verificationStatus) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-red-500" />
          Mobile Verification
        </h2>
        {verificationStatus.is_verified && (
          <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            <span>Verified</span>
          </div>
        )}
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
          <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        </div>
      )}

      {/* Mobile Number Display */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-gray-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Mobile Number</p>
              <p className="text-lg font-semibold text-gray-900">
                {verificationStatus.has_mobile ? verificationStatus.mobile : 'Not provided'}
              </p>
            </div>
          </div>
          <div>
            {verificationStatus.is_verified ? (
              <div className="flex items-center text-green-600">
                <CheckCircle2 className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Verified</span>
              </div>
            ) : (
              <div className="flex items-center text-yellow-600">
                <AlertCircle className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Not Verified</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verification Actions */}
      {!verificationStatus.is_verified && verificationStatus.has_mobile && (
        <div className="space-y-4">
          {!showOtpInput ? (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Verify your mobile number to increase your profile credibility and enable mobile-based features.
              </p>
              <button
                onClick={handleSendOtp}
                disabled={sendingOtp}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {sendingOtp ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Phone className="h-5 w-5 mr-2" />
                    Send Verification OTP
                  </>
                )}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Enter the 6-digit OTP sent to {verificationStatus.mobile}
              </p>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                  }}
                  placeholder="Enter 6-digit OTP"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-center text-2xl tracking-widest font-semibold"
                  maxLength={6}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleVerifyOtp}
                  disabled={verifyingOtp || otp.length !== 6}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {verifyingOtp ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Verify OTP
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancelOtp}
                  disabled={verifyingOtp}
                  className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
              <button
                onClick={handleSendOtp}
                disabled={sendingOtp}
                className="w-full mt-2 text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>
          )}
        </div>
      )}

      {!verificationStatus.has_mobile && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">Mobile number not found</p>
              <p className="text-sm text-yellow-700 mt-1">
                Please add your mobile number to your profile before verifying.
              </p>
            </div>
          </div>
        </div>
      )}

      {verificationStatus.is_verified && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start">
            <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-green-800 font-medium">Mobile number verified!</p>
              <p className="text-sm text-green-700 mt-1">
                Your mobile number has been successfully verified. This helps build trust with other users.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Benefits Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-700 mb-2">Benefits of Mobile Verification:</p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li className="flex items-center">
            <CheckCircle2 className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
            Increased profile credibility and trust
          </li>
          <li className="flex items-center">
            <CheckCircle2 className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
            Enable OTP-based login option
          </li>
          <li className="flex items-center">
            <CheckCircle2 className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
            Receive important notifications via SMS
          </li>
          <li className="flex items-center">
            <CheckCircle2 className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
            Enhanced account security
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MobileVerification;
