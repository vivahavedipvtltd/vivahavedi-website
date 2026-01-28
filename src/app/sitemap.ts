import { MetadataRoute } from 'next';

interface Religion {
  id: number;
  name: string;
}

interface Caste {
  id: number;
  name: string;
  masterId: number;
}

interface MasterData {
  religion: Religion[];
  caste: Caste[];
}

// Helper to create slug
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Fetch master data for religions and castes
async function getMasterData(): Promise<MasterData> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/masters`, {
      cache: 'no-store'
    });
    const data = await response.json();

    if (data.status === 'success') {
      return {
        religion: data.data.religion || [],
        caste: data.data.caste || [],
      };
    }
  } catch (err) {
    console.error('Error fetching master data for sitemap:', err);
  }

  return {
    religion: [],
    caste: [],
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vivamatrimony.com';
  const currentDate = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/packages`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/policies/terms-conditions`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/policies/cancellation-refund`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/policies/shipping-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/public-search-results`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // Fetch dynamic data for matrimony pages
  const masterData = await getMasterData();
  const dynamicPages: MetadataRoute.Sitemap = [];

  // Add religion pages
  masterData.religion.forEach((religion) => {
    const religionSlug = createSlug(religion.name);
    dynamicPages.push({
      url: `${baseUrl}/matrimony/${religionSlug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });

    // Add caste pages for this religion
    const religionCastes = masterData.caste.filter(
      (caste) => caste.masterId === religion.id
    );

    religionCastes.forEach((caste) => {
      const casteSlug = createSlug(caste.name);
      dynamicPages.push({
        url: `${baseUrl}/matrimony/${religionSlug}/${casteSlug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  // Combine all pages
  return [...staticPages, ...dynamicPages];
}
