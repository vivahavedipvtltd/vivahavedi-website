import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Force dynamic rendering for fresh sitemap data
export const dynamic = 'force-dynamic';
export const revalidate = 86400; // Revalidate every 24 hours

export const metadata: Metadata = {
  title: 'Sitemap | vivahavedi - Find Your Perfect Life Partner',
  description: 'Browse our complete sitemap to find all pages on vivahavedi matrimonial website. Discover profiles by religion, caste, location, and more.',
  alternates: {
    canonical: 'https://vivahavedimatrimony.com/sitemap',
  },
  openGraph: {
    title: 'Sitemap | vivahavedi',
    description: 'Browse our complete sitemap to find all pages on vivahavedi matrimonial website.',
    url: 'https://vivahavedimatrimony.com/sitemap',
    siteName: 'vivahavedi',
    type: 'website',
  },
};

interface SitemapData {
  religion: Array<{ id: number; name: string }>;
  caste: Array<{ id: number; name: string; masterId: number }>;
  state: Array<{ id: number; name: string }>;
  district: Array<{ id: number; name: string; masterId: number }>;
}

async function fetchSitemapData(): Promise<SitemapData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    const response = await fetch(`${baseUrl}/masters`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error('Error fetching sitemap data:', error);
    return null;
  }
}

export default async function SitemapPage() {
  const sitemapData = await fetchSitemapData();

  // Organize religions with their castes
  const religionsWithCastes = sitemapData?.religion?.map((religion) => ({
    ...religion,
    castes: sitemapData?.caste?.filter((caste) => caste.masterId === religion.id) || [],
  })) || [];

  // Organize states with their districts
  const statesWithDistricts = sitemapData?.state?.map((state) => ({
    ...state,
    districts: sitemapData?.district?.filter((district) => district.masterId === state.id) || [],
  })) || [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-pink-500 to-rose-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Website Sitemap</h1>
              <p className="text-lg md:text-xl text-pink-100 max-w-2xl mx-auto">
                Navigate through all pages and sections of vivahavedi matrimonial website
              </p>
            </div>
          </div>
        </section>

        {/* Sitemap Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Main Pages */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-pink-500 pb-2">
                Main Pages
              </h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-pink-600 hover:text-pink-700 hover:underline"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about-us"
                    className="text-pink-600 hover:text-pink-700 hover:underline"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact-us"
                    className="text-pink-600 hover:text-pink-700 hover:underline"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/packages"
                    className="text-pink-600 hover:text-pink-700 hover:underline"
                  >
                    Membership Packages
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-pink-600 hover:text-pink-700 hover:underline"
                  >
                    Register Free
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-pink-600 hover:text-pink-700 hover:underline"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search"
                    className="text-pink-600 hover:text-pink-700 hover:underline"
                  >
                    Advanced Search
                  </Link>
                </li>
                <li>
                  <Link
                    href="/public-search-results"
                    className="text-pink-600 hover:text-pink-700 hover:underline"
                  >
                    Browse Profiles
                  </Link>
                </li>
                <li>
                  <Link
                    href="/success-stories"
                    className="text-pink-600 hover:text-pink-700 hover:underline"
                  >
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-pink-600 hover:text-pink-700 hover:underline"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mobile-app"
                    className="text-pink-600 hover:text-pink-700 hover:underline"
                  >
                    Mobile App
                  </Link>
                </li>
              </ul>
            </div>

            {/* Policy Pages */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-pink-500 pb-2">
                Policies & Legal
              </h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-pink-600 hover:text-pink-700 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies/terms-conditions"
                    className="text-pink-600 hover:text-pink-700 hover:underline"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies/cancellation-refund"
                    className="text-pink-600 hover:text-pink-700 hover:underline"
                  >
                    Cancellation & Refund Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies/shipping-policy"
                    className="text-pink-600 hover:text-pink-700 hover:underline"
                  >
                    Shipping Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Matrimony by Religion */}
            <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-pink-500 pb-2">
                Matrimony by Religion & Caste
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {religionsWithCastes.map((religion) => {
                  const religionSlug = religion.name.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <div key={religion.id} className="space-y-2">
                      <Link
                        href={`/matrimony/${religionSlug}`}
                        className="text-lg font-semibold text-pink-700 hover:text-pink-800 hover:underline block"
                      >
                        {religion.name} Matrimony
                      </Link>
                      {religion.castes.length > 0 && (
                        <ul className="ml-4 space-y-1">
                          {religion.castes.slice(0, 10).map((caste) => {
                            const casteSlug = caste.name.toLowerCase().replace(/\s+/g, '-');
                            return (
                              <li key={caste.id}>
                                <Link
                                  href={`/matrimony/${religionSlug}/${casteSlug}`}
                                  className="text-sm text-pink-600 hover:text-pink-700 hover:underline"
                                >
                                  {caste.name} Matrimony
                                </Link>
                              </li>
                            );
                          })}
                          {religion.castes.length > 10 && (
                            <li className="text-sm text-gray-500">
                              +{religion.castes.length - 10} more
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Matrimony by Location */}
            <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-pink-500 pb-2">
                Matrimony by State & District
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statesWithDistricts.map((state) => {
                  const stateSlug = state.name.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <div key={state.id} className="space-y-2">
                      <Link
                        href={`/matrimony-in/${stateSlug}`}
                        className="text-lg font-semibold text-pink-700 hover:text-pink-800 hover:underline block"
                      >
                        {state.name} Matrimony
                      </Link>
                      {state.districts.length > 0 && (
                        <ul className="ml-4 space-y-1">
                          {state.districts.slice(0, 10).map((district) => {
                            const districtSlug = district.name.toLowerCase().replace(/\s+/g, '-');
                            return (
                              <li key={district.id}>
                                <Link
                                  href={`/matrimony-in/${stateSlug}/${districtSlug}`}
                                  className="text-sm text-pink-600 hover:text-pink-700 hover:underline"
                                >
                                  {district.name} Matrimony
                                </Link>
                              </li>
                            );
                          })}
                          {state.districts.length > 10 && (
                            <li className="text-sm text-gray-500">
                              +{state.districts.length - 10} more
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About Our Sitemap</h2>
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                Welcome to the vivahavedi sitemap. This page provides a comprehensive overview of all the pages
                and sections available on our matrimonial website. Use this sitemap to easily navigate through
                different sections and find exactly what you are looking for.
              </p>
              <p className="mb-4">
                vivahavedi offers matrimonial services across all religions, castes, and locations in India.
                Whether you are looking for a Hindu, Muslim, Christian, Sikh, Jain, or Buddhist match, we have
                verified profiles from all communities. Browse by your preferred religion, caste, state, or
                district to find your perfect life partner.
              </p>
              <p>
                Our platform features advanced search filters, verified profiles, secure communication, and
                personalized matchmaking services. Join millions of Indians who have found their soulmate through
                vivahavedi.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg shadow-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Match?</h2>
            <p className="text-lg mb-6">
              Join vivahavedi today and start your journey to find your life partner
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-colors"
              >
                Register Free
              </Link>
              <Link
                href="/search"
                className="bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-800 transition-colors border-2 border-white"
              >
                Browse Profiles
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
