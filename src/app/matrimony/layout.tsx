import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Matrimony Services - Find Brides & Grooms by Religion | vivahavedi',
  description: 'Find your perfect life partner on vivahavedi - India\'s most trusted matrimonial platform. Browse lakhs of verified profiles by religion, caste, and community. Register free today!',
  keywords: 'matrimony, matrimonial, shaadi, marriage, wedding, bride, groom, life partner, Indian matrimony, Hindu matrimony, Muslim matrimony, Christian matrimony, Sikh matrimony, Jain matrimony, Buddhist matrimony',
  authors: [{ name: 'vivahavedi' }],
  creator: 'vivahavedi',
  publisher: 'vivahavedi',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://vivahavedimatrimony.com/matrimony',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vivahavedimatrimony.com/matrimony',
    siteName: 'vivahavedi',
    title: 'Matrimony Services - Find Brides & Grooms by Religion | vivahavedi',
    description: 'Find your perfect life partner on vivahavedi. Browse lakhs of verified profiles by religion, caste, and community. India\'s most trusted matrimonial platform.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Matrimony Services - Find Brides & Grooms by Religion | vivahavedi',
    description: 'Find your perfect life partner on vivahavedi. Browse lakhs of verified profiles by religion, caste, and community.',
  },
};

interface Props {
  children: React.ReactNode;
}

export default function MatrimonyLayout({ children }: Props) {
  // Structured data for SEO (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://vivahavedimatrimony.com/matrimony',
        url: 'https://vivahavedimatrimony.com/matrimony',
        name: 'Matrimony Services - Find Brides & Grooms by Religion',
        description: 'Find your perfect life partner on vivahavedi - India\'s most trusted matrimonial platform. Browse lakhs of verified profiles by religion, caste, and community.',
        isPartOf: {
          '@id': 'https://vivahavedimatrimony.com/#website',
        },
        breadcrumb: {
          '@id': 'https://vivahavedimatrimony.com/matrimony#breadcrumb',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://vivahavedimatrimony.com/matrimony#breadcrumb',
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
            name: 'Matrimony',
            item: 'https://vivahavedimatrimony.com/matrimony',
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
        '@id': 'https://vivahavedimatrimony.com/matrimony#service',
        name: 'Matrimonial Services',
        description: 'Comprehensive matrimonial services helping individuals find their perfect life partner across all religions and communities in India.',
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
          name: 'Matrimony by Religion',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Hindu Matrimony',
                description: 'Find Hindu brides and grooms',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Muslim Matrimony',
                description: 'Find Muslim brides and grooms',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Christian Matrimony',
                description: 'Find Christian brides and grooms',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Sikh Matrimony',
                description: 'Find Sikh brides and grooms',
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
            name: 'How do I register on vivahavedi matrimony?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Registration is simple and free! Click on the "Register Now" button, fill in your basic details including religion and community, create a profile with your preferences, and start browsing matches immediately. The process takes just 5 minutes.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is vivahavedi matrimony safe and secure?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, absolutely! We take your privacy and security very seriously. All profiles are manually verified by our team. Your contact details remain private until you choose to share them. We use industry-standard encryption to protect your personal information.',
            },
          },
          {
            '@type': 'Question',
            name: 'How can I search for matches by religion and caste?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can browse profiles by clicking on your preferred religion on the matrimony page. Then you can further filter by caste, subcaste, location, education, profession, and 30+ other criteria using our advanced search filters.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is the matrimonial service free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, registration and basic profile browsing are completely free. You can create your profile, search for matches, and view profile summaries at no cost. Premium membership plans offer additional features like unlimited contact details access and priority listing.',
            },
          },
          {
            '@type': 'Question',
            name: 'How many matrimonial profiles are on vivahavedi?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We have over 10 lakh (1 million) verified profiles registered across all religions, castes, and communities in India. New profiles are added daily, giving you fresh matches regularly.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="structured-data-matrimony"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
