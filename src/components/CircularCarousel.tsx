'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Shield, Users, Heart, Award, CheckCircle, Clock } from 'lucide-react';

const CircularCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
      id: 0,
      icon: Shield,
      title: "100% Verified",
      highlight: "Profiles",
      description: "Every profile goes through our rigorous verification process to ensure authenticity and safety. We manually verify photos, contact details, and background information to provide you with genuine matches.",
      buttonText: "View Verified Profiles",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 1,
      icon: Users,
      title: "2M+ Active",
      highlight: "Members",
      description: "Join our thriving community of over 2 million verified members actively looking for their life partner. Our diverse user base increases your chances of finding the perfect match.",
      buttonText: "Join Community",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 2,
      icon: Heart,
      title: "Advanced AI",
      highlight: "Matching",
      description: "Our intelligent matchmaking algorithm analyzes compatibility based on personality, interests, values, and preferences to suggest the most suitable partners for you.",
      buttonText: "Find Matches",
      color: "from-red-500 to-pink-500"
    },
    {
      id: 3,
      icon: Award,
      title: "15+ Years of",
      highlight: "Trust",
      description: "With over 15 years of experience in matchmaking, we have successfully brought together thousands of couples. Our proven track record speaks for our commitment to your happiness.",
      buttonText: "Success Stories",
      color: "from-purple-500 to-violet-500"
    },
    {
      id: 4,
      icon: CheckCircle,
      title: "Secure &",
      highlight: "Private",
      description: "Your privacy is our top priority. We use advanced security measures to protect your personal information and give you complete control over who can view your profile.",
      buttonText: "Privacy Policy",
      color: "from-orange-500 to-amber-500"
    },
    {
      id: 5,
      icon: Clock,
      title: "24/7 Customer",
      highlight: "Support",
      description: "Our dedicated support team is available round the clock to assist you in your matrimonial journey. Get help with profile creation, matching, and any other queries.",
      buttonText: "Get Support",
      color: "from-teal-500 to-cyan-500"
    }
  ];

  const totalSlides = slides.length;

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalSlides, isAutoPlaying]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
      setIsTransitioning(false);
    }, 150);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
      setIsTransitioning(false);
    }, 150);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    if (index === currentSlide) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 150);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 py-20 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-red-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" style={{animationDelay: '4s'}}></div>

        {/* Floating Hearts */}
        <div className="absolute top-20 left-20 text-red-300 animate-float opacity-60">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="absolute top-40 right-32 text-pink-300 animate-float opacity-40" style={{animationDelay: '1s'}}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="absolute bottom-32 left-1/4 text-purple-300 animate-float opacity-50" style={{animationDelay: '3s'}}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Sparkle Effects */}
        <div className="absolute top-32 right-20 animate-twinkle">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div className="absolute bottom-40 right-40 animate-twinkle" style={{animationDelay: '2s'}}>
          <svg className="w-3 h-3 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent text-sm font-bold tracking-wider uppercase animate-pulse">
              ✨ Trusted by Millions ✨
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            WHY CHOOSE{' '}
            <span className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
              VIVAMATRIMONY
            </span>
          </h2>
        </div>

        <div className="relative max-w-7xl mx-auto overflow-hidden">
          {/* Circular Carousel Container */}
          <div className="relative h-[700px] flex items-center justify-center overflow-hidden">

            {/* Center Content */}
            <div className="relative z-20 max-w-sm sm:max-w-lg mx-4 text-center bg-white/90 backdrop-blur-lg rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/50 transform hover:scale-105 transition-all duration-500">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-pink-500/20 to-purple-500/20 rounded-3xl blur-lg"></div>

              <div className={`relative z-10 transition-all duration-500 ${isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${slides[currentSlide].color} mb-6 shadow-lg animate-bounce-subtle transition-all duration-500`}>
                  {(() => {
                    const IconComponent = slides[currentSlide].icon;
                    return <IconComponent className="w-10 h-10 text-white drop-shadow-lg" />;
                  })()}
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-3 leading-tight transition-all duration-500">
                  {slides[currentSlide].title}{' '}
                  <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                    {slides[currentSlide].highlight}
                  </span>
                </h3>

                <p className="text-gray-700 leading-relaxed mb-8 text-lg transition-all duration-500">
                  {slides[currentSlide].description}
                </p>

                <button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  {slides[currentSlide].buttonText} →
                </button>

                {/* Decorative Elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Circular Connection Line */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
              <svg
                width="600"
                height="600"
                viewBox="0 0 600 600"
                className="w-full max-w-[600px] h-auto aspect-square"
              >
                <circle
                  cx="300"
                  cy="300"
                  r="276"
                  fill="none"
                  stroke="url(#circularGradient)"
                  strokeWidth="3"
                  strokeDasharray="10 5"
                  className="animate-dash"
                />
                <defs>
                  <linearGradient id="circularGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity="0.6" />
                    <stop offset="25%" stopColor="rgb(236, 72, 153)" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="rgb(168, 85, 247)" stopOpacity="0.6" />
                    <stop offset="75%" stopColor="rgb(59, 130, 246)" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Circular Navigation Dots */}
            <div className="absolute w-full h-full">
              {slides.map((slide, index) => {
                // Calculate the angle for each dot relative to the current slide
                // Start from top (-90 degrees) and arrange dots clockwise
                const baseAngle = (index * 60) - 90; // Base position for each dot
                const rotationOffset = -currentSlide * 60; // Rotation based on current slide
                const finalAngle = (baseAngle + rotationOffset) * (Math.PI / 180);

                // Use the same radius as SVG circle for perfect alignment
                const radius = 276;
                const x = Math.cos(finalAngle) * radius;
                const y = Math.sin(finalAngle) * radius;

                return (
                  <button
                    key={slide.id}
                    onClick={() => goToSlide(index)}
                    className={`absolute w-16 h-16 rounded-full transition-all duration-1000 hover:animate-pulse z-20 ${
                      index === currentSlide
                        ? 'scale-150 bg-white shadow-[0_0_30px_rgba(239,68,68,0.6)]'
                        : 'scale-100 shadow-xl bg-white/90 backdrop-blur-sm hover:scale-125 hover:shadow-2xl border-2 border-white/50'
                    }`}
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: `translate(-50%, -50%)`,
                      transitionDuration: '1000ms'
                    }}
                  >
                    <div className={`w-full h-full rounded-full bg-gradient-to-r ${slide.color} flex items-center justify-center shadow-inner relative overflow-hidden`}>
                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shine"></div>

                      {(() => {
                        const IconComponent = slide.icon;
                        return <IconComponent className="w-7 h-7 text-white drop-shadow-md relative z-10" />;
                      })()}
                    </div>

                  </button>
                );
              })}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 sm:left-8 lg:left-12 top-1/2 transform -translate-y-1/2 z-30 bg-white/90 backdrop-blur-sm hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 text-gray-600 hover:text-white p-3 sm:p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white/50 hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 sm:right-8 lg:right-12 top-1/2 transform -translate-y-1/2 z-30 bg-white/90 backdrop-blur-sm hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 text-gray-600 hover:text-white p-3 sm:p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white/50 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Bottom Progress Indicators */}
          <div className="flex justify-center mt-12 space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all duration-500 relative ${
                  index === currentSlide
                    ? 'w-8 h-3 bg-gradient-to-r from-red-500 to-pink-500 scale-125 shadow-lg'
                    : 'w-3 h-3 bg-gray-400/50 hover:bg-red-400/70 hover:scale-110 shadow-md'
                }`}
              >
                {index === currentSlide && (
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.4; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); }
          50% { box-shadow: 0 0 40px rgba(239, 68, 68, 0.8), 0 0 60px rgba(236, 72, 153, 0.3); }
        }

        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(300%) skewX(-12deg); }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        @keyframes dash {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 60;
          }
        }

        .animate-dash {
          animation: dash 4s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default CircularCarousel;