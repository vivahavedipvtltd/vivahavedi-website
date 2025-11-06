'use client';

import { Smartphone, Download, Star, Users } from 'lucide-react';

const MobileAppDownload = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-32 h-32 bg-red-100 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-pink-100 rounded-full opacity-40 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Download className="h-4 w-4 mr-2" />
              Free Mobile App
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Download FREE
              <span className="text-red-600 block">Mobile App</span>
            </h2>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl lg:max-w-none">
              Enjoy vivahavedi App on the go with our Android and iOS mobile devices.
              Find your perfect match anytime, anywhere.
            </p>

            {/* App Features */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Instant Chat</div>
                  <div className="text-sm text-gray-600">Connect instantly</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Smart Matches</div>
                  <div className="text-sm text-gray-600">AI-powered</div>
                </div>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="https://play.google.com/store/apps/details?id=com.vivahavedi.vivaapp&pli=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.9 12.45c-.3.25-.4.55-.4.9v6.8c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2v-6.8c0-.35-.1-.65-.4-.9L12 6.2 3.9 12.45zM12 8.8l5.9 4.7H6.1L12 8.8z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">Download on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>

              <div className="inline-flex items-center bg-gray-400 cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium shadow-lg opacity-75">
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">Coming Soon on</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </div>
            </div>

            {/* App Rating */}
            <div className="flex items-center justify-center lg:justify-start mt-6 space-x-6">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">4.8 Rating</span>
              </div>
              <div className="text-sm text-gray-600">1M+ Downloads</div>
            </div>
          </div>

          {/* Right Content - Phone Mockups */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main Phone */}
              <div className="relative w-64 h-[520px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl transform rotate-6 hover:rotate-3 transition-transform duration-500">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl"></div>

                  {/* Screen Content */}
                  <div className="pt-8 px-4 h-full bg-gradient-to-br from-red-50 to-pink-50">
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 bg-red-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                        <Smartphone className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">vivahavedi</h3>
                      <p className="text-xs text-gray-600">Find Your Perfect Match</p>
                    </div>

                    {/* Mock Profile Cards */}
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                              <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Phone */}
              <div className="absolute -top-8 -right-8 w-48 h-96 bg-gray-800 rounded-[2.5rem] p-2 shadow-xl transform -rotate-12 hover:-rotate-6 transition-transform duration-500">
                <div className="w-full h-full bg-gradient-to-br from-red-500 to-pink-500 rounded-[2rem] flex items-center justify-center">
                  <div className="text-center text-white">
                    <Download className="h-12 w-12 mx-auto mb-2" />
                    <div className="text-sm font-semibold">Download Now</div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                <Star className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppDownload;