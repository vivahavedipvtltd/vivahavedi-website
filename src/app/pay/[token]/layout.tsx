import type { Metadata } from 'next';

// Private, per-customer payment page: keep it out of search results.
export const metadata: Metadata = {
  title: 'Complete your payment',
  robots: { index: false, follow: false },
};

export default function PayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
