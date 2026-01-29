'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Smartphone,
  Download,
  Star,
  Users,
  MessageCircle,
  Shield,
  Bell,
  Heart,
  Search,
  Lock,
  Zap,
  Camera,
  CheckCircle,
  PlayCircle
} from 'lucide-react';

export default function MobileAppPage() {
  const features = [
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Find your perfect match with powerful filters and AI-powered recommendations',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: MessageCircle,
      title: 'Instant Chat',
      description: 'Connect with matches instantly through our secure messaging platform',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Get real-time alerts for new matches, messages, and profile views',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Shield,
      title: 'Verified Profiles',
      description: 'Browse authentic profiles with photo and ID verification',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Camera,
      title: 'Photo Gallery',
      description: 'Upload and view multiple photos with privacy controls',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      icon: Lock,
      title: 'Privacy Control',
      description: 'Manage who can view your profile and contact you',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: Heart,
      title: 'Save Favorites',
      description: 'Shortlist profiles and come back to them anytime',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: Zap,
      title: 'Fast & Smooth',
      description: 'Lightning-fast performance with smooth user experience',
      color: 'bg-indigo-100 text-indigo-600'
    }
  ];

  const benefits = [
    'Search profiles anytime, anywhere',
    'Receive instant match notifications',
    'Chat with potential partners on the go',
    'Upload photos directly from your phone',
    'Get verified profile badges',
    'Access to premium features',
    'Offline mode for saved profiles',
    'Multi-language support'
  ];

  const appScreens = [
    { title: 'Home', description: 'Browse matching profiles' },
    { title: 'Search', description: 'Advanced filtering options' },
    { title: 'Profile', description: 'Detailed profile information' },
    { title: 'Chat', description: 'Real-time messaging' }
  ];

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-20 relative overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-float"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Download className="h-4 w-4 mr-2" />
                  Free Mobile App
                </div>

                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
                  Download FREE
                  <span className="block mt-2">vivahavedi Mobile App</span>
                </h1>

                <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl lg:max-w-none">
                  Find your perfect life partner on the go. Available on Android and iOS devices.
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold">1M+</div>
                    <div className="text-sm text-white/80">Downloads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">4.8</div>
                    <div className="text-sm text-white/80">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">50K+</div>
                    <div className="text-sm text-white/80">Success Stories</div>
                  </div>
                </div>

                {/* Download Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.vivahavedi.vivaapp&pli=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-black hover:bg-gray-800 text-white px-6 py-4 rounded-xl font-medium shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.9 12.45c-.3.25-.4.55-.4.9v6.8c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2v-6.8c0-.35-.1-.65-.4-.9L12 6.2 3.9 12.45zM12 8.8l5.9 4.7H6.1L12 8.8z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-xs">GET IT ON</div>
                      <div className="text-lg font-bold">Google Play</div>
                    </div>
                  </a>

                  <div className="inline-flex items-center bg-white/20 backdrop-blur-sm cursor-not-allowed text-white px-6 py-4 rounded-xl font-medium shadow-xl opacity-75">
                    <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-xs">COMING SOON ON</div>
                      <div className="text-lg font-bold">App Store</div>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-white/90 font-medium">4.8 out of 5</span>
                </div>
              </div>

              {/* Right Content - Phone Mockups */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative">
                  {/* Main Phone */}
                  <div className="relative w-72 h-[580px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl transform rotate-6 hover:rotate-3 transition-transform duration-500">
                    <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-10"></div>

                      {/* Screen Content */}
                      <div className="pt-10 px-5 h-full bg-gradient-to-br from-red-50 to-pink-50">
                        <div className="text-center mb-6">
                          <div className="w-14 h-14 bg-red-500 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                            <Smartphone className="h-7 w-7 text-white" />
                          </div>
                          <h3 className="font-bold text-gray-900 text-xl">vivahavedi</h3>
                          <p className="text-sm text-gray-600">Find Your Perfect Match</p>
                        </div>

                        {/* Mock Profile Cards */}
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl p-4 shadow-md">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-red-200 to-pink-200 rounded-full"></div>
                                <div className="flex-1">
                                  <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
                                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Phone */}
                  <div className="absolute -top-8 -right-8 w-56 h-[440px] bg-gray-800 rounded-[2.5rem] p-2 shadow-xl transform -rotate-12 hover:-rotate-6 transition-transform duration-500">
                    <div className="w-full h-full bg-gradient-to-br from-red-500 to-pink-500 rounded-[2rem] flex items-center justify-center">
                      <div className="text-center text-white p-6">
                        <Download className="h-16 w-16 mx-auto mb-4 animate-bounce" />
                        <div className="text-lg font-bold mb-2">Download Now</div>
                        <div className="text-sm opacity-90">Start Your Journey</div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -left-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                    <Star className="h-10 w-10 text-green-500" />
                  </div>
                  <div className="absolute bottom-8 -left-8 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                    <Heart className="h-8 w-8 text-yellow-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            .animate-float {
              animation: float 3s ease-in-out infinite;
            }
          `}</style>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Powerful Features at Your Fingertips
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to find your perfect match, all in one powerful mobile app
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* App Screens Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Experience the App
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Beautifully designed interface for the best matchmaking experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {appScreens.map((screen, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-3xl p-8 mb-4 h-96 flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <div className="text-center">
                      <PlayCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
                      <div className="text-2xl font-bold text-gray-900">{screen.title}</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{screen.title} Screen</h3>
                  <p className="text-gray-600">{screen.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Why Choose vivahavedi Mobile App?
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Experience matrimony on the go with our feature-rich mobile application
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">2M+ Users</div>
                      <div className="text-gray-600">Active members using our app</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">1M+ Chats</div>
                      <div className="text-gray-600">Messages sent every month</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                      <Heart className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">50K+ Matches</div>
                      <div className="text-gray-600">Successful marriages through app</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Users Say
              </h2>
              <p className="text-xl text-gray-600">
                Real reviews from real users
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Rahul & Priya',
                  review: 'The app is so easy to use! We found each other within a month and are now happily married.',
                  rating: 5
                },
                {
                  name: 'Amit & Sneha',
                  review: 'Great features and verified profiles. The instant chat feature helped us connect quickly.',
                  rating: 5
                },
                {
                  name: 'Karan & Anjali',
                  review: 'Best matrimony app! Smart notifications kept me updated about new matches.',
                  rating: 5
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">&quot;{testimonial.review}&quot;</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-200 to-pink-200 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">Happy Couple</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: 'Is the vivahavedi app free to download?',
                  answer: 'Yes, the vivahavedi mobile app is completely free to download from Google Play Store. Basic features are free, with premium features available through subscription plans.'
                },
                {
                  question: 'Is my data secure on the mobile app?',
                  answer: 'Absolutely! We use industry-standard encryption and security measures to protect your personal information. Your data is stored securely and never shared without your consent.'
                },
                {
                  question: 'Can I use the app offline?',
                  answer: 'You can view saved profiles and your shortlisted matches offline. However, searching for new profiles and messaging requires an internet connection.'
                },
                {
                  question: 'When will the iOS app be available?',
                  answer: 'We are currently working on the iOS version of our app. It will be available on the App Store soon. Stay tuned for updates!'
                },
                {
                  question: 'How do I verify my profile on the app?',
                  answer: 'You can verify your profile by uploading a valid government ID and a recent photo. Our team will review and verify your profile within 24-48 hours.'
                }
              ].map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-gradient-to-r from-red-600 to-pink-600 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Smartphone className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Find Your Perfect Match?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Download the vivahavedi app today and start your journey to finding true love
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href="https://play.google.com/store/apps/details?id=com.vivahavedi.vivaapp&pli=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <Download className="h-6 w-6 mr-2" />
                Download for Android
              </a>
              <a
                href="/register"
                className="inline-flex items-center bg-transparent border-2 border-white hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
              >
                Register on Website
              </a>
            </div>

            <div className="flex items-center justify-center space-x-4 text-white/90">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span>4.8 Rating • 1M+ Downloads</span>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
