'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import RegistrationStepOne from '@/components/registration/RegistrationStepOne';
import { RegistrationFormData } from '@/types/registration';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

// Lazy load steps 2 and 3 for better performance (code splitting)
// These are only loaded when user progresses to those steps
const RegistrationStepTwo = dynamic(
  () => import('@/components/registration/RegistrationStepTwo'),
  {
    loading: () => (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    ),
    ssr: true, // Enable SSR for better SEO
  }
);

const RegistrationStepThree = dynamic(
  () => import('@/components/registration/RegistrationStepThree'),
  {
    loading: () => (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    ),
    ssr: true, // Enable SSR for better SEO
  }
);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function RegisterClient() {
  const router = useRouter();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationFormData>({
    // Step 1 - Basic Information
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    last_name: '',
    gender: '',

    // Step 2 - Personal Details
    birth_day: 0,
    birth_month: 0,
    birth_year: 0,
    religion: 0,
    caste: 0,

    // Step 3 - Location
    country: 0,
    state: 0,
    district: 0,
    location: 0,
    address: '',
  });

  const handleStepOneComplete = (data: Partial<RegistrationFormData>) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(2);
  };

  const handleStepTwoComplete = (data: Partial<RegistrationFormData>) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(3);
  };

  const handleStepThreeComplete = async (data: Partial<RegistrationFormData>) => {
    const finalData = { ...formData, ...data };
    setFormData(finalData);

    // Submit to API
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          mobile: finalData.mobile,
          email: finalData.email,
          password: finalData.password,
          name: finalData.name,
          last_name: finalData.last_name,
          gender: finalData.gender,
          birth_day: finalData.birth_day,
          birth_month: finalData.birth_month,
          birth_year: finalData.birth_year,
          religion: finalData.religion,
          caste: finalData.caste,
          country: finalData.country,
          state: finalData.state,
          district: finalData.district,
          location: finalData.location,
          address: finalData.address,
        }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        // Auto-login: Use AuthContext login method to update auth state
        login(result.data.token, result.data.user_id, result.data.expire_date);

        showSuccess('Registration successful! Redirecting to dashboard...');
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        // Parse specific field errors from API response
        const fieldErrors = result.errors;
        if (fieldErrors && (fieldErrors.mobile || fieldErrors.email)) {
          const messages: string[] = [];
          if (fieldErrors.mobile) messages.push(fieldErrors.mobile[0]);
          if (fieldErrors.email) messages.push(fieldErrors.email[0]);
          showError(messages.join('. '));
          setCurrentStep(1);
        } else {
          showError(result.message || 'Registration failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      showError('An error occurred during registration. Please try again.');
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <main className="flex-grow bg-gradient-to-br from-red-50 via-white to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">
            Join thousands of happy couples who found their perfect match
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    currentStep >= step
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-20 h-1 transition-all duration-300 ${
                      currentStep > step ? 'bg-red-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 space-x-20">
            <span className={`text-sm ${currentStep >= 1 ? 'text-red-500 font-semibold' : 'text-gray-600'}`}>
              Basic Info
            </span>
            <span className={`text-sm ${currentStep >= 2 ? 'text-red-500 font-semibold' : 'text-gray-600'}`}>
              Personal Details
            </span>
            <span className={`text-sm ${currentStep >= 3 ? 'text-red-500 font-semibold' : 'text-gray-600'}`}>
              Location
            </span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {currentStep === 1 && (
            <RegistrationStepOne
              formData={formData}
              onComplete={handleStepOneComplete}
            />
          )}

          {currentStep === 2 && (
            <RegistrationStepTwo
              formData={formData}
              onComplete={handleStepTwoComplete}
              onBack={handleBackStep}
            />
          )}

          {currentStep === 3 && (
            <RegistrationStepThree
              formData={formData}
              onComplete={handleStepThreeComplete}
              onBack={handleBackStep}
            />
          )}
        </div>

        {/* Footer Text */}
        <div className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-red-500 hover:text-red-600 font-semibold">
            Login here
          </Link>
        </div>
      </div>
    </main>
  );
}
