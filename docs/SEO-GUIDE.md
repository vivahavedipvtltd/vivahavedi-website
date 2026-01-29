# SEO Guide

This document outlines the SEO strategy, implementation details, and best practices for the Vivahavedi Matrimony website.

## SEO Strategy Overview

### Target Keywords
- **Primary**: matrimony, indian matrimony, marriage, wedding
- **Long-tail**: find life partner, indian matrimonial site, marriage bureau
- **Local**: [city] matrimony, [state] marriage, regional matrimony
- **Community**: [caste] matrimony, [religion] marriage, community matrimony

### SEO Goals
1. **Organic Traffic**: Increase organic search traffic by 200% in 6 months
2. **Local Visibility**: Rank in top 3 for local matrimony searches
3. **Brand Authority**: Establish as trusted matrimonial platform
4. **User Experience**: Maintain fast loading speeds and mobile performance

## Technical SEO Implementation

### Meta Tags Configuration

#### Root Layout (`/src/app/layout.tsx`)
```tsx
export const metadata: Metadata = {
  title: "Vivahavedi Matrimony - Find Your Perfect Life Partner | Indian Matrimonial Site",
  description: "Discover your ideal life partner on Vivahavedi Matrimony, a trusted Indian matrimonial platform. Browse verified profiles, connect with compatible matches, and find your soulmate today.",
  keywords: "matrimony, marriage, wedding, indian matrimony, life partner, bride, groom, matrimonial site",
  authors: [{ name: "Vivahavedi Matrimony" }],
  creator: "Vivahavedi Matrimony",
  publisher: "Vivahavedi Matrimony",
  robots: "index, follow",

  // Open Graph for social sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vivamatrimony.com",
    siteName: "Vivahavedi Matrimony",
    title: "Vivahavedi Matrimony - Find Your Perfect Life Partner",
    description: "Discover your ideal life partner on Vivahavedi Matrimony, a trusted Indian matrimonial platform.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vivahavedi Matrimony - Find Your Life Partner",
      }
    ],
  },

  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    title: "Vivahavedi Matrimony - Find Your Perfect Life Partner",
    description: "Discover your ideal life partner on Vivahavedi Matrimony, a trusted Indian matrimonial platform.",
    images: ["/twitter-card.jpg"],
    creator: "@vivamatrimony",
  },

  // Additional meta tags
  other: {
    'theme-color': '#ef4444',
    'msapplication-TileColor': '#ef4444',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  }
};
```

### Page-Specific SEO

#### Homepage SEO
```tsx
// app/page.tsx
export const metadata = {
  title: "Vivahavedi Matrimony - Find Your Perfect Life Partner | Indian Matrimonial Site",
  description: "India's most trusted matrimonial site with millions of verified profiles. Find your ideal life partner from your community. Join free and start your journey to find love.",
  alternates: {
    canonical: "https://vivamatrimony.com",
  }
};
```

#### Profile Pages SEO
```tsx
// app/profiles/page.tsx
export const metadata = {
  title: "Browse Matrimonial Profiles | Vivahavedi Matrimony",
  description: "Browse through thousands of verified matrimonial profiles. Filter by age, location, education, profession and more to find your perfect match.",
  alternates: {
    canonical: "https://vivamatrimony.com/profiles",
  }
};
```

#### Dynamic Profile SEO
```tsx
// app/profiles/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const profile = await fetchProfile(params.id);

  return {
    title: `${profile.name} - ${profile.age} years, ${profile.city} | Vivahavedi Matrimony`,
    description: `View ${profile.name}'s matrimonial profile. ${profile.education}, ${profile.profession} from ${profile.city}. Connect now on Vivahavedi Matrimony.`,
    alternates: {
      canonical: `https://vivamatrimony.com/profiles/${params.id}`,
    },
    openGraph: {
      title: `${profile.name}'s Matrimonial Profile`,
      description: `${profile.education}, ${profile.profession} from ${profile.city}`,
      images: [profile.photo],
    }
  };
}
```

### Structured Data (JSON-LD)

#### Organization Schema
```tsx
// components/StructuredData.tsx
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Vivahavedi Matrimony",
  "url": "https://vivamatrimony.com",
  "logo": "https://vivamatrimony.com/logo.png",
  "description": "Trusted Indian matrimonial site helping people find their life partners",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-XXXXXXXXXX",
    "contactType": "customer service",
    "availableLanguage": ["English", "Hindi"]
  },
  "sameAs": [
    "https://facebook.com/vivamatrimony",
    "https://twitter.com/vivamatrimony",
    "https://instagram.com/vivamatrimony"
  ]
};
```

#### WebSite Schema
```tsx
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Vivahavedi Matrimony",
  "url": "https://vivamatrimony.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://vivamatrimony.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};
