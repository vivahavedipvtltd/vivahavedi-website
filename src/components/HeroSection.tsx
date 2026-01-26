import Image from 'next/image';
import { Heart, Users, Shield, Star } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-100 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-pink-100 rounded-full opacity-60 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-red-200 rounded-full opacity-30 animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Heart className="h-4 w-4 mr-2" />
                India&apos;s Most Trusted Matrimonial Platform
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Find Your
                <span className="text-red-600 block">Perfect Match</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-2xl lg:max-w-none">
                Join millions of happy families who found their life partner through vivahavedi.
                Simple, secure, and trusted for over 15 years.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Start Free Registration
                </button>
                <button className="border-2 border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200">
                  Browse Profiles
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-2">
                    <Users className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">10M+</div>
                  <div className="text-sm text-gray-600">Happy Users</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-2">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">Verified</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-2">
                    <Star className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">15+</div>
                  <div className="text-sm text-gray-600">Years</div>
                </div>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/hero_image.png"
                  alt="Happy couple in traditional Kerala wedding attire"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>

              {/* Floating Success Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">50,000+</div>
                    <div className="text-sm text-gray-600">Success Stories</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;