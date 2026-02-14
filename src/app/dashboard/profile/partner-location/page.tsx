'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardSidebar from '@/components/DashboardSidebar';
import { MapPin, Loader2, Save, ArrowLeft, Globe } from 'lucide-react';
import FilterableMultiSelectById from '@/components/FilterableMultiSelectById';

interface MasterDataItem {
  id: number;
  name: string;
  masterId?: number;
}

interface MasterData {
  country: Array<MasterDataItem>;
  state: Array<MasterDataItem & { masterId: number }>;
  district: Array<MasterDataItem & { masterId: number }>;
}

interface PartnerLocationData {
  upp_country: number[];
  upp_state: number[];
  upp_district: number[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const PartnerLocationUpdatePage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [masters, setMasters] = useState<MasterData | null>(null);
  const [formData, setFormData] = useState<PartnerLocationData>({
    upp_country: [],
    upp_state: [],
    upp_district: [],
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

      // Fetch partner profile data
      const partnerResponse = await fetch(`${API_BASE_URL}/partner-profile`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const partnerResult = await partnerResponse.json();
      if (partnerResult.status === 'success' && partnerResult.data) {
        const partner = partnerResult.data;
        setFormData({
          upp_country: partner.upp_country ? partner.upp_country.split('|').map((id: string) => parseInt(id.trim())) : [],
          upp_state: partner.upp_state ? partner.upp_state.split('|').map((id: string) => parseInt(id.trim())) : [],
          upp_district: partner.upp_district ? partner.upp_district.split('|').map((id: string) => parseInt(id.trim())) : [],
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  const handleMultiSelectChange = (field: keyof PartnerLocationData, value: number) => {
    setFormData((prev) => {
      const currentValues = prev[field];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      // If country is changed, clear state and district selection
      if (field === 'upp_country') {
        return { ...prev, [field]: newValues, upp_state: [], upp_district: [] };
      }

      // If state is changed, clear district selection
      if (field === 'upp_state') {
        return { ...prev, [field]: newValues, upp_district: [] };
      }

      return { ...prev, [field]: newValues };
    });
  };

  // Filter states based on selected countries
  const getFilteredStates = () => {
    if (!masters || !masters.state) return [];
    if (formData.upp_country.length === 0) return masters.state;

    return masters.state.filter((state) =>
      formData.upp_country.includes(state.masterId)
    );
  };

  // Filter districts based on selected states
  const getFilteredDistricts = () => {
    if (!masters || !masters.district) return [];
    if (formData.upp_state.length === 0) return masters.district;

    return masters.district.filter((district) =>
      formData.upp_state.includes(district.masterId)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/profile-updation/partner-location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('Partner location preferences updated successfully!');
        setTimeout(() => {
          router.push('/dashboard?section=partner-preferences');
        }, 2000);
      } else {
        setError(result.message || 'Failed to update partner location preferences');
      }
    } catch (error) {
      console.error('Error updating partner location preferences:', error);
      setError('An error occurred while updating preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout centered showFooter={false}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading partner location preferences...</p>
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
                router.push('/dashboard?section=partner-preferences');
              }
            }}
          />
          <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center">
                <button
                  onClick={() => router.push('/dashboard?section=partner-preferences')}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <MapPin className="h-6 w-6 mr-2 text-red-500" />
                    Partner Location Preferences
                  </h1>
                  <p className="text-gray-600 mt-1">Set your ideal partner&apos;s location preferences</p>
                </div>
              </div>
            </div>

            {/* Error/Success Messages */}
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-6">
                {/* Country */}
                {masters && masters.country && (
                  <FilterableMultiSelectById
                    label="Country (Select multiple)"
                    options={masters.country}
                    selectedIds={formData.upp_country}
                    onChange={(id) => handleMultiSelectChange('upp_country', id)}
                    placeholder="Search country..."
                    icon={<Globe className="h-4 w-4 text-red-500" />}
                  />
                )}

                {/* State */}
                {masters && masters.state && (
                  <FilterableMultiSelectById
                    label="State (Select multiple)"
                    options={getFilteredStates()}
                    selectedIds={formData.upp_state}
                    onChange={(id) => handleMultiSelectChange('upp_state', id)}
                    placeholder={formData.upp_country.length === 0 ? "Please select country first..." : "Search state..."}
                    icon={<MapPin className="h-4 w-4 text-red-500" />}
                  />
                )}

                {/* District */}
                {masters && masters.district && (
                  <FilterableMultiSelectById
                    label="District (Select multiple)"
                    options={getFilteredDistricts()}
                    selectedIds={formData.upp_district}
                    onChange={(id) => handleMultiSelectChange('upp_district', id)}
                    placeholder={formData.upp_state.length === 0 ? "Please select state first..." : "Search district..."}
                    icon={<MapPin className="h-4 w-4 text-red-500" />}
                  />
                )}
              </div>

              {/* Submit Buttons */}
              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard?section=partner-preferences')}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Save Location Preferences
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

export default PartnerLocationUpdatePage;
