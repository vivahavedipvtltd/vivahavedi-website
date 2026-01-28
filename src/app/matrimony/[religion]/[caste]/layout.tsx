import { Metadata } from 'next';
import Script from 'next/script';

interface Religion {
  id: number;
  name: string;
}

interface Caste {
  id: number;
  name: string;
  masterId: number;
}

interface Props {
  params: Promise<{
    religion: string;
    caste: string;
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

// Fetch religion and caste data
async function getReligionAndCaste(
  religionSlug: string,
  casteSlug: string
): Promise<{ religion: Religion | null; caste: Caste | null }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/masters`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    const data = await response.json();

    if (data.status === 'success') {
      const religions: Religion[] = data.data.religion;
      const castes: Caste[] = data.data.caste;

      const foundReligion = religions.find(
        r => createSlug(r.name) === religionSlug
      );

      if (foundReligion) {
        const foundCaste = castes.find(
          c => createSlug(c.name) === casteSlug && c.masterId === foundReligion.id
        );

        return { religion: foundReligion, caste: foundCaste || null };
      }
    }
  } catch (err) {
    console.error('Error fetching data:', err);
  }
  return { religion: null, caste: null };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { religion: religionSlug, caste: casteSlug } = await params;
  const { religion, caste } = await getReligionAndCaste(religionSlug, casteSlug);

  if (!religion || !caste) {
    return {
      title: 'Page Not Found | vivahavedi Matrimony',
      description: 'The page you are looking for does not exist.',
      robots: 'noindex, nofollow',
    };
  }

  const religionName = religion.name;
  const casteName = caste.name;
  const title = `${casteName} Matrimony - ${religionName} ${casteName} Brides & Grooms | vivahavedi`;
  const description = `Find your perfect ${religionName} ${casteName} life partner on vivahavedi. Browse verified ${casteName} matrimonial profiles from ${religionName} community. Connect with ${casteName} brides and grooms today.`;
  const url = `https://vivamatrimony.com/matrimony/${religionSlug}/${casteSlug}`;

  return {
    title,
    description,
    keywords: `${casteName} matrimony, ${religionName} ${casteName} matrimony, ${casteName} brides, ${casteName} grooms, ${casteName} marriage, ${casteName} shaadi, ${casteName} matrimonial, ${religionName} ${casteName} wedding, ${casteName} life partner`,
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

export default async function CasteLayout({ params, children }: Props) {
  const { religion: religionSlug, caste: casteSlug } = await params;
  const { religion, caste } = await getReligionAndCaste(religionSlug, casteSlug);

  if (!religion || !caste) {
    return <>{children}</>;
  }

  // Structured data for SEO (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `https://vivamatrimony.com/matrimony/${religionSlug}/${casteSlug}`,
        url: `https://vivamatrimony.com/matrimony/${religionSlug}/${casteSlug}`,
        name: `${caste.name} Matrimony - ${religion.name} ${caste.name} Brides & Grooms`,
        description: `Find your perfect ${religion.name} ${caste.name} life partner on vivahavedi. Browse verified ${caste.name} matrimonial profiles.`,
        isPartOf: {
          '@id': 'https://vivamatrimony.com/#website',
        },
        breadcrumb: {
          '@id': `https://vivamatrimony.com/matrimony/${religionSlug}/${casteSlug}#breadcrumb`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://vivamatrimony.com/matrimony/${religionSlug}/${casteSlug}#breadcrumb`,
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
            name: 'Matrimony',
            item: 'https://vivamatrimony.com/matrimony',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${religion.name} Matrimony`,
            item: `https://vivamatrimony.com/matrimony/${religionSlug}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: `${caste.name} Matrimony`,
            item: `https://vivamatrimony.com/matrimony/${religionSlug}/${casteSlug}`,
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
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `How to find ${caste.name} brides and grooms?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `You can find ${caste.name} brides and grooms by registering on vivahavedi and using our advanced search filters to browse verified ${religion.name} ${caste.name} profiles.`,
            },
          },
          {
            '@type': 'Question',
            name: `Is ${caste.name} matrimony service free?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes, registration is free on vivahavedi. You can create your profile and browse ${caste.name} matrimonial profiles at no cost. Premium features are available for enhanced matchmaking.`,
            },
          },
          {
            '@type': 'Question',
            name: `Are ${caste.name} profiles verified?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes, all ${caste.name} profiles on vivahavedi are verified to ensure authenticity and provide a safe matrimonial experience.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="structured-data-caste"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
