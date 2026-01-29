import { lazy, Suspense } from 'react';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import HeroSection from '@/components/HeroSection';
import BackToTop from '@/components/BackToTop';
import ClientScrollManager from '@/components/ClientScrollManager';
import ErrorBoundary from '@/components/ErrorBoundary';
import SectionErrorFallback from '@/components/SectionErrorFallback';

// Skeleton Loaders
import SectionSkeleton from '@/components/skeletons/SectionSkeleton';

// Critical sections - NO lazy loading (above the fold)
import SearchSection from '@/components/SearchSection';
import FeaturedProfiles from '@/components/FeaturedProfiles';

// Important sections - Lazy load with high priority (near the fold)
const FindSpecialSomeone = lazy(() => import('@/components/FindSpecialSomeone'));
const WhyChooseUs = lazy(() => import('@/components/WhyChooseUs'));

// Secondary sections - Lazy load with normal priority (below the fold)
const SuccessStories = lazy(() => import('@/components/SuccessStories'));
const MobileAppDownload = lazy(() => import('@/components/MobileAppDownload'));
const FAQ = lazy(() => import('@/components/FAQ'));

// Tertiary sections - Lazy load with low priority (far below the fold)
const CasteMatrimonySection = lazy(() => import('@/components/CasteMatrimonySection'));
const RegionMatrimonySection = lazy(() => import('@/components/RegionMatrimonySection'));

