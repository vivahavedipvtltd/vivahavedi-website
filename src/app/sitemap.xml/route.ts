import { NextResponse } from 'next/server';

// Force dynamic rendering for fresh sitemap data
export const dynamic = 'force-dynamic';
export const revalidate = 86400; // Revalidate every 24 hours

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

// Fetch dynamic data from API
async function fetchDynamicData() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

  try {
    const response = await fetch(`${baseUrl}/masters`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error('Error fetching dynamic data for sitemap:', error);
    return null;
  }
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vivahavedimatrimony.com';
  const currentDate = new Date().toISOString();

  // Static URLs
  const staticUrls: SitemapUrl[] = [
    {
      loc: `${siteUrl}`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: `${siteUrl}/about-us`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      loc: `${siteUrl}/contact-us`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      loc: `${siteUrl}/packages`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: `${siteUrl}/register`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.9,
    },
    {
      loc: `${siteUrl}/login`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: `${siteUrl}/search`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9,
    },
    {
      loc: `${siteUrl}/public-search-results`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.8,
    },
    {
      loc: `${siteUrl}/blog`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.8,
    },
    {
      loc: `${siteUrl}/success-stories`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8,
    },
    {
      loc: `${siteUrl}/mobile-app`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: `${siteUrl}/privacy-policy`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.5,
    },
    {
      loc: `${siteUrl}/policies/terms-conditions`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.5,
    },
    {
      loc: `${siteUrl}/policies/cancellation-refund`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.5,
    },
    {
      loc: `${siteUrl}/policies/shipping-policy`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.5,
    },
    {
      loc: `${siteUrl}/matrimony`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: `${siteUrl}/matrimony-in`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: `${siteUrl}/sitemap`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.6,
    },
  ];

  // Fetch dynamic data for religions, castes, states, districts
  const dynamicData = await fetchDynamicData();
  const dynamicUrls: SitemapUrl[] = [];

  if (dynamicData) {
    // Add religion-based matrimony pages
    if (dynamicData.religion && Array.isArray(dynamicData.religion)) {
      dynamicData.religion.forEach((religion: { id: number; name: string }) => {
        const religionSlug = religion.name.toLowerCase().replace(/\s+/g, '-');
        dynamicUrls.push({
          loc: `${siteUrl}/matrimony/${religionSlug}`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.8,
        });

        // Add caste-based matrimony pages for each religion
        if (dynamicData.caste && Array.isArray(dynamicData.caste)) {
          const religionCastes = dynamicData.caste.filter(
            (caste: { masterId: number }) => caste.masterId === religion.id
          );

          religionCastes.forEach((caste: { name: string }) => {
            const casteSlug = caste.name.toLowerCase().replace(/\s+/g, '-');
            dynamicUrls.push({
              loc: `${siteUrl}/matrimony/${religionSlug}/${casteSlug}`,
              lastmod: currentDate,
              changefreq: 'weekly',
              priority: 0.7,
            });
          });
        }
      });
    }

    // Add state-based matrimony pages
    if (dynamicData.state && Array.isArray(dynamicData.state)) {
      dynamicData.state.forEach((state: { id: number; name: string }) => {
        const stateSlug = state.name.toLowerCase().replace(/\s+/g, '-');
        dynamicUrls.push({
          loc: `${siteUrl}/matrimony-in/${stateSlug}`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.8,
        });

        // Add district-based matrimony pages for each state
        if (dynamicData.district && Array.isArray(dynamicData.district)) {
          const stateDistricts = dynamicData.district.filter(
            (district: { masterId: number }) => district.masterId === state.id
          );

          stateDistricts.forEach((district: { name: string }) => {
            const districtSlug = district.name.toLowerCase().replace(/\s+/g, '-');
            dynamicUrls.push({
              loc: `${siteUrl}/matrimony-in/${stateSlug}/${districtSlug}`,
              lastmod: currentDate,
              changefreq: 'weekly',
              priority: 0.7,
            });
          });
        }
      });
    }
  }

  // Combine all URLs
  const allUrls = [...staticUrls, ...dynamicUrls];

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}
