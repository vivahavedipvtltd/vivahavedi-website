'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Religion {
  id: number;
  name: string;
}

interface Caste {
  id: number;
  name: string;
  masterId: number;
}

export default function ReligionMatrimonyPage() {
  const params = useParams();
  const router = useRouter();
  const religionSlug = params.religion as string;

  const [religion, setReligion] = useState<Religion | null>(null);
  const [castes, setCastes] = useState<Caste[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReligionAndCastes();
  }, [religionSlug]);

  const fetchReligionAndCastes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/masters`);
      const data = await response.json();

      if (data.status === 'success') {
        const religions: Religion[] = data.data.religion;
        const allCastes: Caste[] = data.data.caste;

        // Find religion by slug
        const foundReligion = religions.find(
          r => r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === religionSlug
        );

        if (foundReligion) {
          setReligion(foundReligion);
          // Filter castes by religion
          const religionCastes = allCastes.filter(c => c.masterId === foundReligion.id);
          setCastes(religionCastes);
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
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
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-16">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!religion) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-8">The matrimony page you are looking for does not exist.</p>
            <button
              onClick={() => router.push('/')}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Go to Home
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {religion.name} Matrimony
            </h1>
            <p className="text-xl md:text-2xl mb-2">
              Find your perfect {religion.name} life partner
            </p>
            <p className="text-lg opacity-90">
              Browse {religion.name} brides and grooms by community
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About {religion.name} Matrimony
            </h2>
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                Welcome to {religion.name} Matrimony - the most trusted matrimonial platform for {religion.name}
                community. We help {religion.name} brides and grooms find their perfect life partner within
                their preferred community and caste.
              </p>
              <p className="mb-4">
                Our platform hosts thousands of verified {religion.name} profiles from various castes and
                sub-communities. Whether you are looking for a bride or groom, you can find profiles
                that match your preferences and family values.
              </p>
              <p>
                Browse our {religion.name} matrimony profiles by caste below or use our advanced search
                to find your ideal match.
              </p>
            </div>
          </div>
        </section>

        {/* Castes Listing */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Browse {religion.name} Matrimony by Caste
            </h2>

            {castes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {castes.map((caste) => (
                  <Link
                    key={caste.id}
                    href={`/matrimony/${religionSlug}/${createSlug(caste.name)}`}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 text-center border border-gray-200 hover:border-red-500"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-red-600">
                      {caste.name} Matrimony
                    </h3>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">
                  No castes found for {religion.name} matrimony.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Why Choose Our {religion.name} Matrimony Service?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Profiles</h3>
                <p className="text-gray-600">
                  All {religion.name} profiles are thoroughly verified for authenticity
                </p>
              </div>

              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Search</h3>
                <p className="text-gray-600">
                  Find {religion.name} matches by caste, location, education, and more
                </p>
              </div>

              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">100% Privacy</h3>
                <p className="text-gray-600">
                  Your personal details are kept secure and confidential
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-red-600 to-pink-600 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Find Your {religion.name} Life Partner?
            </h2>
            <p className="text-xl text-white opacity-90 mb-8">
              Join thousands of {religion.name} members who found their perfect match
            </p>
            <button
              onClick={() => router.push('/register')}
              className="bg-white text-red-600 hover:bg-gray-100 px-12 py-4 rounded-lg font-bold text-lg transition-colors duration-200 shadow-lg"
            >
              Register Now - It&apos;s Free!
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
