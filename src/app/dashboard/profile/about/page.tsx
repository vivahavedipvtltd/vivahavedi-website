'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import { FileText, Loader2, Save, ArrowLeft } from 'lucide-react';

interface AboutProfileData {
  about_my_self: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const AboutProfilePage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<AboutProfileData>({
    about_my_self: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 1000;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch current profile data
      const profileResponse = await fetch(`${API_BASE_URL}/my-details`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const profileResult = await profileResponse.json();

      if (profileResult.status === 'success') {
        const detailed = profileResult.data.detailed;
        const aboutText = detailed.up_about_myself || '';
        setFormData({
          about_my_self: aboutText,
        });
        setCharCount(aboutText.length);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/profile/about`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('About profile updated successfully!');
        setTimeout(() => {
          router.push('/dashboard?section=my-profile');
        }, 2000);
      } else {
        setError(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('An error occurred while updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length <= maxChars) {
      setFormData({ about_my_self: value });
      setCharCount(value.length);
    }
  };

  if (loading) {
    return (
      <AuthGuard requireAuth={true} redirectTo="/login">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow flex items-center justify-center bg-gray-50">
            <Loader2 className="h-12 w-12 animate-spin text-red-500" />
          </main>
          <Footer />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <div className="min-h-screen flex flex-col">
        <Header />

        <div className="flex-grow flex bg-gray-50">
          <DashboardSidebar
            activeSection="my-profile"
            onSectionChange={(section) => {
              if (section !== 'my-profile') {
                router.push('/dashboard?section=my-profile');
              }
            }}
          />
          <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-red-500" />
                  About Myself
                </h1>
                <button
                  onClick={() => router.push('/dashboard?section=my-profile')}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-5 w-5 mr-1" />
                  Back to Dashboard
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us about yourself
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Write a brief description about yourself. This will help others know you better.
                  </p>

                  <textarea
                    name="about_my_self"
                    value={formData.about_my_self}
                    onChange={handleChange}
                    rows={10}
                    maxLength={maxChars}
                    placeholder="Write about your personality, interests, what you're looking for in a partner, your values, hobbies, career goals, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />

                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">
                      Write a meaningful description to make your profile stand out
                    </p>
                    <p className={`text-sm ${charCount >= maxChars ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                      {charCount} / {maxChars} characters
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Tips for writing a great &quot;About Me&quot;:</h3>
                  <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                    <li>Be honest and authentic</li>
                    <li>Mention your personality traits and values</li>
                    <li>Share your hobbies and interests</li>
                    <li>Describe what you&apos;re looking for in a partner</li>
                    <li>Keep it positive and engaging</li>
                    <li>Avoid sharing sensitive personal information</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard?section=my-profile')}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium flex items-center disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </AuthGuard>
  );
};

export default AboutProfilePage;
