'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Users, Loader2, Save, ArrowLeft } from 'lucide-react';

interface FamilyProfileData {
  family_values: string;
  native_place: string;
  father_name: string;
  father_occupation: string;
  mother_name: string;
  mother_occupation: string;
  brothers: string;
  m_brothers: string;
  sisters: string;
  m_sisters: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const FamilyProfilePage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FamilyProfileData>({
    family_values: '',
    native_place: '',
    father_name: '',
    father_occupation: '',
    mother_name: '',
    mother_occupation: '',
    brothers: '',
    m_brothers: '',
    sisters: '',
    m_sisters: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
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
        setFormData({
          family_values: detailed.up_family_values || '',
          native_place: detailed.up_native || '',
          father_name: detailed.up_father_name || '',
          father_occupation: detailed.up_father_occupation || '',
          mother_name: detailed.up_mother_name || '',
          mother_occupation: detailed.up_mother_occupation || '',
          brothers: detailed.up_brothers || '',
          m_brothers: detailed.up_mbrothers || '',
          sisters: detailed.up_sisters || '',
          m_sisters: detailed.up_msisters || '',
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/profile/family`, {
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
        setSuccess('Family profile updated successfully!');
        setTimeout(() => {
          router.push('/dashboard');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
                router.push('/dashboard');
              }
            }}
          />

          <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Users className="h-6 w-6 mr-2 text-red-500" />
                  Update Family Profile
                </h1>
                <button
                  onClick={() => router.push('/dashboard')}
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
                {/* Family Background */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Family Background</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Family Values
                      </label>
                      <select
                        name="family_values"
                        value={formData.family_values}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Select Family Values</option>
                        <option value="Traditional">Traditional</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Liberal">Liberal</option>
                        <option value="Orthodox">Orthodox</option>
                        <option value="Conservative">Conservative</option>
                        <option value="Progressive">Progressive</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Native Place
                      </label>
                      <input
                        type="text"
                        name="native_place"
                        value={formData.native_place}
                        onChange={handleChange}
                        placeholder="Your hometown"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Parents Details */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Parents Details</h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Father&apos;s Name
                        </label>
                        <input
                          type="text"
                          name="father_name"
                          value={formData.father_name}
                          onChange={handleChange}
                          placeholder="Father's full name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Father&apos;s Occupation
                        </label>
                        <input
                          type="text"
                          name="father_occupation"
                          value={formData.father_occupation}
                          onChange={handleChange}
                          placeholder="Father's profession"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mother&apos;s Name
                        </label>
                        <input
                          type="text"
                          name="mother_name"
                          value={formData.mother_name}
                          onChange={handleChange}
                          placeholder="Mother's full name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mother&apos;s Occupation
                        </label>
                        <input
                          type="text"
                          name="mother_occupation"
                          value={formData.mother_occupation}
                          onChange={handleChange}
                          placeholder="Mother's profession"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Siblings Details */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Siblings Details</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Brothers
                        </label>
                        <input
                          type="text"
                          name="brothers"
                          value={formData.brothers}
                          onChange={handleChange}
                          placeholder="e.g., 1"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Married Brothers
                        </label>
                        <input
                          type="text"
                          name="m_brothers"
                          value={formData.m_brothers}
                          onChange={handleChange}
                          placeholder="e.g., 0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Sisters
                        </label>
                        <input
                          type="text"
                          name="sisters"
                          value={formData.sisters}
                          onChange={handleChange}
                          placeholder="e.g., 1"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Married Sisters
                        </label>
                        <input
                          type="text"
                          name="m_sisters"
                          value={formData.m_sisters}
                          onChange={handleChange}
                          placeholder="e.g., 0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
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

export default FamilyProfilePage;
