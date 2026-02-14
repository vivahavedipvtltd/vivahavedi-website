'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Loader2, Save, ArrowLeft, Users } from 'lucide-react';
import FilterableMultiSelect from '@/components/FilterableMultiSelect';

interface MasterData {
  body_type: Array<{ id: number; name: string }>;
  complexion: Array<{ id: number; name: string }>;
  mother_tongue: Array<{ id: number; name: string }>;
  physical_status: Array<{ id: number; name: string }>;
  marital_status: Array<{ id: number; name: string }>;
}

interface PartnerBasicData {
  upp_age_from: string;
  upp_age_to: string;
  upp_height_from: string;
  upp_height_to: string;
  upp_m_status: string[];
  upp_body_type: string[];
  upp_complexion: string[];
  upp_physical_status: string[];
  upp_mother_tongue: string[];
  upp_res_status: string[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const PartnerBasicUpdatePage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [masters, setMasters] = useState<MasterData | null>(null);
  const [formData, setFormData] = useState<PartnerBasicData>({
    upp_age_from: '',
    upp_age_to: '',
    upp_height_from: '',
    upp_height_to: '',
    upp_m_status: [],
    upp_body_type: [],
    upp_complexion: [],
    upp_physical_status: [],
    upp_mother_tongue: [],
    upp_res_status: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const residenceStatusOptions = ['Citizen', 'Permanent Resident', 'Work Permit', 'Student Visa', 'Temporary Visa'];

  // Age options
  const ageOptions = Array.from({ length: 83 }, (_, i) => i + 18); // 18 to 100

  // Height options in cm with feet/inch display
  const heightOptions = [
    { cm: '121', display: '121 cm (3\'11")' },
    { cm: '122', display: '122 cm (4\'0")' },
    { cm: '124', display: '124 cm (4\'1")' },
    { cm: '127', display: '127 cm (4\'2")' },
    { cm: '129', display: '129 cm (4\'3")' },
    { cm: '132', display: '132 cm (4\'4")' },
    { cm: '134', display: '134 cm (4\'5")' },
    { cm: '137', display: '137 cm (4\'6")' },
    { cm: '139', display: '139 cm (4\'7")' },
    { cm: '142', display: '142 cm (4\'8")' },
    { cm: '144', display: '144 cm (4\'9")' },
    { cm: '147', display: '147 cm (4\'10")' },
    { cm: '149', display: '149 cm (4\'11")' },
    { cm: '152', display: '152 cm (5\'0")' },
    { cm: '154', display: '154 cm (5\'1")' },
    { cm: '157', display: '157 cm (5\'2")' },
    { cm: '160', display: '160 cm (5\'3")' },
    { cm: '162', display: '162 cm (5\'4")' },
    { cm: '165', display: '165 cm (5\'5")' },
    { cm: '167', display: '167 cm (5\'6")' },
    { cm: '170', display: '170 cm (5\'7")' },
    { cm: '172', display: '172 cm (5\'8")' },
    { cm: '175', display: '175 cm (5\'9")' },
    { cm: '177', display: '177 cm (5\'10")' },
    { cm: '180', display: '180 cm (5\'11")' },
    { cm: '182', display: '182 cm (6\'0")' },
    { cm: '185', display: '185 cm (6\'1")' },
    { cm: '188', display: '188 cm (6\'2")' },
    { cm: '190', display: '190 cm (6\'3")' },
    { cm: '193', display: '193 cm (6\'4")' },
    { cm: '195', display: '195 cm (6\'5")' },
    { cm: '198', display: '198 cm (6\'6")' },
    { cm: '200', display: '200 cm (6\'7")' },
    { cm: '203', display: '203 cm (6\'8")' },
    { cm: '205', display: '205 cm (6\'9")' },
    { cm: '208', display: '208 cm (6\'10")' },
    { cm: '210', display: '210 cm (6\'11")' },
    { cm: '213', display: '213 cm (7\'0")' },
    { cm: '215', display: '215 cm (7\'1")' },
    { cm: '218', display: '218 cm (7\'2")' }
  ];

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
          upp_age_from: partner.upp_age_f || partner.upp_age_from || '',
          upp_age_to: partner.upp_age_t || partner.upp_age_to || '',
          upp_height_from: partner.upp_height_f || partner.upp_height_from || '',
          upp_height_to: partner.upp_height_t || partner.upp_height_to || '',
          upp_m_status: Array.isArray(partner.upp_m_status)
            ? partner.upp_m_status
            : (partner.upp_m_status ? partner.upp_m_status.split(',').map((s: string) => s.trim()) : []),
          upp_body_type: Array.isArray(partner.upp_body_type)
            ? partner.upp_body_type
            : (partner.upp_body_type ? partner.upp_body_type.split(',').map((s: string) => s.trim()) : []),
          upp_complexion: Array.isArray(partner.upp_complexion)
            ? partner.upp_complexion
            : (partner.upp_complexion ? partner.upp_complexion.split(',').map((s: string) => s.trim()) : []),
          upp_physical_status: Array.isArray(partner.upp_physical_status)
            ? partner.upp_physical_status
            : (partner.upp_physical_status ? partner.upp_physical_status.split(',').map((s: string) => s.trim()) : []),
          upp_mother_tongue: Array.isArray(partner.upp_mother_tongue)
            ? partner.upp_mother_tongue
            : (partner.upp_mother_tongue ? partner.upp_mother_tongue.split(',').map((s: string) => s.trim()) : []),
          upp_res_status: Array.isArray(partner.upp_res_status)
            ? partner.upp_res_status
            : (partner.upp_res_status ? partner.upp_res_status.split(',').map((s: string) => s.trim()) : []),
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

  const handleMultiSelectChange = (field: keyof PartnerBasicData, value: string) => {
    const fieldValue = formData[field];
    if (Array.isArray(fieldValue)) {
      const newValues = fieldValue.includes(value)
        ? fieldValue.filter((v) => v !== value)
        : [...fieldValue, value];
      setFormData((prev) => ({ ...prev, [field]: newValues }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/profile-updation/partner-basic`, {
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
        setSuccess('Partner basic profile updated successfully!');
        setTimeout(() => {
          router.push('/dashboard?section=partner-preferences');
        }, 2000);
      } else {
        setError(result.message || 'Failed to update partner profile');
      }
    } catch (error) {
      console.error('Error updating partner profile:', error);
      setError('An error occurred while updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout centered showFooter={false}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading partner preferences...</p>
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
                    <Users className="h-6 w-6 mr-2 text-red-500" />
                    Partner Basic Preferences
                  </h1>
                  <p className="text-gray-600 mt-1">Set your ideal partner&apos;s basic criteria</p>
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
                {/* Age Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age From
                    </label>
                    <select
                      value={formData.upp_age_from}
                      onChange={(e) => setFormData({ ...formData, upp_age_from: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Select Age</option>
                      {ageOptions.map((age) => (
                        <option key={age} value={age}>{age} years</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age To
                    </label>
                    <select
                      value={formData.upp_age_to}
                      onChange={(e) => setFormData({ ...formData, upp_age_to: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Select Age</option>
                      {ageOptions.map((age) => (
                        <option key={age} value={age}>{age} years</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Height Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height From
                    </label>
                    <select
                      value={formData.upp_height_from}
                      onChange={(e) => setFormData({ ...formData, upp_height_from: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Select Height</option>
                      {heightOptions.map((height) => (
                        <option key={height.cm} value={height.cm}>{height.display}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height To
                    </label>
                    <select
                      value={formData.upp_height_to}
                      onChange={(e) => setFormData({ ...formData, upp_height_to: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Select Height</option>
                      {heightOptions.map((height) => (
                        <option key={height.cm} value={height.cm}>{height.display}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Marital Status */}
                {masters && (
                  <FilterableMultiSelect
                    label="Marital Status (Select multiple)"
                    options={masters.marital_status}
                    selectedValues={formData.upp_m_status}
                    onChange={(value) => handleMultiSelectChange('upp_m_status', value)}
                    placeholder="Search marital status..."
                  />
                )}

                {/* Body Type */}
                {masters && (
                  <FilterableMultiSelect
                    label="Body Type (Select multiple)"
                    options={masters.body_type}
                    selectedValues={formData.upp_body_type}
                    onChange={(value) => handleMultiSelectChange('upp_body_type', value)}
                    placeholder="Search body type..."
                  />
                )}

                {/* Complexion */}
                {masters && (
                  <FilterableMultiSelect
                    label="Complexion (Select multiple)"
                    options={masters.complexion}
                    selectedValues={formData.upp_complexion}
                    onChange={(value) => handleMultiSelectChange('upp_complexion', value)}
                    placeholder="Search complexion..."
                  />
                )}

                {/* Physical Status */}
                {masters && (
                  <FilterableMultiSelect
                    label="Physical Status (Select multiple)"
                    options={masters.physical_status}
                    selectedValues={formData.upp_physical_status}
                    onChange={(value) => handleMultiSelectChange('upp_physical_status', value)}
                    placeholder="Search physical status..."
                  />
                )}

                {/* Mother Tongue */}
                {masters && (
                  <FilterableMultiSelect
                    label="Mother Tongue (Select multiple)"
                    options={masters.mother_tongue}
                    selectedValues={formData.upp_mother_tongue}
                    onChange={(value) => handleMultiSelectChange('upp_mother_tongue', value)}
                    placeholder="Search language..."
                  />
                )}

                {/* Residence Status */}
                <FilterableMultiSelect
                  label="Residence Status (Select multiple)"
                  options={residenceStatusOptions.map((status, index) => ({ id: index + 1, name: status }))}
                  selectedValues={formData.upp_res_status}
                  onChange={(value) => handleMultiSelectChange('upp_res_status', value)}
                  placeholder="Search residence status..."
                />
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
                      Save Partner Preferences
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

export default PartnerBasicUpdatePage;
