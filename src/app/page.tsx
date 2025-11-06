'use client';

import { lazy, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import HeroSection from '@/components/HeroSection';
import BackToTop from '@/components/BackToTop';
import ClientScrollManager from '@/components/ClientScrollManager';

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
        <div id="hero" className="gpu-accelerated">
          <HeroSection />
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <div id="search">
            <SearchSection />
          </div>
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <div id="profiles">
            <FeaturedProfiles />
          </div>
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <div id="find-special-someone">
            <FindSpecialSomeone />
          </div>
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <div id="why-choose-us">
            <WhyChooseUs />
          </div>
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <div id="success-stories">
            <SuccessStories />
          </div>
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <div id="mobile-app">
            <MobileAppDownload />
          </div>
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <div id="faq">
            <FAQ />
          </div>
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
