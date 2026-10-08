import type { Metadata } from 'next';

// Private link: keep it out of search engines and don't leak the token through the Referer header.
export const metadata: Metadata = {
  title: 'Your matches',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default function MatchesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
