'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Star, Loader2, Save, ArrowLeft, Users } from 'lucide-react';
import FilterableMultiSelectById from '@/components/FilterableMultiSelectById';

interface MasterDataItem {
  id: number;
  name: string;
  masterId?: number;
}

interface MasterData {
  religion: Array<MasterDataItem>;
  caste: Array<MasterDataItem & { masterId: number }>;
  nakshathra: Array<MasterDataItem>;
}

interface PartnerReligionData {
  upp_relegion: number[];
  upp_caste: number[];
  upp_nakshatra: number[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const PartnerReligionUpdatePage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [masters, setMasters] = useState<MasterData | null>(null);
  const [formData, setFormData] = useState<PartnerReligionData>({
    upp_relegion: [],
    upp_caste: [],
    upp_nakshatra: [],
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
          upp_relegion: partner.upp_relegion ? partner.upp_relegion.split('|').map((id: string) => parseInt(id.trim())) : [],
          upp_caste: partner.upp_caste ? partner.upp_caste.split('|').map((id: string) => parseInt(id.trim())) : [],
          upp_nakshatra: partner.upp_nakshatra ? partner.upp_nakshatra.split('|').map((id: string) => parseInt(id.trim())) : [],
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

  const handleMultiSelectChange = (field: keyof PartnerReligionData, value: number) => {
    setFormData((prev) => {
      const currentValues = prev[field];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      // If religion is changed, clear caste selection
      if (field === 'upp_relegion') {
        return { ...prev, [field]: newValues, upp_caste: [] };
      }

      return { ...prev, [field]: newValues };
    });
  };

  // Filter castes based on selected religions
  const getFilteredCastes = () => {
    if (!masters || !masters.caste) return [];
    if (formData.upp_relegion.length === 0) return masters.caste;

    return masters.caste.filter((caste) =>
      formData.upp_relegion.includes(caste.masterId)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/profile-updation/partner-religion`, {
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
        setSuccess('Partner religion preferences updated successfully!');
        mutate((key: unknown) => Array.isArray(key) && typeof key[0] === 'string' && key[0].endsWith('/partner-profile'));
        setTimeout(() => {
          router.push('/dashboard?section=partner-preferences');
        }, 2000);
      } else {
        setError(result.message || 'Failed to update partner religion preferences');
        setSaving(false);
      }
    } catch (error) {
      console.error('Error updating partner religion preferences:', error);
      setError('An error occurred while updating preferences');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout centered showFooter={false}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading partner religion preferences...</p>
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
                    <Star className="h-6 w-6 mr-2 text-red-500" />
                    Partner Religion & Caste Preferences
                  </h1>
                  <p className="text-gray-600 mt-1">Set your ideal partner&apos;s religious preferences</p>
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
                {/* Religion */}
                {masters && masters.religion && (
                  <FilterableMultiSelectById
                    label="Religion (Select multiple)"
                    options={masters.religion}
                    selectedIds={formData.upp_relegion}
                    onChange={(id) => handleMultiSelectChange('upp_relegion', id)}
                    placeholder="Search religion..."
                    icon={<Star className="h-4 w-4 text-red-500" />}
                  />
                )}

                {/* Caste */}
                {masters && masters.caste && (
                  <FilterableMultiSelectById
                    label="Caste (Select multiple)"
                    options={getFilteredCastes()}
                    selectedIds={formData.upp_caste}
                    onChange={(id) => handleMultiSelectChange('upp_caste', id)}
                    placeholder={formData.upp_relegion.length === 0 ? "Please select religion first..." : "Search caste..."}
                    icon={<Users className="h-4 w-4 text-red-500" />}
                  />
                )}

                {/* Nakshatra */}
                {masters && (
                  <FilterableMultiSelectById
                    label="Nakshatra (Select multiple)"
                    options={masters.nakshathra ?? []}
                    selectedIds={formData.upp_nakshatra}
                    onChange={(id) => handleMultiSelectChange('upp_nakshatra', id)}
                    placeholder="Search nakshatra..."
                    icon={<Star className="h-4 w-4 text-red-500" />}
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
                      Save Religion Preferences
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

export default PartnerReligionUpdatePage;
