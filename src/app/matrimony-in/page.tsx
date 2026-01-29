'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import UserReviews from '@/components/UserReviews';

interface State {
  id: number;
  name: string;
}

const FEATURED_STATE_IDS = [24, 35, 1, 15, 10002, 219]; // Kerala, Tamil Nadu, Karnataka, Andhra Pradesh, Telangana, Maharashtra

export default function MatrimonyByRegionPage() {
  const router = useRouter();
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/masters`);
      const data = await response.json();

      if (data.status === 'success') {
        const allStates: State[] = data.data.state || [];
        // Filter and sort states
        const featuredStates = allStates
          .filter(state => FEATURED_STATE_IDS.includes(state.id))
          .sort((a, b) => FEATURED_STATE_IDS.indexOf(a.id) - FEATURED_STATE_IDS.indexOf(b.id));
        setStates(featuredStates);
      }
    } catch (err) {
      console.error('Error fetching states:', err);
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

  return (
    <>
      <Header />
      <Breadcrumb
        customItems={[
          { label: 'Home', href: '/' },
          { label: 'Matrimony by Region', href: '/matrimony-in' },
        ]}
      />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Match by Region
            </h1>
            <p className="text-xl md:text-2xl mb-2">
              Discover Life Partners from Your Preferred State and District
            </p>
            <p className="text-lg opacity-90 mb-8">
              Browse verified matrimonial profiles from top states across India
            </p>
            <button
              onClick={() => router.push('/register')}
              className="bg-white text-red-600 hover:bg-gray-100 px-12 py-4 rounded-lg font-bold text-lg transition-colors duration-200 shadow-lg"
            >
              Register Free Now
            </button>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Regional Matrimony Services
            </h2>
            <div className="prose max-w-none text-gray-600 leading-relaxed">
              <p className="mb-4 text-lg text-center max-w-4xl mx-auto">
                Find your ideal life partner from your preferred region with vivahavedi Regional Matrimony. We connect you with verified profiles from major states and districts across India, making it easier to find matches who share your regional background, culture, and traditions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <p className="mb-4">
                    Regional preferences play a vital role in Indian matrimonial alliances. vivahavedi understands this importance and offers dedicated regional matrimony services covering major states like Kerala, Tamil Nadu, Karnataka, Andhra Pradesh, Telangana, and Maharashtra. Each state page features profiles from all districts, allowing you to find matches from your specific hometown or nearby areas.
                  </p>
                  <p className="mb-4">
                    Our region-wise matrimonial search helps you connect with brides and grooms who understand your local culture, speak your language, and share similar traditions. Whether you&apos;re looking for a match from metropolitan cities or smaller districts, vivahavedi provides comprehensive coverage across all major regions.
                  </p>
                </div>
                <div>
                  <p className="mb-4">
                    With thousands of verified profiles from each state and district, you can search by specific location preferences along with other criteria like education, profession, caste, and family values. Our advanced filters ensure you find compatible matches who not only share your regional background but also align with your lifestyle and expectations.
                  </p>
                  <p className="mb-4">
                    Start your journey to find a life partner from your preferred region today. Browse our state-wise matrimony pages below, or register free to create your profile and receive personalized match recommendations from your region.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Why Choose Regional Matrimony?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Location-Based Matches</h3>
                <p className="text-gray-600 text-sm">
                  Find matches from your preferred state and district for easier meetings and family connections
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Cultural Compatibility</h3>
                <p className="text-gray-600 text-sm">
                  Connect with profiles that share your regional culture, language, and traditions
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.018.088A4.984 4.984 0 0120 12c0 3.866-4.477 7-10 7S0 15.866 0 12 4.477 5 10 5c1.662 0 3.218.386 4.582 1.057" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Verified Regional Profiles</h3>
                <p className="text-gray-600 text-sm">
                  Access thousands of verified profiles from each state and district
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">District-Level Search</h3>
                <p className="text-gray-600 text-sm">
                  Search at district level for highly specific location-based matches
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* State Listing Section */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Browse Matrimony by State
            </h2>

            {states.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {states.map((state) => (
                  <Link
                    key={state.id}
                    href={`/matrimony-in/${createSlug(state.name)}`}
                    className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 p-8 text-center border-2 border-transparent hover:border-red-500 group"
                  >
                    <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                      {state.name} Matrimony
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Find your perfect match from {state.name}
                    </p>
                    <span className="inline-block text-red-600 font-medium group-hover:text-red-700">
                      Browse by District →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">
                  Loading regional matrimonial services...
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Success Stats Section */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-8 border border-red-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Regional Success Stories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">6</div>
                  <p className="text-gray-600">Major States Covered</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">136+</div>
                  <p className="text-gray-600">Districts Available</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">5 Lakh+</div>
                  <p className="text-gray-600">Regional Profiles</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">25,000+</div>
                  <p className="text-gray-600">Regional Matches</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              How Regional Matrimony Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Select Your State</h3>
                <p className="text-gray-600">
                  Choose from major states like Kerala, Tamil Nadu, Karnataka, and more
                </p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Choose District</h3>
                <p className="text-gray-600">
                  Browse profiles from specific districts within your chosen state
                </p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Filter Matches</h3>
                <p className="text-gray-600">
                  Use advanced filters to find the most compatible regional matches
                </p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">4</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Connect & Meet</h3>
                <p className="text-gray-600">
                  Connect with nearby matches and arrange meetings conveniently
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* User Reviews Section */}
        <UserReviews
          title="Success Stories from Different Regions"
          community="Regional Matrimony"
          reviews={[
            {
              id: 1,
              name: 'Lakshmi & Karthik',
              location: 'Mysore, Karnataka',
              rating: 5,
              date: '2024-01-15',
              review: 'Finding a match from our own district made everything so much easier. We could meet families conveniently and understood each other\'s cultural background perfectly. Thank you vivahavedi for this wonderful regional search feature!',
            },
            {
              id: 2,
              name: 'Meera & Arun',
              location: 'Erode, Tamil Nadu',
              rating: 5,
              date: '2024-02-20',
              review: 'The district-wise search helped us find the perfect match from our hometown. We connected over shared traditions and local culture. This regional matrimony service is truly helpful for finding compatible nearby matches!',
            },
            {
              id: 3,
              name: 'Kavya & Suresh',
              location: 'Vijayawada, Andhra Pradesh',
              rating: 5,
              date: '2024-03-10',
              review: 'We were looking for matches specifically from Andhra Pradesh and vivahavedi made it so simple. Found our perfect match within weeks. The regional filtering saved us a lot of time and effort!',
            },
            {
              id: 4,
              name: 'Deepa & Rajesh',
              location: 'Pune, Maharashtra',
              rating: 5,
              date: '2023-12-05',
              review: 'Excellent regional matrimony service! Being able to search by our specific district helped us find someone who truly understands our local culture and traditions. Now happily married thanks to vivahavedi!',
            },
            {
              id: 5,
              name: 'Priya & Vinod',
              location: 'Warangal, Telangana',
              rating: 5,
              date: '2024-01-28',
              review: 'The state and district-wise search made our search so focused and effective. We found each other through this regional matrimony service and our families are happy we found someone from nearby. Highly recommended!',
            },
            {
              id: 6,
              name: 'Nithya & Ganesh',
              location: 'Calicut, Kerala',
              rating: 5,
              date: '2024-02-14',
              review: 'Being able to search within Kerala and specifically from Calicut district was perfect for us. We wanted someone from our region and vivahavedi delivered exactly that. Thank you for this amazing service!',
            },
          ]}
        />

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-red-600 to-pink-600 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Find Your Regional Match Today
            </h2>
            <p className="text-xl text-white opacity-90 mb-8">
              Connect with verified profiles from your preferred state and district
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
