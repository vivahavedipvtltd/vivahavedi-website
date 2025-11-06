'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Heart, Users, Shield, Award, Target, CheckCircle } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Heart className="h-16 w-16 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About vivahavedi</h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                Connecting hearts and building families since our inception
              </p>
            </div>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Welcome to vivahavedi.com</h2>
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p className="text-lg leading-relaxed">
                Vivahavedi.com provides progressive end to end website support with cutting edge technology combined with technical skills and profound knowledge of the latest industry trends. Every aspect of our site has been constructed with matrimonial as the central focus. And navigation of the site has been made so simple, that even a first time user, will find profiles that match its interest.
              </p>
              <p className="text-lg leading-relaxed">
                Vivahavedi.com has a user friendly interface and provides easy navigation option to our users. We make matchmaking a hearty and satisfying experience by providing high quality and easy to use filtering options to find and reach that special partner.
              </p>
              <p className="text-lg leading-relaxed">
                Our management team realizes that Marriage is a life together with someone special; we have made it possible with the ease of our matrimonial site to help the users find their life partner. We help the users meet in pursuit of their life partner by allowing them to add their profiles for free, do a search for their life partner for free and allow them to contact their soul mate absolutely free!!!
              </p>
              <p className="text-lg leading-relaxed">
                We focus on providing a rich array of unique services and by delivering online superior customer support. We take advantage of the latest web technologies to bring you a fast and friendly service. Our goal is to provide an unparalleled level of services.
              </p>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Value 1 */}
              <div className="text-center">
                <div className="bg-red-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Trust & Safety</h3>
                <p className="text-gray-600">
                  We prioritize the safety and privacy of our members with verified profiles and secure data handling.
                </p>
              </div>

              {/* Value 2 */}
              <div className="text-center">
                <div className="bg-red-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Authenticity</h3>
                <p className="text-gray-600">
                  Every profile is genuine and verified to ensure authentic connections between members.
                </p>
              </div>

              {/* Value 3 */}
              <div className="text-center">
                <div className="bg-red-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
                <p className="text-gray-600">
                  We foster a respectful and supportive community where everyone feels welcome.
                </p>
              </div>

              {/* Value 4 */}
              <div className="text-center">
                <div className="bg-red-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
                <p className="text-gray-600">
                  We continuously improve our platform to provide the best matchmaking experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg shadow-lg p-8 md:p-12">
            <div className="flex items-center mb-6">
              <Target className="h-10 w-10 text-red-500 mr-4" />
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Our mission is to create meaningful connections that lead to happy, lasting marriages. We strive to:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Provide a safe and trusted platform for individuals seeking life partners</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Respect cultural values and traditions while embracing modern technology</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Offer personalized matchmaking services tailored to individual preferences</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Maintain the highest standards of privacy and data security</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Support our members throughout their journey to finding their perfect match</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose vivahavedi?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                What makes us the preferred choice for thousands of members
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Verified Profiles</h3>
                <p className="text-gray-700">
                  Every profile undergoes a verification process to ensure authenticity and build trust within our community.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced Matching</h3>
                <p className="text-gray-700">
                  Our intelligent algorithms help you find compatible matches based on your preferences and requirements.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacy First</h3>
                <p className="text-gray-700">
                  Your personal information is protected with industry-leading security measures and strict privacy policies.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Dedicated Support</h3>
                <p className="text-gray-700">
                  Our customer support team is always ready to assist you at every step of your matrimonial journey.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Success Stories</h3>
                <p className="text-gray-700">
                  Thousands of happy couples have found their life partners through our platform, and you could be next!
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Mobile Friendly</h3>
                <p className="text-gray-700">
                  Access our platform anytime, anywhere with our responsive website and mobile applications.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Perfect Match?</h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of happy members who have found their life partners with vivahavedi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="bg-white text-red-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Create Your Profile
              </a>
              <a
                href="/login"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-block"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
