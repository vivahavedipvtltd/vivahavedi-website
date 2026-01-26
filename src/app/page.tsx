import { lazy, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import HeroSection from '@/components/HeroSection';
import BackToTop from '@/components/BackToTop';
import ClientScrollManager from '@/components/ClientScrollManager';
import ErrorBoundary from '@/components/ErrorBoundary';
import SectionErrorFallback from '@/components/SectionErrorFallback';

// Keep essential sections with animations for elegant experience
const SearchSection = lazy(() => import('@/components/SearchSection'));
const FeaturedProfiles = lazy(() => import('@/components/FeaturedProfiles'));
const FindSpecialSomeone = lazy(() => import('@/components/FindSpecialSomeone'));
const WhyChooseUs = lazy(() => import('@/components/WhyChooseUs'));
const SuccessStories = lazy(() => import('@/components/SuccessStories'));
const MobileAppDownload = lazy(() => import('@/components/MobileAppDownload'));
const FAQ = lazy(() => import('@/components/FAQ'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
  </div>
);

export default function Home() {
  return (
    <>
      <ClientScrollManager />
      <ScrollProgress />
      <Header />
      <main>
        <ErrorBoundary fallback={<SectionErrorFallback message="Unable to load hero section" />}>
          <div id="hero" className="gpu-accelerated">
            <HeroSection />
          </div>
        </ErrorBoundary>

        <ErrorBoundary fallback={<SectionErrorFallback message="Unable to load search section" />}>
          <Suspense fallback={<LoadingSpinner />}>
            <div id="search">
              <SearchSection />
            </div>
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<SectionErrorFallback message="Unable to load featured profiles" />}>
          <Suspense fallback={<LoadingSpinner />}>
            <div id="profiles">
              <FeaturedProfiles />
            </div>
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<SectionErrorFallback message="Unable to load this section" />}>
          <Suspense fallback={<LoadingSpinner />}>
            <div id="find-special-someone">
              <FindSpecialSomeone />
            </div>
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<SectionErrorFallback message="Unable to load this section" />}>
          <Suspense fallback={<LoadingSpinner />}>
            <div id="why-choose-us">
              <WhyChooseUs />
            </div>
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<SectionErrorFallback message="Unable to load success stories" />}>
          <Suspense fallback={<LoadingSpinner />}>
            <div id="success-stories">
              <SuccessStories />
            </div>
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<SectionErrorFallback message="Unable to load mobile app section" />}>
          <Suspense fallback={<LoadingSpinner />}>
            <div id="mobile-app">
              <MobileAppDownload />
            </div>
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<SectionErrorFallback message="Unable to load FAQ section" />}>
          <Suspense fallback={<LoadingSpinner />}>
            <div id="faq">
              <FAQ />
            </div>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
