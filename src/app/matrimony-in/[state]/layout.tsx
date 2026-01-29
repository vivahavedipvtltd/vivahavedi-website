import { Metadata } from 'next';
import Script from 'next/script';

interface State {
  id: number;
  name: string;
}

interface Props {
  params: Promise<{
    state: string;
  }>;
  children: React.ReactNode;
}

const FEATURED_STATE_IDS = [24, 35, 1, 15, 10002, 219];

// Helper to create slug
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Fetch state data
async function getState(stateSlug: string): Promise<State | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/masters`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    const data = await response.json();

    if (data.status === 'success') {
      const states: State[] = data.data.state;
      const foundState = states.find(
        s => FEATURED_STATE_IDS.includes(s.id) && createSlug(s.name) === stateSlug
      );
      return foundState || null;
    }
  } catch (err) {
    console.error('Error fetching state:', err);
  }
  return null;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const state = await getState(stateSlug);

  if (!state) {
    return {
      title: 'Page Not Found | vivahavedi Matrimony',
      description: 'The page you are looking for does not exist.',
      robots: 'noindex, nofollow',
    };
  }

  const stateName = state.name;
  const title = `${stateName} Matrimony - Find ${stateName} Brides & Grooms by District | vivahavedi`;
  const description = `Find your perfect life partner from ${stateName}. Browse thousands of verified ${stateName} matrimonial profiles from all districts. Connect with ${stateName} brides and grooms. Register free today!`;
  const url = `https://vivahavedimatrimony.com/matrimony-in/${stateSlug}`;

  return {
    title,
    description,
    keywords: `${stateName} matrimony, ${stateName} marriage, ${stateName} brides, ${stateName} grooms, ${stateName} wedding, ${stateName} shaadi, ${stateName} matrimonial site, ${stateName} district matrimony, ${stateName} life partner`,
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

export default async function StateLayout({ params, children }: Props) {
  const { state: stateSlug } = await params;
  const state = await getState(stateSlug);

  if (!state) {
    return <>{children}</>;
  }

  // Structured data for SEO (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `https://vivahavedimatrimony.com/matrimony-in/${stateSlug}`,
        url: `https://vivahavedimatrimony.com/matrimony-in/${stateSlug}`,
        name: `${state.name} Matrimony - Find ${state.name} Brides & Grooms by District`,
        description: `Find your perfect life partner from ${state.name}. Browse thousands of verified ${state.name} matrimonial profiles from all districts.`,
        isPartOf: {
          '@id': 'https://vivahavedimatrimony.com/#website',
        },
        breadcrumb: {
          '@id': `https://vivahavedimatrimony.com/matrimony-in/${stateSlug}#breadcrumb`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://vivahavedimatrimony.com/matrimony-in/${stateSlug}#breadcrumb`,
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
          {
            '@type': 'ListItem',
            position: 3,
            name: `${state.name} Matrimony`,
            item: `https://vivahavedimatrimony.com/matrimony-in/${stateSlug}`,
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
          addressRegion: state.name,
          addressCountry: 'IN',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `How do I find ${state.name} matrimony profiles by district?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Browse ${state.name} profiles by selecting your preferred district from the list above. Each district page provides verified profiles from that specific location with advanced search filters to find the most compatible matches.`,
            },
          },
          {
            '@type': 'Question',
            name: `Are ${state.name} matrimony profiles verified?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes, all profiles from ${state.name} undergo thorough verification. We verify identity documents, contact details, and photos to ensure authenticity and safety. Your privacy is protected at all times.`,
            },
          },
          {
            '@type': 'Question',
            name: `Can I search across all districts in ${state.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes, our ${state.name} matrimony service covers all major districts across the state. You can browse profiles from any district and use advanced filters to find matches by religion, caste, education, profession, and more.`,
            },
          },
          {
            '@type': 'Question',
            name: `Is ${state.name} matrimony service free?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes, registration and basic profile browsing are completely free. You can create your profile, search for ${state.name} matches, and view profile summaries at no cost. Premium plans offer additional features.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="structured-data-state"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
