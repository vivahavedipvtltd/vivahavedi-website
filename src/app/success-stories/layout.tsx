import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Success Stories - Real Couples Who Found Love | vivahavedi Matrimony',
  description: 'Read inspiring success stories of real couples who found their perfect match on vivahavedi. Discover how thousands of people found their soulmates and started their journey together. Join India\'s most trusted matrimonial platform today.',
  keywords: [
    'success stories',
    'matrimony success stories',
    'vivahavedi success',
    'happy couples',
    'marriage success stories',
    'real love stories',
    'matrimonial success',
    'wedding stories',
    'couple testimonials',
    'vivahavedi reviews',
    'indian wedding stories',
    'arranged marriage success',
    'matrimony testimonials',
    'bride and groom stories',
    'successful marriages'
  ].join(', '),
  authors: [{ name: 'vivahavedi' }],
  creator: 'vivahavedi',
  publisher: 'vivahavedi',
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
    url: 'https://vivamatrimony.com/success-stories',
    siteName: 'vivahavedi',
    title: 'Success Stories - Real Couples Who Found Love | vivahavedi',
    description: 'Read inspiring success stories of real couples who found their perfect match on vivahavedi. Join thousands of happy couples today.',
    images: [
      {
        url: '/success-stories-og.jpg',
        width: 1200,
        height: 630,
        alt: 'vivahavedi Success Stories - Real Couples Who Found Love',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Success Stories - Real Couples Who Found Love | vivahavedi',
    description: 'Read inspiring success stories of real couples who found their perfect match on vivahavedi.',
    images: ['/success-stories-og.jpg'],
    creator: '@vivahavedi',
  },
  alternates: {
    canonical: 'https://vivamatrimony.com/success-stories',
  },
  other: {
    'article:section': 'Success Stories',
    'article:tag': 'matrimony, success stories, happy couples, marriages',
  },
};

export default function SuccessStoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
