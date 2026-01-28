'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import Breadcrumb from '@/components/Breadcrumb';
import UserReviews from '@/components/UserReviews';

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
      <Breadcrumb
        customItems={[
          { label: 'Home', href: '/' },
          { label: 'Matrimony', href: '/matrimony' },
          { label: `${religion.name} Matrimony`, href: `/matrimony/${religionSlug}` },
        ]}
      />
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
            <div className="prose max-w-none text-gray-600 leading-relaxed">
              <p className="mb-4 text-lg">
                Welcome to {religion.name} Matrimony by vivahavedi - the most trusted and comprehensive
                matrimonial platform dedicated to helping {religion.name} brides and grooms find their
                perfect life partner. With thousands of verified profiles and a commitment to traditional
                values, we make finding your soulmate within the {religion.name} community simple and secure.
              </p>
              <p className="mb-4">
                Our {religion.name} matrimony service is designed specifically for families and individuals
                who value their cultural heritage and religious traditions. We understand the importance of
                finding a compatible match who shares your beliefs, values, and family background. That&apos;s why
                our platform offers detailed profile filtering by caste, subcaste, location, education,
                profession, and lifestyle preferences.
              </p>
              <p className="mb-4">
                With over thousands of active {religion.name} profiles across various castes and sub-communities,
                vivahavedi provides you with a wide range of options to find someone who truly complements your
                life goals and aspirations. Whether you&apos;re searching for a bride or groom, our advanced matchmaking
                algorithms and personalized recommendations help you connect with the most compatible matches.
              </p>
              <p className="mb-4">
                Every profile on our {religion.name} matrimony platform undergoes a thorough verification process
                to ensure authenticity and safety. We prioritize your privacy and security, giving you complete
                control over who can view your profile and contact you. Our dedicated customer support team is
                always ready to assist you throughout your matchmaking journey.
              </p>
              <p>
                Start your search today by browsing {religion.name} matrimony profiles by caste below, or use
                our advanced search filters to find matches based on specific criteria. Join thousands of
                successful couples who found their life partner through vivahavedi&apos;s {religion.name} matrimony service.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Why Choose vivahavedi for {religion.name} Matrimony?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Thousands of Profiles</h3>
                <p className="text-gray-600 text-sm">
                  Access a vast database of verified {religion.name} brides and grooms across all castes
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
                  All {religion.name} profiles are manually verified to ensure authenticity and safety
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
                  Search by caste, location, education, profession, and 20+ other criteria
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Complete Privacy</h3>
                <p className="text-gray-600 text-sm">
                  Your contact details remain private until you choose to share them
                </p>
              </div>
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

        {/* User Reviews Section */}
        <UserReviews
          title={`Success Stories - ${religion.name} Matrimony`}
          community={religion.name}
          reviews={[
            {
              id: 1,
              name: 'Priya & Rahul',
              location: 'Thiruvananthapuram, Kerala',
              rating: 5,
              date: '2024-01-15',
              review: `We found each other on vivahavedi ${religion.name} matrimony and couldn't be happier! The platform made it so easy to connect with compatible matches from our community. The verification process gave us confidence that profiles were genuine. Highly recommend to anyone looking for a life partner!`,
            },
            {
              id: 2,
              name: 'Anjali & Vikram',
              location: 'Kochi, Kerala',
              rating: 5,
              date: '2024-02-20',
              review: `Excellent ${religion.name} matrimony service! The advanced search filters helped us find exactly what we were looking for. Customer support was very helpful throughout our journey. We got married last month and are grateful to vivahavedi for bringing us together.`,
            },
            {
              id: 3,
              name: 'Sneha & Amit',
              location: 'Kozhikode, Kerala',
              rating: 5,
              date: '2024-03-10',
              review: `Best ${religion.name} matrimonial site we've used. The detailed profiles and privacy features are excellent. We connected through this platform and found our perfect match within 3 months. Thank you vivahavedi for making our dreams come true!`,
            },
            {
              id: 4,
              name: 'Pooja & Karan',
              location: 'Thrissur, Kerala',
              rating: 5,
              date: '2023-12-05',
              review: `We are so thankful to vivahavedi for helping us find each other. The ${religion.name} matrimony section has a great collection of verified profiles. The match recommendations were spot-on. Now we're happily married and would recommend this to everyone!`,
            },
            {
              id: 5,
              name: 'Divya & Arun',
              location: 'Kollam, Kerala',
              rating: 5,
              date: '2024-01-28',
              review: `Outstanding platform for ${religion.name} matrimony! Very user-friendly interface and genuine profiles. We appreciated the detailed filtering options and privacy controls. Found our soulmate here and couldn't be more satisfied with the service.`,
            },
            {
              id: 6,
              name: 'Neha & Rohan',
              location: 'Alappuzha, Kerala',
              rating: 5,
              date: '2024-02-14',
              review: `vivahavedi ${religion.name} matrimony exceeded our expectations! The profile verification and customer support are top-notch. We connected through this platform and got engaged within 6 months. Thank you for this wonderful service!`,
            },
          ]}
        />

        {/* FAQ Section */}
        <FAQSection
          title={`Frequently Asked Questions - ${religion.name} Matrimony`}
          faqs={[
            {
              question: `How do I register on ${religion.name} Matrimony?`,
              answer: `Registration is simple and free! Click on the "Register Now" button, fill in your basic details, create a profile with your preferences, and start browsing ${religion.name} matches immediately. Our step-by-step process takes just 5 minutes to complete.`,
            },
            {
              question: `Is vivahavedi ${religion.name} Matrimony safe and secure?`,
              answer: `Yes, absolutely! We take your privacy and security very seriously. All ${religion.name} profiles are manually verified by our team. Your contact details remain private until you choose to share them. We use industry-standard encryption to protect your personal information.`,
            },
            {
              question: `How can I search for ${religion.name} brides or grooms by caste?`,
              answer: `You can browse ${religion.name} profiles by caste using the sections above. Simply click on any caste category to view profiles from that community. You can also use our advanced search filters to narrow down matches by caste, subcaste, location, education, and more.`,
            },
            {
              question: `Is the ${religion.name} Matrimony service free?`,
              answer: `Yes, registration and basic profile browsing are completely free. You can create your profile, search for matches, and view profile summaries at no cost. Premium membership plans offer additional features like unlimited messaging, advanced filters, and priority customer support.`,
            },
            {
              question: `How many ${religion.name} profiles are registered on vivahavedi?`,
              answer: `We have thousands of verified ${religion.name} brides and grooms registered across various castes and locations in India and abroad. New profiles are added daily, giving you fresh matches regularly.`,
            },
            {
              question: `Can I search for ${religion.name} matches from specific locations?`,
              answer: `Yes, our advanced search allows you to filter ${religion.name} profiles by state, district, city, and even country. Whether you're looking for matches in your hometown or in a specific region, our location-based search makes it easy to find compatible partners nearby or anywhere in the world.`,
            },
          ]}
        />

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
