import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Download vivahavedi Mobile App - Find Your Life Partner on the Go | Android & iOS',
  description: 'Download the free vivahavedi matrimony app for Android and iOS. Find your perfect match anytime, anywhere with instant chat, smart notifications, verified profiles, and advanced search. Rated 4.8 stars with 1M+ downloads.',
  keywords: [
    'vivahavedi app',
    'matrimony app',
    'marriage app download',
    'matrimonial app android',
    'matrimonial app ios',
    'vivahavedi mobile app',
    'indian matrimony app',
    'wedding app',
    'matchmaking app',
    'shaadi app',
    'marriage app free download',
    'best matrimony app',
    'matrimonial app free',
    'bride groom app',
    'vivahavedi android app',
    'vivahavedi ios app',
    'matrimony app india',
    'marriage finder app'
  ].join(', '),
  authors: [{ name: 'vivahavedi' }],
  creator: 'vivahavedi',
  publisher: 'vivahavedi',
  applicationName: 'vivahavedi',
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vivahavedimatrimony.com/mobile-app',
    siteName: 'vivahavedi',
    title: 'Download vivahavedi Mobile App - Find Your Life Partner on the Go',
    description: 'Download the free vivahavedi matrimony app. Instant chat, verified profiles, smart matches. Rated 4.8 stars with 1M+ downloads.',
    images: [
      {
        url: '/mobile-app-og.jpg',
        width: 1200,
        height: 630,
        alt: 'vivahavedi Mobile App - Download Now',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Download vivahavedi Mobile App - Find Your Life Partner',
    description: 'Free matrimony app with instant chat, verified profiles, and smart matches. Download now!',
    images: ['/mobile-app-og.jpg'],
    creator: '@vivahavedi',
  },
  alternates: {
    canonical: 'https://vivahavedimatrimony.com/mobile-app',
  },
  appLinks: {
    android: {
      package: 'com.vivahavedi.vivaapp',
      url: 'https://play.google.com/store/apps/details?id=com.vivahavedi.vivaapp&pli=1',
    },
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'vivahavedi',
    'application-name': 'vivahavedi',
    'msapplication-TileColor': '#dc2626',
    'theme-color': '#dc2626',
  },
};

export default function MobileAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
