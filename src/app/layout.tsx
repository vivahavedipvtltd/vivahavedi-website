import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./globals.css";

// Performance monitoring script
const performanceScript = `
  // Load performance monitoring
  (function() {
    if ('performance' in window) {
      // Monitor Core Web Vitals
      function measureCWV() {
        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            console.log('FID:', entry.processingStart - entry.startTime);
          }
        }).observe({entryTypes: ['first-input']});

        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime);
        }).observe({entryTypes: ['largest-contentful-paint']});

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          console.log('CLS:', clsValue);
        }).observe({entryTypes: ['layout-shift']});
      }

      if (document.readyState === 'complete') {
        measureCWV();
      } else {
        window.addEventListener('load', measureCWV);
      }
    }
  })();
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "vivahavedi - Find Your Perfect Life Partner | Indian Matrimonial Site",
  description: "Discover your ideal life partner on vivahavedi, a trusted Indian matrimonial platform. Browse verified profiles, connect with compatible matches, and find your soulmate today.",
  keywords: "matrimony, marriage, wedding, indian matrimony, life partner, bride, groom, matrimonial site",
  authors: [{ name: "vivahavedi" }],
  creator: "vivahavedi",
  publisher: "vivahavedi",
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vivamatrimony.com",
    siteName: "vivahavedi",
    title: "vivahavedi - Find Your Perfect Life Partner",
    description: "Discover your ideal life partner on vivahavedi, a trusted Indian matrimonial platform.",
  },
  twitter: {
    card: "summary_large_image",
    title: "vivahavedi - Find Your Perfect Life Partner",
    description: "Discover your ideal life partner on vivahavedi, a trusted Indian matrimonial platform.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://vivamatrimony.com" />
        <script dangerouslySetInnerHTML={{ __html: performanceScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
