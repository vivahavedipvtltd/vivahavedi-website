'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { getHomeContactDetails, formatPhoneNumber, type ContactDetails } from '@/lib/contactUsApi';

interface Religion {
  id: number;
  name: string;
}

const Footer = () => {
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null);
  const [religions, setReligions] = useState<Religion[]>([]);
  const [loading, setLoading] = useState(true);
  const [religionsLoading, setReligionsLoading] = useState(true);

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const details = await getHomeContactDetails();
        setContactDetails(details);
      } catch (error) {
        console.error('Error fetching contact details for footer:', error);
        // Fallback to default values if API fails
        setContactDetails({
          name: 'vivahavedi',
          mobile: 'XXXXXXXXXX',
          email: 'info@vivahavedimatrimony.com'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContactDetails();
  }, []);

  useEffect(() => {
    const fetchReligions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/masters`);
        const data = await response.json();

        if (data.status === 'success' && data.data.religion) {
          setReligions(data.data.religion.slice(0, 6)); // Limit to 6 religions
        }
      } catch (error) {
        console.error('Error fetching religions for footer:', error);
      } finally {
        setReligionsLoading(false);
      }
    };

    fetchReligions();
  }, []);

  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-red-500" />
              <span className="text-xl font-bold">{contactDetails?.name || 'vivahavedi Pvt Ltd'}</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              India&apos;s most trusted matrimonial site. Find your perfect life partner from millions of verified profiles.
            </p>
            {loading ? (
              <div className="flex items-center space-x-2 text-sm">
                <div className="animate-pulse h-4 bg-gray-700 rounded w-40"></div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-red-500" />
                  <a
                    href={`tel:+91${contactDetails?.mobile}`}
                    className="hover:text-red-400 transition-colors"
                  >
                    {contactDetails?.mobile ? formatPhoneNumber(contactDetails.mobile) : '+91-XXXXXXXXXX'}
                  </a>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-red-500" />
                  <a
                    href={`mailto:${contactDetails?.email}`}
                    className="hover:text-red-400 transition-colors"
                  >
                    {contactDetails?.email || 'info@vivahavedimatrimony.com'}
                  </a>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span>Kochi, Kerala, India</span>
                </div>
              </div>
            )}
          </div>

          {/* Browse Profiles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Browse Profiles</h3>
            {religionsLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-pulse h-4 bg-gray-700 rounded w-32"></div>
              </div>
            ) : (
              <ul className="space-y-2">
                {religions.map((religion) => (
                  <li key={religion.id}>
                    <Link
                      href={`/matrimony/${createSlug(religion.name)}`}
                      className="text-gray-300 hover:text-red-400 transition-colors duration-200 text-sm"
                    >
                      {religion.name} Matrimony
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/packages" className="text-gray-300 hover:text-red-400 transition-colors duration-200 text-sm">
                  Membership Plans
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-gray-300 hover:text-red-400 transition-colors duration-200 text-sm">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/wedding-services" className="text-gray-300 hover:text-red-400 transition-colors duration-200 text-sm">
                  Wedding Services
                </Link>
              </li>
              <li>
                <Link href="/astrology" className="text-gray-300 hover:text-red-400 transition-colors duration-200 text-sm">
                  Astrology
                </Link>
              </li>
              <li>
                <Link href="/mobile-app" className="text-gray-300 hover:text-red-400 transition-colors duration-200 text-sm">
                  Mobile App
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-300 hover:text-red-400 transition-colors duration-200 text-sm">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about-us" className="text-gray-300 hover:text-red-400 transition-colors duration-200 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-gray-300 hover:text-red-400 transition-colors duration-200 text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-red-400 transition-colors duration-200 text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/media" className="text-gray-300 hover:text-red-400 transition-colors duration-200 text-sm">
                  Media
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-gray-300 hover:text-red-400 transition-colors duration-200 text-sm">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/awards" className="text-gray-300 hover:text-red-400 transition-colors duration-200 text-sm">
                  Awards
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & App Downloads */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Media Links */}
            <div className="flex items-center space-x-4">
              <span className="text-white font-medium">Follow Us:</span>
              <Link href="https://www.facebook.com/vivahavedi/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-red-400 transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-red-400 transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-red-400 transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-red-400 transition-colors duration-200">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>

            {/* App Download Links */}
            <div className="flex items-center space-x-4">
              <span className="text-white font-medium">Download App:</span>
              <a
                href="https://play.google.com/store/apps/details?id=com.vivahavedi.vivaapp&pli=1"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black hover:bg-gray-800 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  width={135}
                  height={40}
                  className="h-10 w-auto"
                />
              </a>
              <button className="bg-black hover:bg-gray-800 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 opacity-75 cursor-not-allowed">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download on the App Store"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start space-x-4 text-sm text-gray-300">
              <Link href="/privacy-policy" className="hover:text-red-400 transition-colors duration-200">
                Privacy Policy
              </Link>
              <span className="text-gray-500">|</span>
              <Link href="/policies/terms-conditions" className="hover:text-red-400 transition-colors duration-200">
                Terms & Conditions
              </Link>
              <span className="text-gray-500">|</span>
              <Link href="/policies/cancellation-refund" className="hover:text-red-400 transition-colors duration-200">
                Cancellation & Refund
              </Link>
              <span className="text-gray-500">|</span>
              <Link href="/policies/shipping-policy" className="hover:text-red-400 transition-colors duration-200">
                Shipping Policy
              </Link>
              <span className="text-gray-500">|</span>
              <Link href="/sitemap" className="hover:text-red-400 transition-colors duration-200">
                Sitemap
              </Link>
            </div>
            <div className="text-sm text-gray-300">
              © 2025 vivahavedi. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;