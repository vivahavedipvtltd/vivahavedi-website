'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardSidebar from '@/components/DashboardSidebar';
import { User, Loader2, Save, ArrowLeft } from 'lucide-react';

interface MasterData {
  body_type: Array<{ id: number; name: string }>;
  complexion: Array<{ id: number; name: string }>;
  mother_tongue: Array<{ id: number; name: string }>;
  personal_values: Array<{ id: number; name: string }>;
  physical_status: Array<{ id: number; name: string }>;
  marital_status: Array<{ id: number; name: string }>;
  created: Array<{ id: number; name: string }>;
}

interface BasicProfileData {
  profile_created: string;
  height: string;
  weight: string;
  marital_status: string;
  children: string;
  body_type: string;
  complexion: string;
  mother_tongue: string;
  personal_values: string;
  physical_status: string;
  eating_habits: string;
  drinking_habits: string;
  smoking_habits: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const BasicProfilePage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [masters, setMasters] = useState<MasterData | null>(null);
  const [formData, setFormData] = useState<BasicProfileData>({
    profile_created: '',
    height: '',
    weight: '',
    marital_status: '',
    children: '',
    body_type: '',
    complexion: '',
    mother_tongue: '',
    personal_values: '',
    physical_status: '',
    eating_habits: '',
    drinking_habits: '',
    smoking_habits: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof BasicProfileData, string>>>({});

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
        // Convert legacy feet.inches format (e.g. "5.6") to cm for consistency
        const normalizeHeight = (h: string): string => {
          if (!h) return '';
          const num = parseFloat(h);
          if (num >= 100) return h; // already cm
          const parts = h.split('.');
          const feet = parseInt(parts[0]);
          const inches = parseInt(parts[1] || '0');
          return String(Math.round(feet * 30.48 + inches * 2.54));
        };
        setFormData({
          profile_created: detailed.up_added_by || '',
          height: normalizeHeight(detailed.up_height || ''),
          weight: detailed.up_body_weight || '',
          marital_status: detailed.up_marital_status || '',
          children: detailed.up_children || 'No',
          body_type: detailed.up_body_type || '',
          complexion: detailed.up_complexion || '',
          mother_tongue: detailed.up_mother_tongue || '',
          personal_values: detailed.up_personal_values || '',
          physical_status: detailed.up_physical_status || '',
          eating_habits: detailed.up_eating_habits || '',
          drinking_habits: detailed.up_drinking_habits || '',
          smoking_habits: detailed.up_smoking_habits || '',
        });
      } else {
        // Handle API errors
        console.error('Profile API Error:', profileResult);
        if (profileResult.errors) {
          const errorMessages = Object.values(profileResult.errors).flat().join(', ');
          setError(`Failed to get profile details: ${errorMessages}`);
        } else {
          setError(`Failed to get profile details: ${profileResult.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load profile data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  const isChildrenVisible =
    formData.marital_status !== '' &&
    formData.marital_status.toLowerCase() !== 'unmarried' &&
    formData.marital_status.toLowerCase() !== 'never married';

  const validate = (): boolean => {
    const errs: Partial<Record<keyof BasicProfileData, string>> = {};

    if (!formData.profile_created) errs.profile_created = 'Profile Created By is required';
    if (!formData.height) errs.height = 'Height is required';
    if (!formData.weight) errs.weight = 'Weight is required';
    if (!formData.marital_status) errs.marital_status = 'Marital Status is required';
    if (isChildrenVisible && !formData.children) errs.children = 'Children is required';
    if (!formData.body_type) errs.body_type = 'Body Type is required';
    if (!formData.complexion) errs.complexion = 'Complexion is required';
    if (!formData.mother_tongue) errs.mother_tongue = 'Mother Tongue is required';
    if (!formData.personal_values) errs.personal_values = 'Personal Values is required';
    if (!formData.physical_status) errs.physical_status = 'Physical Status is required';

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validate()) return;

    setSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/profile/basic`, {
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
        setSuccess('Basic profile updated successfully!');
        mutate((key: unknown) => Array.isArray(key) && typeof key[0] === 'string' && key[0].endsWith('/my-details'));
        setTimeout(() => {
          router.push('/dashboard?section=my-profile');
        }, 2000);
      } else {
        // Handle validation errors
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(', ');
          setError(`Validation error: ${errorMessages}`);
        } else {
          setError(result.message || 'Failed to update profile');
        }
        console.error('API Error:', result);
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
    if (fieldErrors[name as keyof BasicProfileData]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
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
                  <User className="h-6 w-6 mr-2 text-red-500" />
                  Update Basic Profile
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
                {/* Profile Created By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Created By <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="profile_created"
                    value={formData.profile_created}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${fieldErrors.profile_created ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select</option>
                    {masters?.created?.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.profile_created && <p className="mt-1 text-sm text-red-600">{fieldErrors.profile_created}</p>}
                </div>

                {/* Height & Weight */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${fieldErrors.height ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select Height</option>
                      <option value="122">4&apos;0&quot; (122 cm)</option>
                      <option value="124">4&apos;1&quot; (124 cm)</option>
                      <option value="127">4&apos;2&quot; (127 cm)</option>
                      <option value="130">4&apos;3&quot; (130 cm)</option>
                      <option value="132">4&apos;4&quot; (132 cm)</option>
                      <option value="135">4&apos;5&quot; (135 cm)</option>
                      <option value="137">4&apos;6&quot; (137 cm)</option>
                      <option value="140">4&apos;7&quot; (140 cm)</option>
                      <option value="142">4&apos;8&quot; (142 cm)</option>
                      <option value="145">4&apos;9&quot; (145 cm)</option>
                      <option value="147">4&apos;10&quot; (147 cm)</option>
                      <option value="150">4&apos;11&quot; (150 cm)</option>
                      <option value="152">5&apos;0&quot; (152 cm)</option>
                      <option value="155">5&apos;1&quot; (155 cm)</option>
                      <option value="157">5&apos;2&quot; (157 cm)</option>
                      <option value="160">5&apos;3&quot; (160 cm)</option>
                      <option value="163">5&apos;4&quot; (163 cm)</option>
                      <option value="165">5&apos;5&quot; (165 cm)</option>
                      <option value="168">5&apos;6&quot; (168 cm)</option>
                      <option value="170">5&apos;7&quot; (170 cm)</option>
                      <option value="173">5&apos;8&quot; (173 cm)</option>
                      <option value="175">5&apos;9&quot; (175 cm)</option>
                      <option value="178">5&apos;10&quot; (178 cm)</option>
                      <option value="180">5&apos;11&quot; (180 cm)</option>
                      <option value="183">6&apos;0&quot; (183 cm)</option>
                      <option value="185">6&apos;1&quot; (185 cm)</option>
                      <option value="188">6&apos;2&quot; (188 cm)</option>
                      <option value="191">6&apos;3&quot; (191 cm)</option>
                      <option value="193">6&apos;4&quot; (193 cm)</option>
                      <option value="196">6&apos;5&quot; (196 cm)</option>
                      <option value="198">6&apos;6&quot; (198 cm)</option>
                      <option value="201">6&apos;7&quot; (201 cm)</option>
                      <option value="203">6&apos;8&quot; (203 cm)</option>
                      <option value="206">6&apos;9&quot; (206 cm)</option>
                      <option value="208">6&apos;10&quot; (208 cm)</option>
                      <option value="211">6&apos;11&quot; (211 cm)</option>
                      <option value="213">7&apos;0&quot; (213 cm)</option>
                    </select>
                    {fieldErrors.height && <p className="mt-1 text-sm text-red-600">{fieldErrors.height}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (in kg) <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${fieldErrors.weight ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select Weight</option>
                      {Array.from({ length: 101 }, (_, i) => i + 40).map((kg) => (
                        <option key={kg} value={kg.toString()}>
                          {kg} kg
                        </option>
                      ))}
                    </select>
                    {fieldErrors.weight && <p className="mt-1 text-sm text-red-600">{fieldErrors.weight}</p>}
                  </div>
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="marital_status"
                    value={formData.marital_status}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${fieldErrors.marital_status ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select</option>
                    {masters?.marital_status?.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.marital_status && <p className="mt-1 text-sm text-red-600">{fieldErrors.marital_status}</p>}
                </div>

                {/* Children - Only show if not unmarried */}
                {isChildrenVisible && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Children <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="children"
                      value={formData.children}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${fieldErrors.children ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select</option>
                      <option value="No">No</option>
                      <option value="1">1 Child</option>
                      <option value="2">2 Children</option>
                      <option value="3">3 Children</option>
                      <option value="4">4 Children</option>
                      <option value="5">5 Children</option>
                      <option value="6">6 Children</option>
                      <option value="More than 6">More than 6</option>
                    </select>
                    {fieldErrors.children && <p className="mt-1 text-sm text-red-600">{fieldErrors.children}</p>}
                  </div>
                )}

                {/* Body Type & Complexion */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Body Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="body_type"
                      value={formData.body_type}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${fieldErrors.body_type ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select</option>
                      {masters?.body_type?.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.body_type && <p className="mt-1 text-sm text-red-600">{fieldErrors.body_type}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complexion <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="complexion"
                      value={formData.complexion}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${fieldErrors.complexion ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select</option>
                      {masters?.complexion?.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.complexion && <p className="mt-1 text-sm text-red-600">{fieldErrors.complexion}</p>}
                  </div>
                </div>

                {/* Mother Tongue & Personal Values */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mother Tongue <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="mother_tongue"
                      value={formData.mother_tongue}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${fieldErrors.mother_tongue ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select</option>
                      {masters?.mother_tongue?.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.mother_tongue && <p className="mt-1 text-sm text-red-600">{fieldErrors.mother_tongue}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Personal Values <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="personal_values"
                      value={formData.personal_values}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${fieldErrors.personal_values ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select</option>
                      {masters?.personal_values?.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.personal_values && <p className="mt-1 text-sm text-red-600">{fieldErrors.personal_values}</p>}
                  </div>
                </div>

                {/* Physical Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Physical Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="physical_status"
                    value={formData.physical_status}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${fieldErrors.physical_status ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select</option>
                    {masters?.physical_status?.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.physical_status && <p className="mt-1 text-sm text-red-600">{fieldErrors.physical_status}</p>}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
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

export default BasicProfilePage;