```

#### Service Schema
```tsx
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Matrimonial Services",
  "provider": {
    "@type": "Organization",
    "name": "Vivahavedi Matrimony"
  },
  "description": "Professional matrimonial services to help you find your life partner",
  "serviceType": "Matrimonial",
  "areaServed": "India",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Matrimony Packages",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Basic Package"
        }
      }
    ]
  }
};
```

## On-Page SEO Best Practices

### URL Structure
```
https://vivamatrimony.com/                     # Homepage
https://vivamatrimony.com/profiles             # All profiles
https://vivamatrimony.com/profiles/[id]        # Individual profile
https://vivamatrimony.com/search?q=doctor      # Search results
https://vivamatrimony.com/community/punjabi    # Community pages
https://vivamatrimony.com/city/mumbai          # City pages
https://vivamatrimony.com/packages             # Pricing
https://vivamatrimony.com/success-stories      # Success stories
```

### Header Tags Hierarchy
```tsx
// Page structure example
<h1>Find Your Perfect Life Partner - Vivahavedi Matrimony</h1>
  <h2>Browse Profiles by Community</h2>
    <h3>Punjabi Matrimony</h3>
    <h3>Tamil Matrimony</h3>
  <h2>Success Stories</h2>
    <h3>Real Couples, Real Stories</h3>
```

### Content Optimization

#### Keyword Density Guidelines
- **Primary keyword**: 1-2% density
- **Secondary keywords**: 0.5-1% density
- **Related terms**: Natural inclusion
- **Avoid keyword stuffing**: Focus on readability

#### Content Structure
```tsx
// Example page structure
<article>
  <header>
    <h1>Primary Keyword in Title</h1>
    <meta description with keywords />
  </header>

  <section>
    <h2>Secondary keyword section</h2>
    <p>Content with natural keyword usage...</p>
  </section>

  <aside>
    <h3>Related Topics</h3>
    // Internal linking opportunities
  </aside>
</article>
```

## Image SEO

### Image Optimization
```tsx
// Next.js Image component with SEO
import Image from 'next/image';

<Image
  src="/profile-photo.jpg"
  alt="Priya Sharma - 28 years, Software Engineer from Mumbai - Matrimonial Profile"
  width={400}
  height={400}
  priority={true}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Image Naming Convention
```
// Good examples
profile-priya-sharma-mumbai-engineer.jpg
wedding-couple-success-story-delhi.jpg
matrimony-registration-form-banner.jpg

// Avoid
IMG_1234.jpg
photo.jpg
untitled.png
```

## Site Performance & Core Web Vitals

### Performance Optimization
```tsx
// app/layout.tsx - Preload critical resources
<head>
  <link rel="preload" href="/fonts/geist-sans.woff2" as="font" type="font/woff2" crossOrigin="" />
  <link rel="preload" href="/hero-image.webp" as="image" />
</head>
```

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5 seconds
- **FID (First Input Delay)**: < 100 milliseconds
- **CLS (Cumulative Layout Shift)**: < 0.1

### Performance Monitoring
```tsx
// app/layout.tsx - Web Vitals tracking
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

## Local SEO Implementation

### Location Pages Structure
```tsx
// app/city/[city]/page.tsx
export async function generateMetadata({ params }) {
  const city = params.city;
  return {
    title: `${city} Matrimony - Find Life Partner in ${city} | Vivahavedi Matrimony`,
    description: `Find your perfect life partner in ${city}. Browse verified matrimonial profiles from ${city}. Join Vivahavedi Matrimony today.`,
  };
}
```

### Local Business Schema
```tsx
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Vivahavedi Matrimony",
  "description": "Matrimonial services in India",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Business Address",
    "addressLocality": "City",
    "addressRegion": "State",
    "postalCode": "PIN",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "LATITUDE",
    "longitude": "LONGITUDE"
  }
};
```

## Content Marketing SEO

### Blog Structure
```
/blog/
├── /how-to-write-matrimonial-profile
├── /indian-wedding-traditions
├── /tips-for-first-meeting
├── /choosing-life-partner-checklist
└── /success-stories/
    ├── /mumbai-couple-love-story
    └── /arranged-marriage-success
