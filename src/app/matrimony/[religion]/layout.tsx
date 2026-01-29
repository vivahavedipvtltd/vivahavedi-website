import { Metadata } from 'next';
import Script from 'next/script';

interface Religion {
  id: number;
  name: string;
}

interface Props {
  params: Promise<{
    religion: string;
  }>;
  children: React.ReactNode;
}

// Helper to create slug
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Fetch religion data
async function getReligion(religionSlug: string): Promise<Religion | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/masters`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    const data = await response.json();

    if (data.status === 'success') {
      const religions: Religion[] = data.data.religion;
      const foundReligion = religions.find(
        r => createSlug(r.name) === religionSlug
      );
      return foundReligion || null;
    }
  } catch (err) {
    console.error('Error fetching religion:', err);
  }
  return null;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { religion: religionSlug } = await params;
  const religion = await getReligion(religionSlug);

  if (!religion) {
    return {
      title: 'Page Not Found | vivahavedi Matrimony',
      description: 'The page you are looking for does not exist.',
      robots: 'noindex, nofollow',
    };
  }

  const religionName = religion.name;
  const title = `${religionName} Matrimony - Find ${religionName} Brides & Grooms | vivahavedi`;
  const description = `Find your perfect ${religionName} life partner on vivahavedi. Browse thousands of verified ${religionName} matrimonial profiles. Register free and connect with ${religionName} brides and grooms today.`;
  const url = `https://vivahavedimatrimony.com/matrimony/${religionSlug}`;

  return {
    title,
    description,
    keywords: `${religionName} matrimony, ${religionName} marriage, ${religionName} brides, ${religionName} grooms, ${religionName} wedding, ${religionName} shaadi, ${religionName} matrimonial site, ${religionName} life partner`,
    authors: [{ name: 'vivahavedi' }],
    creator: 'vivahavedi',
    publisher: 'vivahavedi',
    robots: 'index, follow',
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      siteName: 'vivahavedi',
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ReligionLayout({ params, children }: Props) {
  const { religion: religionSlug } = await params;
  const religion = await getReligion(religionSlug);

  if (!religion) {
    return <>{children}</>;
  }

  // Structured data for SEO (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `https://vivahavedimatrimony.com/matrimony/${religionSlug}`,
        url: `https://vivahavedimatrimony.com/matrimony/${religionSlug}`,
        name: `${religion.name} Matrimony - Find ${religion.name} Brides & Grooms`,
        description: `Find your perfect ${religion.name} life partner on vivahavedi. Browse thousands of verified ${religion.name} matrimonial profiles.`,
        isPartOf: {
          '@id': 'https://vivahavedimatrimony.com/#website',
        },
        breadcrumb: {
          '@id': `https://vivahavedimatrimony.com/matrimony/${religionSlug}#breadcrumb`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://vivahavedimatrimony.com/matrimony/${religionSlug}#breadcrumb`,
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
          {
            '@type': 'ListItem',
            position: 3,
            name: `${religion.name} Matrimony`,
            item: `https://vivahavedimatrimony.com/matrimony/${religionSlug}`,
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
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `How do I register on ${religion.name} Matrimony?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Registration is simple and free! Click on the "Register Now" button, fill in your basic details, create a profile with your preferences, and start browsing ${religion.name} matches immediately. Our step-by-step process takes just 5 minutes to complete.`,
            },
          },
          {
            '@type': 'Question',
            name: `Is vivahavedi ${religion.name} Matrimony safe and secure?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes, absolutely! We take your privacy and security very seriously. All ${religion.name} profiles are manually verified by our team. Your contact details remain private until you choose to share them. We use industry-standard encryption to protect your personal information.`,
            },
          },
          {
            '@type': 'Question',
            name: `How can I search for ${religion.name} brides or grooms by caste?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `You can browse ${religion.name} profiles by caste using the sections on our matrimony pages. Simply click on any caste category to view profiles from that community. You can also use our advanced search filters to narrow down matches by caste, subcaste, location, education, and more.`,
            },
          },
          {
            '@type': 'Question',
            name: `Is the ${religion.name} Matrimony service free?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes, registration and basic profile browsing are completely free. You can create your profile, search for matches, and view profile summaries at no cost. Premium membership plans offer additional features like unlimited messaging, advanced filters, and priority customer support.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="structured-data-religion"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
