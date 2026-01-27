'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import LoginWithOTP from '@/components/LoginWithOTP';
import ForgotPassword from '@/components/ForgotPassword';

type LoginMode = 'password' | 'otp' | 'forgot-password';

export default function LoginPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const [mode, setMode] = useState<LoginMode>('password');
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.login.trim()) {
      newErrors.login = 'Email or mobile number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await apiClient.login(formData.login, formData.password);

      if (result.status === 'success') {
        // Update auth context (which also stores token, user ID, and expiry)
        authLogin(result.data.token, result.data.user_id, result.data.expire_date);

        // Redirect to dashboard page
        router.push('/dashboard');
      } else {
        setErrors({ login: result.message || 'Invalid login credentials' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ login: 'Login failed. Please check your credentials and try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Render different components based on mode
  if (mode === 'otp') {
    return (
      <AuthGuard requireAuth={false} redirectTo="/dashboard">
        <Header />
        <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left Side - OTP Login Form */}
              <div className="w-full">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                  <p className="text-gray-600">Login with OTP to continue</p>
                </div>
                <LoginWithOTP onBack={() => setMode('password')} />
              </div>

              {/* Right Side - SEO Content */}
              <div className="hidden lg:block w-full">
                <div className="space-y-8">
                  {/* Hero Section */}
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-8 border border-red-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Secure OTP Login</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      Login securely with One-Time Password sent to your registered mobile number. No need to remember passwords!
                    </p>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Quick & Convenient Access</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Enhanced Security</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>No Password Required</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-lg p-6 text-white shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Trusted by Millions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-1">10L+</div>
                        <div className="text-sm text-red-50">Active Members</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-1">50K+</div>
                        <div className="text-sm text-red-50">Success Stories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-1">100+</div>
                        <div className="text-sm text-red-50">Communities</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-1">4.8★</div>
                        <div className="text-sm text-red-50">User Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </AuthGuard>
    );
  }

  if (mode === 'forgot-password') {
    return (
      <AuthGuard requireAuth={false} redirectTo="/dashboard">
        <Header />
        <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left Side - Forgot Password Form */}
              <div className="w-full">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
                  <p className="text-gray-600">Recover your account access</p>
                </div>
                <ForgotPassword onBack={() => setMode('password')} />
              </div>

              {/* Right Side - SEO Content */}
              <div className="hidden lg:block w-full">
                <div className="space-y-8">
                  {/* Hero Section */}
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-8 border border-red-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Recovery Made Easy</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      Don&apos;t worry! Resetting your password is quick and secure. We&apos;ll send you a verification code to reset your password.
                    </p>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Instant Password Reset</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Secure Verification Process</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>24/7 Support Available</span>
                      </div>
                    </div>
                  </div>

                  {/* Help Section */}
                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h3>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>If you don&apos;t receive the OTP, check your spam folder</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Make sure you&apos;re using the registered mobile number</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Contact our support team if you face any issues</span>
                      </li>
                    </ul>
                  </div>

                  {/* Contact Support */}
                  <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-lg p-6 text-white shadow-lg">
                    <h3 className="text-xl font-semibold mb-2">Still Need Help?</h3>
                    <p className="text-sm text-red-50 mb-4">Our support team is here to assist you 24/7</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>Email Support</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>Phone Support</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      <Header />

      <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Side - Login Form */}
            <div className="w-full">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-600">Sign in to your account to continue</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email/Mobile */}
              <div>
                <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-1">
                  Email or Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <input
                    type="text"
                    id="login"
                    name="login"
                    value={formData.login}
                    onChange={handleChange}
                    className={`pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.login ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email or mobile number"
                  />
                </div>
                {errors.login && <p className="mt-1 text-sm text-red-600">{errors.login}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => setMode('forgot-password')}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Divider */}
            <div className="mt-6 mb-6 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Login with OTP Button */}
            <button
              type="button"
              onClick={() => setMode('otp')}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Login with OTP
            </button>

            {/* Links */}
            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-red-500 hover:text-red-600 font-medium">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - SEO Content */}
        <div className="hidden lg:block w-full">
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-8 border border-red-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Your Perfect Life Partner</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Join thousands of happy couples who found their soulmate through Vivahavedi Matrimony.
                India&apos;s most trusted matrimonial platform connecting hearts across communities.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">100% Verified Profiles</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Safe & Secure</span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose Vivahavedi?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-900">Genuine Profiles</h4>
                    <p className="text-sm text-gray-600">Every profile is manually verified for authenticity and security</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-900">Advanced Search</h4>
                    <p className="text-sm text-gray-600">Find matches based on religion, caste, profession, and more</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-900">Privacy Control</h4>
                    <p className="text-sm text-gray-600">Control who can view your profile and contact you</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-900">24/7 Support</h4>
                    <p className="text-sm text-gray-600">Dedicated customer support to help you at every step</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
        </div>
      </div>

      <Footer />
    </AuthGuard>
  );
}
