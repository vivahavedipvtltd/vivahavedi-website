'use client';

import { useEffect, useRef, useState } from 'react';
import { Users, UserCheck, Headphones, MapPin, Shield, Heart, Sparkles, Award } from 'lucide-react';

interface Feature {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  stats: string;
  delay: number;
}

const WhyChooseUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const features: Feature[] = [
    {
      id: 1,
      icon: Users,
      title: "10 Million+ Profiles",
      description: "Largest collection of verified matrimonial profiles with 50,000+ success stories",
      stats: "50K+ Success Stories",
      delay: 0
    },
    {
      id: 2,
      icon: UserCheck,
      title: "One-Time Registration",
      description: "Simple registration process with no renewal charges. Create once, use forever",
      stats: "No Hidden Charges",
      delay: 200
    },
    {
      id: 3,
      icon: Headphones,
      title: "24/7 Customer Care",
      description: "Dedicated support team to assist you from registration to successful marriage",
      stats: "Round-the-clock Support",
      delay: 400
    },
    {
      id: 4,
      icon: MapPin,
      title: "Pan-India Presence",
      description: "20+ branches across India with 500+ dedicated relationship managers",
      stats: "500+ Staff Members",
      delay: 600
    },
    {
      id: 5,
      icon: Shield,
      title: "100% Verified Profiles",
      description: "Every profile is manually verified for authenticity and genuine connections",
      stats: "Trust & Safety",
      delay: 800
    },
    {
      id: 6,
      icon: Sparkles,
      title: "Advanced AI Matching",
      description: "Smart algorithms find your perfect match based on compatibility and preferences",
      stats: "Smart Technology",
      delay: 1000
    }
  ];

  useEffect(() => {
    // Set mounted state to show content immediately if observer fails
    setIsMounted(true);

    // Check if IntersectionObserver is supported
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback for older browsers - show content immediately
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1, // Reduced from 0.3 to 0.1 (10%) for better mobile trigger
        rootMargin: '50px' // Add margin to trigger earlier on mobile
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Fallback timeout - ensure cards show even if observer doesn't trigger
    const fallbackTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-gradient-to-br from-gray-50 via-white to-red-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-40 h-40 bg-red-100 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-pink-100 rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-red-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center bg-red-100 text-red-800 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
            <Heart className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2" />
            Why Choose Us
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 px-4">
            What Makes
            <span className="text-red-600 block">vivahavedi Special</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Discover why millions of families trust vivahavedi for finding their perfect life partner.
            Experience the difference with our premium matrimonial services.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className={`group transform transition-all duration-700 ${
                  isMounted && isVisible
                    ? 'translate-y-0 opacity-100'
                    : isMounted
                    ? 'translate-y-4 opacity-0'
                    : 'translate-y-0 opacity-100'
                }`}
                style={{
                  transitionDelay: isMounted && isVisible ? `${feature.delay}ms` : '0ms'
                }}
              >
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 h-full">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    {/* Floating badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Award className="h-3 w-3 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                      {feature.stats}
                    </span>
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-500 transition-all duration-300">
                      <Sparkles className="h-4 w-4 text-red-500 group-hover:text-white" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 md:mt-16 text-center">
          <div className={`transform transition-all duration-1000 ${
            isMounted && isVisible ? 'translate-y-0 opacity-100' : isMounted ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
          }`} style={{ transitionDelay: isMounted && isVisible ? '1200ms' : '0ms' }}>
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white rounded-full"></div>
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                  Ready to Find Your Perfect Match?
                </h3>
                <p className="text-sm md:text-base text-red-100 mb-4 md:mb-6 max-w-2xl mx-auto">
                  Join millions of happy families who found their life partner through vivahavedi.
                  Start your journey today with our trusted matrimonial platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button className="bg-white text-red-600 hover:bg-red-50 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    Register Free Now
                  </button>
                  <button className="border-2 border-white text-white hover:bg-white hover:text-red-600 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all duration-200">
                    Explore Features
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;