'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardSidebar from '@/components/DashboardSidebar';
import { GraduationCap, Loader2, Save, ArrowLeft } from 'lucide-react';

interface MasterData {
  qualification: Array<{ id: number; name: string; masterId: number }>;
  specialization: Array<{ id: number; name: string }>;
  profession: Array<{ id: number; name: string }>;
  job_status: Array<{ id: number; name: string }>;
}

interface EducationProfileData {
  qualification: number | string;
  spcialization: number | string;
  profession: number | string;
  job_status: string;
  working_in: string;
  working_at: string;
  working_as: string;
  income: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const EducationProfilePage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [masters, setMasters] = useState<MasterData | null>(null);
  const [formData, setFormData] = useState<EducationProfileData>({
    qualification: '',
    spcialization: '',
    profession: '',
    job_status: '',
    working_in: '',
    working_at: '',
    working_as: '',
    income: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch master data
      const mastersResponse = await fetch(`${API_BASE_URL}/masters`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      const mastersResult = await mastersResponse.json();
      if (mastersResult.status === 'success') {
        setMasters(mastersResult.data);
      }

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
          qualification: detailed.qual_id || '',
          spcialization: detailed.speci_id || '',
          profession: detailed.pro_id || '',
          job_status: detailed.up_job_status || detailed.job_status || '',
          working_in: detailed.up_workingin || detailed.up_working_in || '',
          working_at: detailed.up_working_at || detailed.up_company_name || '',
          working_as: detailed.up_working_as || detailed.up_designation || '',
          income: detailed.up_income || detailed.up_annualincome || '',
        });
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
      const requestData = {
        qualification: formData.qualification ? Number(formData.qualification) : null,
        spcialization: formData.spcialization ? Number(formData.spcialization) : null,
        profession: formData.profession ? Number(formData.profession) : null,
        job_status: formData.job_status || null,
        working_in: formData.working_in || null,
        working_at: formData.working_at || null,
        working_as: formData.working_as || null,
        income: formData.income || null,
      };

      const response = await fetch(`${API_BASE_URL}/profile/education`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('Education profile updated successfully!');
        mutate((key: unknown) => Array.isArray(key) && typeof key[0] === 'string' && key[0].endsWith('/my-details'));
        setTimeout(() => {
          router.push('/dashboard?section=my-profile');
        }, 2000);
      } else {
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(', ');
          setError(`Validation error: ${errorMessages}`);
        } else {
          setError(result.message || 'Failed to update profile');
        }
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
      <DashboardLayout centered showFooter={false}>
        <Loader2 className="h-12 w-12 animate-spin text-red-500" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout showFooter={false}>
      <div className="flex-1 flex bg-gray-50 overflow-hidden">
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
                  <GraduationCap className="h-6 w-6 mr-2 text-red-500" />
                  Update Education & Career Profile
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
                {/* Education Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Education Details</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qualification
                      </label>
                      <select
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Select Qualification</option>
                        {masters?.qualification?.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specialization
                      </label>
                      <select
                        name="spcialization"
                        value={formData.spcialization}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Select Specialization</option>
                        {masters?.specialization?.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Career Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Career Details</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profession
                      </label>
                      <select
                        name="profession"
                        value={formData.profession}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Select Profession</option>
                        {masters?.profession?.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Status
                      </label>
                      <select
                        name="job_status"
                        value={formData.job_status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Select Job Status</option>
                        {masters?.job_status?.map((item) => (
                          <option key={item.id} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Employment Details */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Working In (Sector)
                        </label>
                        <input
                          type="text"
                          name="working_in"
                          value={formData.working_in}
                          onChange={handleChange}
                          placeholder="e.g., Private, Government"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Working At (Company)
                        </label>
                        <input
                          type="text"
                          name="working_at"
                          value={formData.working_at}
                          onChange={handleChange}
                          placeholder="Company name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Working As (Designation)
                        </label>
                        <input
                          type="text"
                          name="working_as"
                          value={formData.working_as}
                          onChange={handleChange}
                          placeholder="Your designation"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Annual Income
                        </label>
                        <input
                          type="text"
                          name="income"
                          value={formData.income}
                          onChange={handleChange}
                          placeholder="e.g., 500000"
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
    </DashboardLayout>
  );
};

export default EducationProfilePage;
