'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import Breadcrumb from '@/components/Breadcrumb';
import UserReviews from '@/components/UserReviews';

interface State {
  id: number;
  name: string;
}

interface District {
  id: number;
  name: string;
  masterId: number;
}

const FEATURED_STATE_IDS = [24, 35, 1, 15, 10002, 219];

export default function StateMatrimonyPage() {
  const params = useParams();
  const router = useRouter();
  const stateSlug = params.state as string;

  const [state, setState] = useState<State | null>(null);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStateAndDistricts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/masters`);
      const data = await response.json();

      if (data.status === 'success') {
        const allStates: State[] = data.data.state;
        const allDistricts: District[] = data.data.district;

        // Find state by slug - only from featured states
        const foundState = allStates.find(
          s => FEATURED_STATE_IDS.includes(s.id) &&
               s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === stateSlug
        );

        if (foundState) {
          setState(foundState);
          // Filter districts by state
          const stateDistricts = allDistricts.filter(d => d.masterId === foundState.id);
          setDistricts(stateDistricts);
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [stateSlug]);

  useEffect(() => {
    fetchStateAndDistricts();
  }, [stateSlug, fetchStateAndDistricts]);

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

  if (!state) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-8">The matrimony page you are looking for does not exist.</p>
            <button
              onClick={() => router.push('/matrimony-in')}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Go to Regional Matrimony
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
      <Breadcrumb
        customItems={[
          { label: 'Home', href: '/' },
          { label: 'Matrimony by Region', href: '/matrimony-in' },
          { label: `${state.name} Matrimony`, href: `/matrimony-in/${stateSlug}` },
        ]}
      />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {state.name} Matrimony
            </h1>
            <p className="text-xl md:text-2xl mb-2">
              Find your perfect life partner from {state.name}
            </p>
            <p className="text-lg opacity-90">
              Browse {state.name} brides and grooms by district
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About {state.name} Matrimony
            </h2>
            <div className="prose max-w-none text-gray-600 leading-relaxed">
              <p className="mb-4 text-lg">
                Welcome to {state.name} Matrimony by vivahavedi - your trusted platform for finding the perfect life partner from {state.name}. We connect thousands of {state.name} brides and grooms across all districts, making it easy to find matches who share your regional culture, language, and traditions.
              </p>
              <p className="mb-4">
                Our {state.name} matrimony service helps you find compatible matches from your preferred districts within {state.name}. Whether you&apos;re looking for a bride or groom from major cities or smaller towns, our comprehensive database covers all districts of {state.name}, ensuring you have access to verified profiles from across the state.
              </p>
              <p className="mb-4">
                Understanding the importance of regional compatibility in matrimonial alliances, vivahavedi provides detailed district-wise search options. This helps you connect with matches who not only share your state&apos;s culture but also understand your local traditions, customs, and lifestyle. Finding someone from your region or nearby districts makes family meetings and interactions more convenient and comfortable.
              </p>
              <p className="mb-4">
                Every profile on our {state.name} matrimony platform is thoroughly verified to ensure authenticity and safety. We prioritize your privacy and security, giving you complete control over your profile visibility and contact preferences. Our advanced search filters allow you to search by district, caste, education, profession, and many other criteria to find the most compatible matches.
              </p>
              <p>
                Start your search today by browsing {state.name} matrimony profiles by district below. Use our detailed filters to narrow down your search and find matches that align with your preferences and family values. Join thousands of successful couples who found their life partner through vivahavedi&apos;s {state.name} matrimony service.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Why Choose {state.name} Matrimony?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">All Districts Covered</h3>
                <p className="text-gray-600 text-sm">
                  Access verified profiles from all districts across {state.name}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Regional Culture</h3>
                <p className="text-gray-600 text-sm">
                  Connect with matches who share {state.name}&apos;s culture and traditions
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.018.088A4.984 4.984 0 0120 12c0 3.866-4.477 7-10 7S0 15.866 0 12 4.477 5 10 5c1.662 0 3.218.386 4.582 1.057" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">100% Verified</h3>
                <p className="text-gray-600 text-sm">
                  All {state.name} profiles are thoroughly verified for authenticity and safety
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Advanced Filters</h3>
                <p className="text-gray-600 text-sm">
                  Search by district, caste, education, profession, and 30+ criteria
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* District Listing Section */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Browse {state.name} Matrimony by District
            </h2>

            {districts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {districts.map((district) => (
                  <Link
                    key={district.id}
                    href={`/matrimony-in/${stateSlug}/${createSlug(district.name)}`}
                    className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 p-6 text-center border-2 border-transparent hover:border-red-500 group"
                  >
                    <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-200 transition-colors">
                      <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                      {district.name} Matrimony
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Find matches from {district.name}
                    </p>
                    <span className="inline-block text-red-600 font-medium group-hover:text-red-700 text-sm">
                      Search Profiles →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">
                  Loading districts...
                </p>
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection
          title={`Frequently Asked Questions - ${state.name} Matrimony`}
          faqs={[
            {
              question: `How do I find ${state.name} matrimony profiles?`,
              answer: `Select your preferred district from ${state.name} above to browse verified profiles. You can use advanced search filters to narrow down matches by age, education, profession, caste, and other criteria.`,
            },
            {
              question: `Are ${state.name} matrimony profiles verified?`,
              answer: `Yes, all profiles on our ${state.name} matrimony platform undergo thorough verification to ensure authenticity. We verify contact details, ID proofs, and photos to maintain the highest quality standards.`,
            },
            {
              question: `Can I search across all ${state.name} districts?`,
              answer: `Yes, you can search for matches across all districts of ${state.name}. Our platform covers all major cities and towns across the state, giving you access to a wide range of verified profiles.`,
            },
            {
              question: `Is registration required to view ${state.name} profiles?`,
              answer: `You can browse basic profile information without registration, but creating a free account gives you access to complete profiles, allows you to send interests, and enables direct communication with matches.`,
            },
          ]}
        />

        {/* User Reviews Section */}
        <UserReviews
          title={`Success Stories from ${state.name}`}
          community={`${state.name} Matrimony`}
          reviews={[
            {
              id: 1,
              name: 'Priya & Rajesh',
              location: state.name,
              rating: 5,
              date: '2024-01-15',
              review: `Found our perfect match through ${state.name} matrimony! The district-wise search made it easy to find someone from our region. Highly recommend vivahavedi!`,
            },
            {
              id: 2,
              name: 'Anjali & Vikram',
              location: state.name,
              rating: 5,
              date: '2024-02-20',
              review: `Excellent platform for ${state.name} matrimony. We found each other within months and are now happily married. Thank you vivahavedi!`,
            },
            {
              id: 3,
              name: 'Sneha & Karthik',
              location: state.name,
              rating: 5,
              date: '2024-03-10',
              review: `Best ${state.name} matrimonial service! The verification process gave us confidence, and we found our soulmate quickly. Couldn't be happier!`,
            },
          ]}
        />

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-red-600 to-pink-600 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Find Your {state.name} Match?
            </h2>
            <p className="text-xl text-white opacity-90 mb-8">
              Join thousands of {state.name} members who found their life partner
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
