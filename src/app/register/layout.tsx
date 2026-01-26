import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register - Create Your Account | vivahavedi Matrimony',
  description: 'Create your free account on vivahavedi and start your journey to find your perfect life partner. Join thousands of verified profiles from across India.',
  keywords: 'register, sign up, create account, vivahavedi registration, matrimony signup, join matrimony, free registration',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vivamatrimony.com/register',
    siteName: 'vivahavedi',
    title: 'Register - Create Your Account | vivahavedi Matrimony',
    description: 'Create your free account on vivahavedi and start your journey to find your perfect life partner.',
    images: [
      {
        url: 'https://www.vivahavedimatrimony.com/asset/images/matrimony/1568038436_logo.png',
        width: 1200,
        height: 630,
        alt: 'vivahavedi Matrimony - Register',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Register - Create Your Account | vivahavedi Matrimony',
    description: 'Create your free account on vivahavedi and start your journey to find your perfect life partner.',
    images: ['https://www.vivahavedimatrimony.com/asset/images/matrimony/1568038436_logo.png'],
  },
  alternates: {
    canonical: 'https://vivamatrimony.com/register',
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
