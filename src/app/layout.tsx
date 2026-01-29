import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { SWRProvider } from "@/components/providers/SWRProvider";
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
  metadataBase: new URL("https://vivahavedimatrimony.com"),
  title: "vivahavedi - Find Your Perfect Life Partner | Indian Matrimonial Site",
  description: "Discover your ideal life partner on vivahavedi, a trusted Indian matrimonial platform. Browse verified profiles, connect with compatible matches, and find your soulmate today.",
  keywords: "matrimony, marriage, wedding, indian matrimony, life partner, bride, groom, matrimonial site",
  authors: [{ name: "vivahavedi" }],
  creator: "vivahavedi",
  publisher: "vivahavedi",
  applicationName: "vivahavedi Matrimony",
  robots: "index, follow",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "vivahavedi",
  },
  alternates: {
    canonical: "https://vivahavedimatrimony.com",
    languages: {
      "en-IN": "https://vivahavedimatrimony.com",
      "hi-IN": "https://vivahavedimatrimony.com/hi",
      "ta-IN": "https://vivahavedimatrimony.com/ta",
      "te-IN": "https://vivahavedimatrimony.com/te",
      "kn-IN": "https://vivahavedimatrimony.com/kn",
      "ml-IN": "https://vivahavedimatrimony.com/ml",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vivahavedimatrimony.com",
    siteName: "vivahavedi",
    title: "vivahavedi - Find Your Perfect Life Partner",
    description: "Discover your ideal life partner on vivahavedi, a trusted Indian matrimonial platform.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "vivahavedi - India's Most Trusted Matrimonial Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "vivahavedi - Find Your Perfect Life Partner",
    description: "Discover your ideal life partner on vivahavedi, a trusted Indian matrimonial platform.",
    images: ["/twitter-image"],
    creator: "@vivahavedi",
    site: "@vivahavedi",
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
        <meta name="theme-color" content="#dc2626" />
        <meta name="theme-color" content="#dc2626" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#991b1b" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="vivahavedi" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="canonical" href="https://vivahavedimatrimony.com" />
        <link rel="manifest" href="/manifest.json" />
        <script dangerouslySetInnerHTML={{ __html: performanceScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <SWRProvider>
            <AuthProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </AuthProvider>
          </SWRProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
