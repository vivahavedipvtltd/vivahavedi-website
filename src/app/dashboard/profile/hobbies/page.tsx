'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Heart, Loader2, Save, ArrowLeft, Music, Book, Utensils, Wine, Cigarette } from 'lucide-react';

interface HobbiesData {
  up_hobbies: string[];
  up_music: string[];
  up_reads: string[];
  up_cuisine: string[];
  up_diet: string;
  up_drink: string;
  up_smoke: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const HobbiesUpdatePage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<HobbiesData>({
    up_hobbies: [],
    up_music: [],
    up_reads: [],
    up_cuisine: [],
    up_diet: '',
    up_drink: '',
    up_smoke: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Pre-defined options
  const hobbiesOptions = [
    'Reading', 'Swimming', 'Cooking', 'Traveling', 'Photography',
    'Gardening', 'Painting', 'Dancing', 'Singing', 'Sports',
    'Gaming', 'Writing', 'Yoga', 'Meditation', 'Cycling'
  ];

  const musicOptions = [
    'Classical', 'Jazz', 'Pop', 'Rock', 'Hip Hop',
    'Country', 'Electronic', 'Blues', 'R&B', 'Folk',
    'Devotional', 'Instrumental', 'Film Songs'
  ];

  const readsOptions = [
    'Novels', 'Newspapers', 'Technical Books', 'Magazines',
    'Poetry', 'Biography', 'History', 'Science Fiction',
    'Mystery', 'Romance', 'Self-Help', 'Comics'
  ];

  const cuisineOptions = [
    'Indian', 'Chinese', 'Continental', 'Italian', 'Mexican',
    'Thai', 'Japanese', 'Korean', 'Mediterranean', 'American',
    'Middle Eastern', 'French'
  ];

  const dietOptions = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan'];
  const drinkOptions = ['Yes', 'No', 'Occasionally', 'Socially'];
  const smokeOptions = ['Yes', 'No', 'Occasionally'];

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/my-details`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.status === 'success' && result.data.detailed) {
        const detailed = result.data.detailed;
        setFormData({
          up_hobbies: Array.isArray(detailed.up_hobbies)
            ? detailed.up_hobbies
            : (detailed.up_hobbies ? detailed.up_hobbies.split(',').map((h: string) => h.trim()) : []),
          up_music: Array.isArray(detailed.up_music)
            ? detailed.up_music
            : (detailed.up_music ? detailed.up_music.split(',').map((m: string) => m.trim()) : []),
          up_reads: Array.isArray(detailed.up_reads)
            ? detailed.up_reads
            : (detailed.up_reads ? detailed.up_reads.split(',').map((r: string) => r.trim()) : []),
          up_cuisine: Array.isArray(detailed.up_cuisine)
            ? detailed.up_cuisine
            : (detailed.up_cuisine ? detailed.up_cuisine.split(',').map((c: string) => c.trim()) : []),
          up_diet: detailed.up_diet || '',
          up_drink: detailed.up_drink || '',
          up_smoke: detailed.up_smoke || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchProfileData();
    }
  }, [token, fetchProfileData]);

  const handleMultiSelectChange = (field: keyof Pick<HobbiesData, 'up_hobbies' | 'up_music' | 'up_reads' | 'up_cuisine'>, value: string) => {
    setFormData((prev) => {
      const currentValues = prev[field];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/profile-updation/hobbies`, {
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
        setSuccess('Hobbies profile updated successfully!');
        setTimeout(() => {
          router.push('/dashboard?section=my-profile');
        }, 2000);
      } else {
        setError(result.message || 'Failed to update hobbies profile');
      }
    } catch (error) {
      console.error('Error updating hobbies profile:', error);
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
          <p className="text-gray-600">Loading hobbies profile...</p>
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
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => router.push('/dashboard?section=my-profile')}
                    className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Heart className="h-6 w-6 mr-2 text-red-500" />
                      Update Hobbies & Lifestyle
                    </h1>
                    <p className="text-gray-600 mt-1">Share your interests and lifestyle preferences</p>
                  </div>
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
                {/* Hobbies */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                    <Heart className="h-4 w-4 mr-2 text-red-500" />
                    Hobbies (Select multiple)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {hobbiesOptions.map((hobby) => (
                      <label key={hobby} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.up_hobbies.includes(hobby)}
                          onChange={() => handleMultiSelectChange('up_hobbies', hobby)}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">{hobby}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Music Preferences */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                    <Music className="h-4 w-4 mr-2 text-red-500" />
                    Music Preferences (Select multiple)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {musicOptions.map((music) => (
                      <label key={music} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.up_music.includes(music)}
                          onChange={() => handleMultiSelectChange('up_music', music)}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">{music}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Reading Preferences */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                    <Book className="h-4 w-4 mr-2 text-red-500" />
                    Reading Preferences (Select multiple)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {readsOptions.map((read) => (
                      <label key={read} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.up_reads.includes(read)}
                          onChange={() => handleMultiSelectChange('up_reads', read)}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">{read}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cuisine Preferences */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                    <Utensils className="h-4 w-4 mr-2 text-red-500" />
                    Cuisine Preferences (Select multiple)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {cuisineOptions.map((cuisine) => (
                      <label key={cuisine} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.up_cuisine.includes(cuisine)}
                          onChange={() => handleMultiSelectChange('up_cuisine', cuisine)}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">{cuisine}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Diet, Drink, Smoke */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Utensils className="h-4 w-4 mr-2 text-red-500" />
                      Diet Preference
                    </label>
                    <select
                      value={formData.up_diet}
                      onChange={(e) => setFormData({ ...formData, up_diet: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Select Diet</option>
                      {dietOptions.map((diet) => (
                        <option key={diet} value={diet}>{diet}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Wine className="h-4 w-4 mr-2 text-red-500" />
                      Drinking Habits
                    </label>
                    <select
                      value={formData.up_drink}
                      onChange={(e) => setFormData({ ...formData, up_drink: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Select Option</option>
                      {drinkOptions.map((drink) => (
                        <option key={drink} value={drink}>{drink}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Cigarette className="h-4 w-4 mr-2 text-red-500" />
                      Smoking Habits
                    </label>
                    <select
                      value={formData.up_smoke}
                      onChange={(e) => setFormData({ ...formData, up_smoke: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Select Option</option>
                      {smokeOptions.map((smoke) => (
                        <option key={smoke} value={smoke}>{smoke}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex items-center justify-between">
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
                      Save Hobbies Profile
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

export default HobbiesUpdatePage;
