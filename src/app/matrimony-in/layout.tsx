import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Regional Matrimony - Find Brides & Grooms by State & District | vivahavedi',
  description: 'Find your perfect life partner from your preferred state and district. Browse thousands of verified profiles from Kerala, Tamil Nadu, Karnataka, Andhra Pradesh, Telangana & Maharashtra. Register free today!',
  keywords: 'regional matrimony, state matrimony, district matrimony, Kerala matrimony, Tamil Nadu matrimony, Karnataka matrimony, Andhra Pradesh matrimony, Telangana matrimony, Maharashtra matrimony, location based matrimony, Indian regional matrimony',
  authors: [{ name: 'vivahavedi' }],
  creator: 'vivahavedi',
  publisher: 'vivahavedi',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://vivahavedimatrimony.com/matrimony-in',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vivahavedimatrimony.com/matrimony-in',
    siteName: 'vivahavedi',
    title: 'Regional Matrimony - Find Brides & Grooms by State & District | vivahavedi',
    description: 'Find your perfect life partner from your preferred state and district. Browse thousands of verified profiles across major Indian states.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Regional Matrimony - Find Brides & Grooms by State & District | vivahavedi',
    description: 'Find your perfect life partner from your preferred state and district. Browse thousands of verified profiles.',
  },
};

interface Props {
  children: React.ReactNode;
}

export default function MatrimonyByRegionLayout({ children }: Props) {
  // Structured data for SEO (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://vivahavedimatrimony.com/matrimony-in',
        url: 'https://vivahavedimatrimony.com/matrimony-in',
        name: 'Regional Matrimony - Find Brides & Grooms by State & District',
        description: 'Find your perfect life partner from your preferred state and district. Browse thousands of verified profiles from Kerala, Tamil Nadu, Karnataka, Andhra Pradesh, Telangana & Maharashtra.',
        isPartOf: {
          '@id': 'https://vivahavedimatrimony.com/#website',
        },
        breadcrumb: {
          '@id': 'https://vivahavedimatrimony.com/matrimony-in#breadcrumb',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://vivahavedimatrimony.com/matrimony-in#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://vivahavedimatrimony.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Matrimony by Region',
            item: 'https://vivahavedimatrimony.com/matrimony-in',
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://vivahavedimatrimony.com/#website',
        url: 'https://vivahavedimatrimony.com',
        name: 'vivahavedi',
        description: 'Find your perfect life partner on vivahavedi, a trusted Indian matrimonial platform.',
        publisher: {
          '@id': 'https://vivahavedimatrimony.com/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://vivahavedimatrimony.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://vivahavedimatrimony.com/#organization',
        name: 'vivahavedi',
        url: 'https://vivahavedimatrimony.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://vivahavedimatrimony.com/apple-touch-icon.png',
        },
        description: 'India\'s most trusted matrimonial service helping millions find their perfect life partner.',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IN',
        },
        sameAs: [
          'https://www.facebook.com/vivahavedi',
          'https://twitter.com/vivahavedi',
          'https://www.instagram.com/vivahavedi',
        ],
      },
      {
        '@type': 'Service',
        '@id': 'https://vivahavedimatrimony.com/matrimony-in#service',
        name: 'Regional Matrimonial Services',
        description: 'Comprehensive regional matrimonial services helping individuals find their perfect life partner from their preferred state and district across India.',
        provider: {
          '@id': 'https://vivahavedimatrimony.com/#organization',
        },
        serviceType: 'Regional Matrimonial Service',
        areaServed: [
          {
            '@type': 'State',
            name: 'Kerala',
            containedInPlace: {
              '@type': 'Country',
              name: 'India',
            },
          },
          {
            '@type': 'State',
            name: 'Tamil Nadu',
            containedInPlace: {
              '@type': 'Country',
              name: 'India',
            },
          },
          {
            '@type': 'State',
            name: 'Karnataka',
            containedInPlace: {
              '@type': 'Country',
              name: 'India',
            },
          },
          {
            '@type': 'State',
            name: 'Andhra Pradesh',
            containedInPlace: {
              '@type': 'Country',
              name: 'India',
            },
          },
          {
            '@type': 'State',
            name: 'Telangana',
            containedInPlace: {
              '@type': 'Country',
              name: 'India',
            },
          },
          {
            '@type': 'State',
            name: 'Maharashtra',
            containedInPlace: {
              '@type': 'Country',
              name: 'India',
            },
          },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Matrimony by State',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Kerala Matrimony',
                description: 'Find brides and grooms from Kerala',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Tamil Nadu Matrimony',
                description: 'Find brides and grooms from Tamil Nadu',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Karnataka Matrimony',
                description: 'Find brides and grooms from Karnataka',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Andhra Pradesh Matrimony',
                description: 'Find brides and grooms from Andhra Pradesh',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Telangana Matrimony',
                description: 'Find brides and grooms from Telangana',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Maharashtra Matrimony',
                description: 'Find brides and grooms from Maharashtra',
              },
            },
          ],
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Which states are covered in regional matrimony?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We cover major Indian states including Kerala, Tamil Nadu, Karnataka, Andhra Pradesh, Telangana, and Maharashtra. Each state page provides district-wise search to help you find matches from specific locations.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I search for matches by district?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! Our regional matrimony service allows you to search profiles at the district level within each state. This helps you find matches from your hometown or nearby areas for convenient meetings and cultural compatibility.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are regional matrimony profiles verified?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, all regional profiles undergo the same rigorous verification process. We verify identity documents, contact details, and photos to ensure authenticity and safety across all states and districts.',
            },
          },
          {
            '@type': 'Question',
            name: 'Why choose regional matrimony?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Regional matrimony helps you find matches who share your state culture, language, and traditions. It makes family meetings more convenient, ensures cultural compatibility, and strengthens connections through shared regional identity.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="structured-data-regional-matrimony"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
