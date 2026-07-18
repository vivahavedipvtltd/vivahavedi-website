'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Globe, Loader2, Save, ArrowLeft, MapPin, Users, Phone } from 'lucide-react';

interface MasterItem {
  id: number;
  name: string;
  masterId?: number;
}

interface MasterData {
  country: MasterItem[];
  state: Array<MasterItem & { masterId: number }>;
  district: Array<MasterItem & { masterId: number }>;
}

interface FormData {
  country: string;
  state: string;
  district: string;
  location: string;
  address: string;
}

interface LocationItem {
  id: number;
  name: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const ReligionLocationPage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [masters, setMasters] = useState<MasterData | null>(null);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Read-only religion/caste display values
  const [relName, setRelName] = useState('');
  const [casteName, setCasteName] = useState('');

  const [formData, setFormData] = useState<FormData>({
    country: '',
    state: '',
    district: '',
    location: '',
    address: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const fetchLocations = useCallback(async (districtId: string) => {
    if (!districtId) {
      setLocations([]);
      return;
    }
    try {
      setLoadingLocations(true);
      const res = await fetch(`${API_BASE_URL}/masters/locations?district_id=${districtId}`, {
        headers: { Accept: 'application/json' },
      });
      const result = await res.json();
      if (result.status === 'success') {
        setLocations(result.data);
      }
    } catch {
      setLocations([]);
    } finally {
      setLoadingLocations(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [mastersRes, profileRes] = await Promise.all([
        fetch(`${API_BASE_URL}/masters`, { headers: { Accept: 'application/json' } }),
        fetch(`${API_BASE_URL}/my-details`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
        }),
      ]);

      const mastersResult = await mastersRes.json();
      if (mastersResult.status === 'success') {
        setMasters(mastersResult.data);
      }

      const profileResult = await profileRes.json();
      if (profileResult.status === 'success') {
        const basic = profileResult.data.basic;
        setRelName(basic.rel_name || '');
        setCasteName(basic.caste_name || '');
        const districtId = basic.dist_id ? String(basic.dist_id) : '';
        setFormData({
          country: basic.con_id ? String(basic.con_id) : '',
          state: basic.state_id ? String(basic.state_id) : '',
          district: districtId,
          location: basic.lpo_id ? String(basic.lpo_id) : '',
          address: basic.user_address || '',
        });
        if (districtId) {
          await fetchLocations(districtId);
        }
      } else {
        setError('Failed to load profile data.');
      }
    } catch {
      setError('Failed to load data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [token, fetchLocations]);

  useEffect(() => {
    if (token) fetchData();
  }, [token, fetchData]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'country') {
      setFormData(prev => ({ ...prev, country: value, state: '', district: '', location: '' }));
      setLocations([]);
    } else if (name === 'state') {
      setFormData(prev => ({ ...prev, state: value, district: '', location: '' }));
      setLocations([]);
    } else if (name === 'district') {
      setFormData(prev => ({ ...prev, district: value, location: '' }));
      if (value) await fetchLocations(value);
      else setLocations([]);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (fieldErrors[name as keyof FormData]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!formData.country) errs.country = 'Country is required';
    if (!formData.state) errs.state = 'State is required';
    if (!formData.district) errs.district = 'District is required';
    if (!formData.location) errs.location = 'Location is required';
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
      const response = await fetch(`${API_BASE_URL}/profile/location`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          country: parseInt(formData.country),
          state: parseInt(formData.state),
          district: parseInt(formData.district),
          location: parseInt(formData.location),
          address: formData.address,
        }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('Religion & Location updated successfully!');
        mutate((key: unknown) =>
          Array.isArray(key) && typeof key[0] === 'string' && key[0].endsWith('/my-details')
        );
        setTimeout(() => {
          router.push('/dashboard?section=my-profile');
        }, 2000);
      } else {
        if (result.errors) {
          const msgs = Object.values(result.errors).flat().join(', ');
          setError(`Validation error: ${msgs}`);
        } else {
          setError(result.message || 'Failed to update location');
        }
        setSaving(false);
      }
    } catch {
      setError('An error occurred while updating. Please try again.');
      setSaving(false);
    }
  };

  const filteredStates = masters?.state?.filter(s =>
    !formData.country || s.masterId === parseInt(formData.country)
  ) ?? [];

  const filteredDistricts = masters?.district?.filter(d =>
    !formData.state || d.masterId === parseInt(formData.state)
  ) ?? [];

  if (loading) {
    return (
      <DashboardLayout centered showFooter={false}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
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

            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center">
                <button
                  onClick={() => router.push('/dashboard?section=my-profile')}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Globe className="h-6 w-6 mr-2 text-teal-500" />
                    Update Religion &amp; Location
                  </h1>
                  <p className="text-gray-600 mt-1">Manage your faith and residential details</p>
                </div>
              </div>
            </div>

            {/* Error/Success */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Religion & Caste — read-only */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-teal-500" />
                  Religion &amp; Caste
                </h2>

                {/* Info banner */}
                <div className="flex items-start space-x-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-5">
                  <Phone className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-800">
                    Religion and Caste cannot be changed online. Please{' '}
                    <strong>call our staff</strong> to update your Religion or Caste details.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Religion</label>
                    <input
                      type="text"
                      value={relName || 'N/A'}
                      disabled
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Caste</label>
                    <input
                      type="text"
                      value={casteName || 'N/A'}
                      disabled
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-teal-500" />
                  Location Details
                </h2>

                <div className="space-y-5">
                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${fieldErrors.country ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select Country</option>
                      {masters?.country?.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </select>
                    {fieldErrors.country && <p className="mt-1 text-sm text-red-600">{fieldErrors.country}</p>}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      disabled={!formData.country}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${fieldErrors.state ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">{formData.country ? 'Select State' : 'Select Country first'}</option>
                      {filteredStates.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </select>
                    {fieldErrors.state && <p className="mt-1 text-sm text-red-600">{fieldErrors.state}</p>}
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      disabled={!formData.state}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${fieldErrors.district ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">{formData.state ? 'Select District' : 'Select State first'}</option>
                      {filteredDistricts.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </select>
                    {fieldErrors.district && <p className="mt-1 text-sm text-red-600">{fieldErrors.district}</p>}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!formData.district || loadingLocations}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${fieldErrors.location ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">
                        {loadingLocations
                          ? 'Loading locations...'
                          : formData.district
                          ? 'Select Location'
                          : 'Select District first'}
                      </option>
                      {locations.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </select>
                    {fieldErrors.location && <p className="mt-1 text-sm text-red-600">{fieldErrors.location}</p>}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter your address"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard?section=my-profile')}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
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
        </main>
      </div>
    </DashboardLayout>
  );
};

export default ReligionLocationPage;
