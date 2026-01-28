'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Religion {
  id: number;
  name: string;
}

interface Caste {
  id: number;
  name: string;
  masterId: number;
}

interface CastesByReligion {
  religion: Religion;
  castes: Caste[];
}

const CasteMatrimonySection = () => {
  const [castesByReligion, setCastesByReligion] = useState<CastesByReligion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCastesAndReligions();
  }, []);

  const fetchCastesAndReligions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/masters`);
      const data = await response.json();

      if (data.status === 'success') {
        const religions: Religion[] = data.data.religion;
        const castes: Caste[] = data.data.caste;

        // Group castes by religion
        const grouped: CastesByReligion[] = religions.map(religion => ({
          religion,
          castes: castes.filter(caste => caste.masterId === religion.id)
        })).filter(group => group.castes.length > 0); // Only show religions that have castes

        setCastesByReligion(grouped);
      } else {
        setError('Failed to load data');
      }
    } catch (err) {
      console.error('Error fetching castes and religions:', err);
      setError('Unable to load data');
    } finally {
      setLoading(false);
    }
  };

  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </section>
    );
  }

  // Always show the section even if there's an error or no data
  if (error) {
    console.error('CasteMatrimonySection error:', error);
    return null;
  }

  if (castesByReligion.length === 0) {
    console.log('CasteMatrimonySection: No data available');
    return null;
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Caste and Matrimony
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find your perfect match based on your community preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {castesByReligion.map((group) => (
            <div
              key={group.religion.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-3">
                {group.religion.name} Matrimony
              </h3>
              <ul className="space-y-2">
                {group.castes.slice(0, 10).map((caste) => (
                  <li key={caste.id}>
                    <Link
                      href={`/matrimony/${createSlug(group.religion.name)}/${createSlug(caste.name)}`}
                      className="text-gray-600 hover:text-red-600 hover:underline transition-colors duration-200 text-sm"
                    >
                      {caste.name} Matrimony
                    </Link>
                  </li>
                ))}
                {group.castes.length > 10 && (
                  <li className="pt-2">
                    <Link
                      href={`/matrimony/${createSlug(group.religion.name)}`}
                      className="text-red-600 font-semibold hover:text-red-700 hover:underline transition-colors duration-200 text-sm"
                    >
                      View all {group.religion.name} castes ({group.castes.length})
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Looking for specific community? Use our advanced search to find profiles matching your preferences.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CasteMatrimonySection;
