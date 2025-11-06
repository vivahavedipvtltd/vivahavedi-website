'use client';

import Image from 'next/image';
import { Smartphone, Download, Star, Users } from 'lucide-react';

const MobileAppSection = () => {
  const features = [
    'Browse profiles on the go',
    'Instant notifications for new matches',
    'Secure messaging with matches',
    'Photo verification and safety features',
    'Advanced search filters',
    'Offline profile viewing'
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
          <div className="text-white relative overflow-hidden">
            {/* Background floating elements */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full animate-floating-slow"></div>
            <div className="absolute top-1/4 right-0 w-12 h-12 bg-pink-300/20 rounded-full animate-floating-fast"></div>
            <div className="absolute bottom-1/4 left-0 w-16 h-16 bg-yellow-300/15 rounded-full animate-floating-medium"></div>

            <div className="mb-8 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-in-left">
                <span className="inline-block animate-text-wave" style={{animationDelay: '0s'}}>F</span>
                <span className="inline-block animate-text-wave" style={{animationDelay: '0.1s'}}>i</span>
                <span className="inline-block animate-text-wave" style={{animationDelay: '0.2s'}}>n</span>
                <span className="inline-block animate-text-wave" style={{animationDelay: '0.3s'}}>d</span>
                <span className="inline-block animate-text-wave" style={{animationDelay: '0.4s'}}>&nbsp;</span>
                <span className="inline-block animate-text-wave" style={{animationDelay: '0.5s'}}>L</span>
                <span className="inline-block animate-text-wave" style={{animationDelay: '0.6s'}}>o</span>
                <span className="inline-block animate-text-wave" style={{animationDelay: '0.7s'}}>v</span>
                <span className="inline-block animate-text-wave" style={{animationDelay: '0.8s'}}>e</span>
                <span className="inline-block animate-text-wave" style={{animationDelay: '0.9s'}}>&nbsp;</span>
                <span className="inline-block animate-text-wave" style={{animationDelay: '1s'}}>o</span>
                <span className="inline-block animate-text-wave" style={{animationDelay: '1.1s'}}>n</span>
                <span className="inline-block animate-text-wave" style={{animationDelay: '1.2s'}}>&nbsp;</span>
                <span className="inline-block animate-text-wave" style={{animationDelay: '1.3s'}}>t</span>
                <span className="inline-block animate-text-wave" style={{animationDelay: '1.4s'}}>h</span>
                <span className="inline-block animate-text-wave" style={{animationDelay: '1.5s'}}>e</span>
                <span className="inline-block animate-text-wave" style={{animationDelay: '1.6s'}}>&nbsp;</span>
                <span className="inline-block animate-text-wave" style={{animationDelay: '1.7s'}}>G</span>
                <span className="inline-block animate-text-wave" style={{animationDelay: '1.8s'}}>o</span>
              </h2>
              <p className="text-xl text-red-100 mb-6 animate-fade-in-up" style={{animationDelay: '2s'}}>
                Download the vivahavedi mobile app and discover your perfect match anytime, anywhere.
              </p>
            </div>

            {/* App Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center transform hover:scale-110 transition-all duration-300 animate-count-bounce" style={{animationDelay: '2.5s'}}>
                <div className="text-2xl font-bold mb-1 bg-white/20 backdrop-blur-sm rounded-lg py-2 px-4 animate-number-glow">
                  <span className="animate-counter">1M+</span>
                </div>
                <div className="text-red-100 text-sm animate-fade-in-up" style={{animationDelay: '2.7s'}}>App Downloads</div>
              </div>
              <div className="text-center transform hover:scale-110 transition-all duration-300 animate-count-bounce" style={{animationDelay: '2.8s'}}>
                <div className="text-2xl font-bold mb-1 bg-white/20 backdrop-blur-sm rounded-lg py-2 px-4 animate-number-glow">
                  <span className="animate-counter">4.8★</span>
                </div>
                <div className="text-red-100 text-sm animate-fade-in-up" style={{animationDelay: '3s'}}>App Store Rating</div>
              </div>
            </div>

            {/* Features List */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 animate-slide-in-left" style={{animationDelay: '3.2s'}}>App Features:</h3>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-red-100 transform hover:translate-x-2 transition-all duration-300 animate-feature-slide"
                    style={{animationDelay: `${3.5 + (index * 0.2)}s`}}
                  >
                    <div className="relative mr-3">
                      <Star className="h-4 w-4 text-yellow-300 fill-current animate-star-twinkle" style={{animationDelay: `${4 + (index * 0.1)}s`}} />
                      <div className="absolute inset-0 bg-yellow-300/30 rounded-full animate-ping" style={{animationDelay: `${4.2 + (index * 0.1)}s`}}></div>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Download Buttons - Coming Soon */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-gray-400 cursor-not-allowed text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center space-x-3 opacity-75 animate-button-bounce" style={{animationDelay: '5.5s'}}>
                <span className="text-sm">Coming Soon on Google Play</span>
              </div>
              <div className="bg-gray-400 cursor-not-allowed text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center space-x-3 opacity-75 animate-button-bounce" style={{animationDelay: '5.8s'}}>
                <span className="text-sm">Coming Soon on App Store</span>
              </div>
            </div>
          </div>

          {/* Right Content - Phone Mockups */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Main Phone */}
            <div className="relative z-10 animate-phone-float" style={{animationDelay: '1s'}}>
              <div className="bg-gray-900 rounded-3xl p-4 shadow-2xl transform rotate-6 hover:rotate-3 transition-all duration-500 animate-phone-slide-in">
                <div className="bg-white rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                    alt="App Screenshot"
                    width={300}
                    height={384}
                    className="w-full h-96 object-cover animate-screen-glow"
                  />
                </div>
              </div>
            </div>

            {/* Secondary Phone */}
            <div className="absolute top-8 right-8 z-0 animate-phone-float" style={{animationDelay: '1.5s'}}>
              <div className="bg-gray-900 rounded-3xl p-4 shadow-2xl transform -rotate-6 hover:rotate-3 transition-all duration-500 animate-phone-slide-in-right">
                <div className="bg-white rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                    alt="App Screenshot"
                    width={300}
                    height={320}
                    className="w-full h-80 object-cover animate-screen-glow"
                  />
                </div>
              </div>
            </div>

            {/* Floating Elements with Enhanced Animations */}
            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full p-3 animate-float-icon hover:scale-125 transition-all duration-300" style={{animationDelay: '2s'}}>
              <Download className="h-6 w-6 text-white animate-icon-bounce" />
            </div>
            <div className="absolute bottom-4 left-8 bg-white/20 backdrop-blur-sm rounded-full p-3 animate-float-icon hover:scale-125 transition-all duration-300" style={{animationDelay: '2.5s'}}>
              <Users className="h-6 w-6 text-white animate-icon-bounce" />
            </div>
            <div className="absolute top-1/2 left-4 bg-white/20 backdrop-blur-sm rounded-full p-3 animate-float-icon hover:scale-125 transition-all duration-300" style={{animationDelay: '3s'}}>
              <Smartphone className="h-6 w-6 text-white animate-icon-bounce" />
            </div>

            {/* Additional floating particles */}
            <div className="absolute top-16 right-4 w-3 h-3 bg-yellow-300/60 rounded-full animate-particle-float" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-20 right-16 w-2 h-2 bg-pink-300/60 rounded-full animate-particle-float" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute top-1/3 right-2 w-4 h-4 bg-blue-300/50 rounded-full animate-particle-float" style={{animationDelay: '2.5s'}}></div>
          </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA - Full Width Light Section */}
      <div className="bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Find Your Perfect Match?
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Join millions of users who found love through vivahavedi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-red-500 text-white hover:bg-red-600 px-8 py-4 rounded-full font-semibold text-lg transition-colors duration-200 shadow-lg">
                Register Free
              </button>
              <button className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors duration-200">
                Browse Profiles
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;