```

### Blog Post SEO Template
```tsx
// app/blog/[slug]/page.tsx
export const metadata = {
  title: "How to Write the Perfect Matrimonial Profile | Vivahavedi Matrimony Blog",
  description: "Learn expert tips to create an attractive matrimonial profile that gets more matches. Step-by-step guide with examples.",
  keywords: "matrimonial profile, marriage profile, dating profile tips",
  authors: [{ name: "Vivahavedi Matrimony Editorial Team" }],
  openGraph: {
    type: "article",
    publishedTime: "2025-01-01T00:00:00.000Z",
    authors: ["Vivahavedi Matrimony Editorial Team"],
    tags: ["matrimony", "profile tips", "marriage"]
  }
};
```

## Internal Linking Strategy

### Link Structure
```tsx
// Contextual internal linking
<Link href="/profiles">
  Browse all matrimonial profiles
</Link>

<Link href="/community/punjabi">
  Punjabi matrimony profiles
</Link>

<Link href="/success-stories">
  Read our success stories
</Link>
```

### Footer Links
```tsx
// SEO-friendly footer navigation
<footer>
  <nav aria-label="Site navigation">
    <div className="grid grid-cols-4 gap-8">
      <div>
        <h3>Browse Profiles</h3>
        <Link href="/profiles">All Profiles</Link>
        <Link href="/community/punjabi">Punjabi Matrimony</Link>
        <Link href="/community/tamil">Tamil Matrimony</Link>
      </div>
      {/* More sections */}
    </div>
  </nav>
</footer>
```

## Mobile SEO

### Mobile-First Optimization
```tsx
// Responsive meta tags
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
```

### AMP Implementation (Future)
```tsx
// Potential AMP pages for better mobile performance
// app/amp/profiles/[id]/page.tsx
export default function AMPProfile() {
  return (
    <html ⚡>
      <head>
        <meta charSet="utf-8" />
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        {/* AMP-specific meta tags */}
      </head>
      <body>
        {/* AMP-compliant content */}
      </body>
    </html>
  );
}
```

## International SEO (Future)

### Multi-language Support
```tsx
// app/[locale]/layout.tsx
export const metadata = {
  other: {
    'x-default': 'https://vivamatrimony.com',
  },
  alternates: {
    canonical: 'https://vivamatrimony.com',
    languages: {
      'en': 'https://vivamatrimony.com',
      'hi': 'https://vivamatrimony.com/hi',
      'ta': 'https://vivamatrimony.com/ta',
      'te': 'https://vivamatrimony.com/te',
    }
  }
};
```

## SEO Monitoring & Analytics

### Google Analytics 4 Setup
```tsx
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="GA_MEASUREMENT_ID" />
      </body>
    </html>
  );
}
```

### Search Console Integration
```tsx
// public/robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /private/

Sitemap: https://vivamatrimony.com/sitemap.xml
```

### XML Sitemap Generation
```tsx
// app/sitemap.ts
export default function sitemap() {
  return [
    {
      url: 'https://vivamatrimony.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://vivamatrimony.com/profiles',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    // Dynamic profiles
    ...profiles.map((profile) => ({
      url: `https://vivamatrimony.com/profiles/${profile.id}`,
      lastModified: profile.updatedAt,
      priority: 0.8,
    })),
  ];
}
```

## SEO Testing Checklist

### Pre-Launch SEO Audit
- [ ] All pages have unique titles and meta descriptions
- [ ] URL structure is SEO-friendly
- [ ] Images have descriptive alt text
- [ ] Internal linking is implemented
- [ ] Structured data is present and valid
- [ ] Site loads under 3 seconds
- [ ] Mobile responsiveness is perfect
- [ ] SSL certificate is installed
- [ ] XML sitemap is generated
- [ ] Robots.txt is configured

### Ongoing SEO Tasks
- [ ] Weekly content publication
- [ ] Monthly keyword ranking analysis
- [ ] Quarterly site speed audits
- [ ] Regular competitor analysis
- [ ] User experience improvements
- [ ] Technical SEO maintenance

## Tools & Resources

### SEO Tools
- **Google Search Console**: Monitor search performance
- **Google Analytics**: Track user behavior
- **PageSpeed Insights**: Monitor site performance
- **SEMrush/Ahrefs**: Keyword research and competitor analysis
- **Schema.org**: Structured data validation

### Next.js SEO Resources
- Next.js SEO Documentation
- Vercel Analytics
- Next.js Image Optimization
- App Router SEO best practices

---

**Last Updated**: September 26, 2025
**SEO Guide Version**: 1.0.0
**Target Launch Date**: Q1 2025