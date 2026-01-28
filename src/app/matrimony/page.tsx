'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import UserReviews from '@/components/UserReviews';

interface Religion {
  id: number;
  name: string;
}

export default function MatrimonyPage() {
  const router = useRouter();
  const [religions, setReligions] = useState<Religion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReligions();
  }, []);

  const fetchReligions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/masters`);
      const data = await response.json();

      if (data.status === 'success') {
        setReligions(data.data.religion || []);
      }
    } catch (err) {
      console.error('Error fetching religions:', err);
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
          { label: 'Matrimony', href: '/matrimony' },
        ]}
      />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Life Partner
            </h1>
            <p className="text-xl md:text-2xl mb-2">
              India&apos;s Most Trusted Matrimonial Service
            </p>
            <p className="text-lg opacity-90 mb-8">
              Browse matrimonial profiles by religion and community
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
              Welcome to vivahavedi Matrimony
            </h2>
            <div className="prose max-w-none text-gray-600 leading-relaxed">
              <p className="mb-4 text-lg text-center max-w-4xl mx-auto">
                vivahavedi is India&apos;s premier matrimonial platform, dedicated to helping you find your perfect life partner. With thousands of verified profiles across all religions, castes, and communities, we make your search for a soulmate simple, secure, and successful.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <p className="mb-4">
                    Our platform is designed to cater to the diverse matrimonial needs of Indian families. Whether you&apos;re looking for a bride or groom from a specific religion, caste, or location, vivahavedi provides you with comprehensive search options and verified profiles to ensure you find the most compatible match.
                  </p>
                  <p className="mb-4">
                    We understand that marriage is one of the most important decisions in life. That&apos;s why we&apos;ve created a safe, trustworthy platform where families can connect with confidence. Every profile on vivahavedi undergoes a thorough verification process, ensuring authenticity and giving you peace of mind.
                  </p>
                </div>
                <div>
                  <p className="mb-4">
                    With advanced search filters, personalized match recommendations, and dedicated customer support, finding your ideal life partner has never been easier. Our platform allows you to search by religion, caste, location, education, profession, income, and many other criteria to help you find someone who truly matches your preferences and family values.
                  </p>
                  <p className="mb-4">
                    Join thousands of happy couples who found their life partner through vivahavedi. Start your journey today by browsing matrimonial profiles by religion below, or register free to create your profile and start receiving compatible match recommendations.
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
              Why Choose vivahavedi Matrimony?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Lakhs of Verified Profiles</h3>
                <p className="text-gray-600 text-sm">
                  Access millions of verified profiles across all religions, castes, and communities in India
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.018.088A4.984 4.984 0 0120 12c0 3.866-4.477 7-10 7S0 15.866 0 12 4.477 5 10 5c1.662 0 3.218.386 4.582 1.057" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">100% Verified Profiles</h3>
                <p className="text-gray-600 text-sm">
                  All profiles are manually verified by our team to ensure authenticity and safety
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Advanced Search Filters</h3>
                <p className="text-gray-600 text-sm">
                  Find matches by religion, caste, location, education, profession, and 30+ other criteria
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Complete Privacy & Security</h3>
                <p className="text-gray-600 text-sm">
                  Your contact details remain private until you choose to share them with matches
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Religion Listing Section */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Browse Matrimony by Religion
            </h2>

            {religions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {religions.map((religion) => (
                  <Link
                    key={religion.id}
                    href={`/matrimony/${createSlug(religion.name)}`}
                    className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 p-8 text-center border-2 border-transparent hover:border-red-500 group"
                  >
                    <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                      {religion.name} Matrimony
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Find your perfect {religion.name} life partner
                    </p>
                    <span className="inline-block text-red-600 font-medium group-hover:text-red-700">
                      Browse Profiles →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">
                  Loading matrimonial services...
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
                Trusted by Millions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">10 Lakh+</div>
                  <p className="text-gray-600">Registered Profiles</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">50,000+</div>
                  <p className="text-gray-600">Success Stories</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">100+</div>
                  <p className="text-gray-600">Communities Covered</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">24/7</div>
                  <p className="text-gray-600">Customer Support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              How vivahavedi Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Register Free</h3>
                <p className="text-gray-600">
                  Create your profile in minutes with basic details and preferences
                </p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Search Matches</h3>
                <p className="text-gray-600">
                  Browse verified profiles by religion, caste, location, and more
                </p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Connect</h3>
                <p className="text-gray-600">
                  Send interests and start conversations with compatible matches
                </p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">4</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Find Love</h3>
                <p className="text-gray-600">
                  Meet your soulmate and start your journey together
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* User Reviews Section */}
        <UserReviews
          title="What Our Members Say"
          community="vivahavedi"
          reviews={[
            {
              id: 1,
              name: 'Priya & Rajesh',
              location: 'Thiruvananthapuram, Kerala',
              rating: 5,
              date: '2024-01-15',
              review: 'vivahavedi helped us find each other across different cities. The platform is user-friendly, secure, and has genuine verified profiles. We connected through the advanced search and found perfect compatibility. Highly recommend to everyone looking for a life partner!',
            },
            {
              id: 2,
              name: 'Anjali & Vikram',
              location: 'Kochi, Kerala',
              rating: 5,
              date: '2024-02-20',
              review: 'Excellent matrimonial service! The detailed profiles and advanced filters made our search so much easier. Customer support was always available to help. We got married last month and couldn\'t be happier. Thank you vivahavedi!',
            },
            {
              id: 3,
              name: 'Sneha & Karthik',
              location: 'Kozhikode, Kerala',
              rating: 5,
              date: '2024-03-10',
              review: 'Best matrimonial platform we\'ve used! The verification process gave us confidence in the profiles. We found our perfect match within 3 months and are now happily married. The privacy features are excellent too!',
            },
            {
              id: 4,
              name: 'Divya & Arun',
              location: 'Thrissur, Kerala',
              rating: 5,
              date: '2023-12-05',
              review: 'We are grateful to vivahavedi for bringing us together! The platform has a great collection of profiles from various communities. The match recommendations were spot-on. Now we\'re happily settled and would recommend this to everyone!',
            },
            {
              id: 5,
              name: 'Pooja & Rahul',
              location: 'Kollam, Kerala',
              rating: 5,
              date: '2024-01-28',
              review: 'Outstanding platform with genuine profiles! Very user-friendly interface and excellent customer service. We appreciated the detailed filtering options that helped us find exactly what we were looking for. Found our soulmate here!',
            },
            {
              id: 6,
              name: 'Neha & Amit',
              location: 'Palakkad, Kerala',
              rating: 5,
              date: '2024-02-14',
              review: 'vivahavedi exceeded our expectations! The profile verification and privacy controls are top-notch. We connected through this platform and got engaged within 6 months. Thank you for this wonderful matrimonial service!',
            },
          ]}
        />

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-red-600 to-pink-600 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Find Your Perfect Match?
            </h2>
            <p className="text-xl text-white opacity-90 mb-8">
              Join lakhs of happy members who found their life partner on vivahavedi
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
