import { Metadata } from 'next';
import Script from 'next/script';

interface State {
  id: number;
  name: string;
}

interface District {
  id: number;
  name: string;
  masterId: number;
}

interface Props {
  params: Promise<{
    state: string;
    district: string;
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

// Fetch state and district data
async function getStateAndDistrict(stateSlug: string, districtSlug: string): Promise<{ state: State; district: District } | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/masters`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    const data = await response.json();

    if (data.status === 'success') {
      const states: State[] = data.data.state;
      const districts: District[] = data.data.district;

      const foundState = states.find(
        s => FEATURED_STATE_IDS.includes(s.id) && createSlug(s.name) === stateSlug
      );

      if (foundState) {
        const foundDistrict = districts.find(
          d => d.masterId === foundState.id && createSlug(d.name) === districtSlug
        );

        if (foundDistrict) {
          return { state: foundState, district: foundDistrict };
        }
      }
    }
  } catch (err) {
    console.error('Error fetching state and district:', err);
  }
  return null;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, district: districtSlug } = await params;
  const data = await getStateAndDistrict(stateSlug, districtSlug);

  if (!data) {
    return {
      title: 'Page Not Found | vivahavedi Matrimony',
      description: 'The page you are looking for does not exist.',
      robots: 'noindex, nofollow',
    };
  }

  const { state, district } = data;
  const title = `${district.name} Matrimony - ${state.name} ${district.name} Brides & Grooms | vivahavedi`;
  const description = `Find your perfect life partner from ${district.name}, ${state.name}. Browse thousands of verified matrimonial profiles from ${district.name}. Connect with ${district.name} brides and grooms across all religions and castes. Register free today!`;
  const url = `https://vivamatrimony.com/matrimony-in/${stateSlug}/${districtSlug}`;

  return {
    title,
    description,
    keywords: `${district.name} matrimony, ${district.name} marriage, ${district.name} brides, ${district.name} grooms, ${district.name} wedding, ${state.name} ${district.name} matrimony, ${district.name} shaadi, ${district.name} matrimonial site, ${district.name} life partner, ${district.name} ${state.name} matrimony`,
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

export default async function DistrictLayout({ params, children }: Props) {
  const { state: stateSlug, district: districtSlug } = await params;
  const data = await getStateAndDistrict(stateSlug, districtSlug);

  if (!data) {
    return <>{children}</>;
  }

  const { state, district } = data;

  // Structured data for SEO (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `https://vivamatrimony.com/matrimony-in/${stateSlug}/${districtSlug}`,
        url: `https://vivamatrimony.com/matrimony-in/${stateSlug}/${districtSlug}`,
        name: `${district.name} Matrimony - ${state.name} ${district.name} Brides & Grooms`,
        description: `Find your perfect life partner from ${district.name}, ${state.name}. Browse thousands of verified matrimonial profiles from ${district.name} across all religions and castes.`,
        isPartOf: {
          '@id': 'https://vivamatrimony.com/#website',
        },
        breadcrumb: {
          '@id': `https://vivamatrimony.com/matrimony-in/${stateSlug}/${districtSlug}#breadcrumb`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://vivamatrimony.com/matrimony-in/${stateSlug}/${districtSlug}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://vivamatrimony.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Matrimony by Region',
            item: 'https://vivamatrimony.com/matrimony-in',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${state.name} Matrimony`,
            item: `https://vivamatrimony.com/matrimony-in/${stateSlug}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: `${district.name} Matrimony`,
            item: `https://vivamatrimony.com/matrimony-in/${stateSlug}/${districtSlug}`,
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://vivamatrimony.com/#website',
        url: 'https://vivamatrimony.com',
        name: 'vivahavedi',
        description: 'Find your perfect life partner on vivahavedi, a trusted Indian matrimonial platform.',
        publisher: {
          '@id': 'https://vivamatrimony.com/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://vivamatrimony.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://vivamatrimony.com/#organization',
        name: 'vivahavedi',
        url: 'https://vivamatrimony.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://vivamatrimony.com/apple-touch-icon.png',
        },
        description: 'India\'s most trusted matrimonial service helping millions find their perfect life partner.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: district.name,
          addressRegion: state.name,
          addressCountry: 'IN',
        },
      },
      {
        '@type': 'LocalBusiness',
        '@id': `https://vivamatrimony.com/matrimony-in/${stateSlug}/${districtSlug}#localbusiness`,
        name: `vivahavedi ${district.name} Matrimony`,
        description: `Find verified matrimonial profiles from ${district.name}, ${state.name}. Connect with ${district.name} brides and grooms across all communities.`,
        url: `https://vivamatrimony.com/matrimony-in/${stateSlug}/${districtSlug}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: district.name,
          addressRegion: state.name,
          addressCountry: 'IN',
        },
        areaServed: {
          '@type': 'City',
          name: district.name,
          containedIn: {
            '@type': 'State',
            name: state.name,
          },
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `How do I find ${district.name} matrimony profiles?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Use the search form above to browse verified profiles from ${district.name}, ${state.name}. You can filter by gender, age, marital status, religion, and caste to find the most compatible matches from ${district.name}.`,
            },
          },
          {
            '@type': 'Question',
            name: `Are ${district.name} matrimony profiles verified?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes, all profiles from ${district.name} on our platform undergo thorough verification. We verify identity documents, contact details, and photos to ensure authenticity and safety.`,
            },
          },
          {
            '@type': 'Question',
            name: `Can I search across all religions and castes in ${district.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes, our ${district.name} matrimony service covers all religions and castes. You can search across all communities or filter by specific religion and caste based on your preferences.`,
            },
          },
          {
            '@type': 'Question',
            name: `Is ${district.name} matrimony service free?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes, registration and basic profile browsing are completely free. You can create your profile, search for ${district.name} matches, and view profile summaries at no cost. Premium membership offers additional features.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="structured-data-district"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