export default function Home() {
  // Comprehensive Structured Data for Landing Page (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      // WebPage Schema
      {
        '@type': 'WebPage',
        '@id': 'https://vivahavedimatrimony.com/#webpage',
        url: 'https://vivahavedimatrimony.com',
        name: 'vivahavedi - Find Your Perfect Life Partner | Indian Matrimonial Site',
        description: 'Discover your ideal life partner on vivahavedi, a trusted Indian matrimonial platform. Browse verified profiles, connect with compatible matches, and find your soulmate today.',
        isPartOf: {
          '@id': 'https://vivahavedimatrimony.com/#website',
        },
        about: {
          '@id': 'https://vivahavedimatrimony.com/#organization',
        },
        breadcrumb: {
          '@id': 'https://vivahavedimatrimony.com/#breadcrumb',
        },
        inLanguage: 'en-US',
        potentialAction: {
          '@type': 'ReadAction',
          target: ['https://vivahavedimatrimony.com'],
        },
      },
      // BreadcrumbList Schema
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://vivahavedimatrimony.com/#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://vivahavedimatrimony.com',
          },
        ],
      },
      // WebSite Schema with SearchAction
      {
        '@type': 'WebSite',
        '@id': 'https://vivahavedimatrimony.com/#website',
        url: 'https://vivahavedimatrimony.com',
        name: 'vivahavedi',
        description: 'India\'s most trusted matrimonial platform helping millions find their perfect life partner.',
        publisher: {
          '@id': 'https://vivahavedimatrimony.com/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://vivahavedimatrimony.com/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
        inLanguage: 'en-US',
      },
      // Organization Schema
      {
        '@type': 'Organization',
        '@id': 'https://vivahavedimatrimony.com/#organization',
        name: 'vivahavedi',
        legalName: 'vivahavedi Matrimonial Services',
        url: 'https://vivahavedimatrimony.com',
        logo: {
          '@type': 'ImageObject',
          '@id': 'https://vivahavedimatrimony.com/#logo',
          url: 'https://vivahavedimatrimony.com/apple-touch-icon.png',
          contentUrl: 'https://vivahavedimatrimony.com/apple-touch-icon.png',
          caption: 'vivahavedi Logo',
          inLanguage: 'en-US',
          width: 180,
          height: 180,
        },
        image: {
          '@id': 'https://vivahavedimatrimony.com/#logo',
        },
        description: 'India\'s most trusted matrimonial service helping millions find their perfect life partner. With 10M+ verified profiles, 50,000+ success stories, and 15+ years of excellence.',
        foundingDate: '2009',
        slogan: 'Find Your Perfect Match',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IN',
          addressRegion: 'India',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            availableLanguage: ['English', 'Hindi', 'Malayalam', 'Tamil', 'Telugu', 'Kannada'],
            areaServed: 'IN',
          },
        ],
        sameAs: [
          'https://www.facebook.com/vivahavedi',
          'https://twitter.com/vivahavedi',
          'https://www.instagram.com/vivahavedi',
          'https://www.linkedin.com/company/vivahavedi',
          'https://www.youtube.com/@vivahavedi',
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '50000',
          bestRating: '5',
          worstRating: '1',
        },
      },
      // Service Schema
      {
        '@type': 'Service',
        '@id': 'https://vivahavedimatrimony.com/#service',
        name: 'Matrimonial Services',
        description: 'Comprehensive matrimonial services helping individuals find their perfect life partner across all religions, castes, and communities in India.',
        provider: {
          '@id': 'https://vivahavedimatrimony.com/#organization',
        },
        serviceType: 'Matrimonial Service',
        areaServed: {
          '@type': 'Country',
          name: 'India',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Matrimonial Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Profile Registration',
                description: 'Create your matrimonial profile for free',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Partner Search',
                description: 'Advanced search to find compatible matches',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Premium Membership',
                description: 'Unlimited contact details and priority listing',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Matchmaking Assistance',
                description: 'Personalized matchmaking by relationship managers',
              },
            },
          ],
        },
        audience: {
          '@type': 'PeopleAudience',
          suggestedMinAge: 18,
          suggestedMaxAge: 70,
        },
      },
      // FAQPage Schema
      {
        '@type': 'FAQPage',
        '@id': 'https://vivahavedimatrimony.com/#faqpage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How can I register my profile on vivahavedi?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Registration is simple and free! Click on "Register Free" button, fill in your basic details like name, email, phone number, and create a password. You\'ll receive a verification email or SMS to confirm your account. Once verified, you can complete your detailed profile with photos and preferences.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is a User ID? Is it important?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A User ID is your unique identifier on vivahavedi that allows other members to find and connect with you. It\'s automatically generated during registration but you can customize it later. Having a memorable User ID makes it easier for potential matches to search and remember your profile.',
            },
          },
          {
            '@type': 'Question',
            name: 'What things should I consider when creating my profile?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Create an honest and complete profile with recent photos. Include details about your background, education, profession, family, and partner preferences. Be specific about your expectations and values. A well-crafted profile with genuine information attracts more compatible matches and builds trust.',
            },
          },
          {
            '@type': 'Question',
            name: 'Who can view my profile information?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Your profile visibility depends on your privacy settings. Basic information is visible to all registered members, while contact details are shared only with premium members or those you\'ve accepted. You can control photo visibility and choose who can contact you through privacy controls in your account settings.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is vivahavedi safe and secure?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, we prioritize your safety with 100% verified profiles, secure payment systems, and advanced privacy controls. Our team manually reviews all profiles and photos. We use SSL encryption for data protection and provide tools to report suspicious activities. Your personal information is never shared without your consent.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does the matching system work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Our AI-powered matching system analyzes your preferences, background, and behavior to suggest compatible profiles. Matches are based on factors like age, location, education, profession, religion, caste, and lifestyle preferences. You can also use advanced search filters to find specific criteria.',
            },
          },
          {
            '@type': 'Question',
            name: 'What are the membership benefits?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Premium members get unlimited profile views, direct contact access, priority listing in search results, read receipts for messages, and advanced privacy controls. You also get personalized matchmaking assistance, profile promotion, and access to exclusive events and success stories.',
            },
          },
          {
            '@type': 'Question',
            name: 'How can I upgrade my membership?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can upgrade to premium membership anytime from your account dashboard. Choose from various plans based on duration and features. We accept all major payment methods including credit/debit cards, net banking, UPI, and mobile wallets. All transactions are secure and encrypted.',
            },
          },
        ],
      },
      // ItemList Schema for Success Stories
      {
        '@type': 'ItemList',
        '@id': 'https://vivahavedimatrimony.com/#successstories',
        name: 'Success Stories',
        description: 'Real couples who found their perfect match on vivahavedi',
        numberOfItems: 50000,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@type': 'Review',
              itemReviewed: {
                '@id': 'https://vivahavedimatrimony.com/#service',
              },
              reviewRating: {
                '@type': 'Rating',
                ratingValue: '5',
              },
              author: {
                '@type': 'Person',
                name: 'Happy Couple',
              },
            },
          },
        ],
      },
      // SoftwareApplication Schema for Mobile App
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://vivahavedimatrimony.com/#mobileapp',
        name: 'vivahavedi Mobile App',
        operatingSystem: 'ANDROID',
        applicationCategory: 'LifestyleApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '100000',
        },
        downloadUrl: 'https://play.google.com/store/apps/details?id=com.vivahavedi.vivaapp',
      },
    ],
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <Script
        id="homepage-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        strategy="beforeInteractive"
      />
      <ClientScrollManager />
      <ScrollProgress />
      <Header />
      <main>
        <ErrorBoundary fallback={<SectionErrorFallback message="Unable to load hero section" />}>
          <div id="hero" className="gpu-accelerated">
            <HeroSection />
          </div>
        </ErrorBoundary>

        {/* Critical Section 1: Search - NO lazy loading, immediate render */}
        <ErrorBoundary fallback={<SectionErrorFallback message="Unable to load search section" />}>
          <div id="search">
            <SearchSection />
          </div>
        </ErrorBoundary>

        {/* Critical Section 2: Featured Profiles - NO lazy loading, immediate render */}
        <ErrorBoundary fallback={<SectionErrorFallback message="Unable to load featured profiles" />}>
          <div id="profiles">
            <FeaturedProfiles />
          </div>
        </ErrorBoundary>

        {/* Important Section 1: How It Works - Lazy with skeleton */}
        <ErrorBoundary fallback={<SectionErrorFallback message="Unable to load this section" />}>
          <Suspense fallback={<SectionSkeleton variant="grid" />}>
            <div id="find-special-someone">
              <FindSpecialSomeone />
            </div>
          </Suspense>
        </ErrorBoundary>

        {/* Important Section 2: Why Choose Us - Lazy with skeleton */}
        <ErrorBoundary fallback={<SectionErrorFallback message="Unable to load this section" />}>
          <Suspense fallback={<SectionSkeleton variant="grid" />}>
            <div id="why-choose-us">
              <WhyChooseUs />
            </div>
          </Suspense>
        </ErrorBoundary>

        {/* Secondary Section 1: Success Stories - Lazy with skeleton */}
        <ErrorBoundary fallback={<SectionErrorFallback message="Unable to load success stories" />}>
          <Suspense fallback={<SectionSkeleton variant="default" />}>
            <div id="success-stories">
              <SuccessStories />
            </div>
          </Suspense>
        </ErrorBoundary>

        {/* Secondary Section 2: Mobile App - Lazy with skeleton */}
        <ErrorBoundary fallback={<SectionErrorFallback message="Unable to load mobile app section" />}>
          <Suspense fallback={<SectionSkeleton variant="default" />}>
            <div id="mobile-app">
              <MobileAppDownload />
            </div>
          </Suspense>
        </ErrorBoundary>

        {/* Secondary Section 3: FAQ - Lazy with skeleton */}
        <ErrorBoundary fallback={<SectionErrorFallback message="Unable to load FAQ section" />}>
          <Suspense fallback={<SectionSkeleton variant="compact" />}>
            <div id="faq">
              <FAQ />
            </div>
          </Suspense>
        </ErrorBoundary>

        {/* Tertiary Section 1: Caste Matrimony - Lazy with skeleton (low priority) */}
        <ErrorBoundary fallback={<SectionErrorFallback message="Unable to load matrimony section" />}>
          <Suspense fallback={<SectionSkeleton variant="grid" />}>
            <div id="caste-matrimony">
              <CasteMatrimonySection />
            </div>
          </Suspense>
        </ErrorBoundary>

        {/* Tertiary Section 2: Region Matrimony - Lazy with skeleton (low priority) */}
        <ErrorBoundary fallback={<SectionErrorFallback message="Unable to load region matrimony section" />}>
          <Suspense fallback={<SectionSkeleton variant="grid" />}>
            <div id="region-matrimony">
              <RegionMatrimonySection />
            </div>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
