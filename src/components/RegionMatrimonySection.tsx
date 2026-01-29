'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface State {
  id: number;
  name: string;
}

interface District {
  id: number;
  name: string;
  masterId: number;
}

interface DistrictsByState {
  state: State;
  districts: District[];
}

const FEATURED_STATE_IDS = [24, 35, 1, 15, 10002, 219]; // Kerala, Tamil Nadu, Karnataka, Andhra Pradesh, Telangana, Maharashtra

const RegionMatrimonySection = () => {
  const [districtsByState, setDistrictsByState] = useState<DistrictsByState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatesAndDistricts();
  }, []);

  const fetchStatesAndDistricts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/masters`);
      const data = await response.json();

      if (data.status === 'success') {
        const allStates: State[] = data.data.state;
        const allDistricts: District[] = data.data.district;

        // Filter to only show featured states
        const featuredStates = allStates.filter(state =>
          FEATURED_STATE_IDS.includes(state.id)
        );

        // Sort states by the order in FEATURED_STATE_IDS
        featuredStates.sort((a, b) => {
          return FEATURED_STATE_IDS.indexOf(a.id) - FEATURED_STATE_IDS.indexOf(b.id);
        });

        // Group districts by state
        const grouped: DistrictsByState[] = featuredStates.map(state => ({
          state,
          districts: allDistricts.filter(district => district.masterId === state.id)
        })).filter(group => group.districts.length > 0);

        setDistrictsByState(grouped);
      } else {
        setError('Failed to load data');
      }
    } catch (err) {
      console.error('Error fetching states and districts:', err);
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

  if (error) {
    console.error('RegionMatrimonySection error:', error);
    return null;
  }

  if (districtsByState.length === 0) {
    console.log('RegionMatrimonySection: No data available');
    return null;
  }

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Region Matrimony
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find your perfect match from your preferred state and district
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {districtsByState.map((group) => (
            <div
              key={group.state.id}
              className="bg-gray-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-3">
                {group.state.name} Matrimony
              </h3>
              <ul className="space-y-2">
                {group.districts.slice(0, 10).map((district) => (
                  <li key={district.id}>
                    <Link
                      href={`/matrimony-in/${createSlug(group.state.name)}/${createSlug(district.name)}`}
                      className="text-gray-600 hover:text-red-600 hover:underline transition-colors duration-200 text-sm"
                    >
                      {district.name} Matrimony
                    </Link>
                  </li>
                ))}
                {group.districts.length > 10 && (
                  <li className="pt-2">
                    <Link
                      href={`/matrimony-in/${createSlug(group.state.name)}`}
                      className="text-red-600 font-semibold hover:text-red-700 hover:underline transition-colors duration-200 text-sm"
                    >
                      View all {group.state.name} districts ({group.districts.length})
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Looking for matches in a specific region? Browse by state and district to find your perfect match nearby.
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegionMatrimonySection;
