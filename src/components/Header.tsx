'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import AuthButtons from './AuthButtons';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="https://www.vivahavedimatrimony.com/asset/images/matrimony/1568038436_logo.png"
                alt="Vivahavedi Matrimony"
                width={180}
                height={60}
                className="h-14 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation & Auth Buttons - Aligned Right */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-red-500 transition-colors duration-200 font-medium"
              >
                Home
              </Link>
              <Link
                href="/about-us"
                className="text-gray-700 hover:text-red-500 transition-colors duration-200 font-medium"
              >
                About Us
              </Link>
              <Link
                href="/contact-us"
                className="text-gray-700 hover:text-red-500 transition-colors duration-200 font-medium"
              >
                Contact Us
              </Link>
            </nav>

            <AuthButtons />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm animate-slide-down">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-50 rounded-md font-medium transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about-us"
                className="block px-3 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-50 rounded-md font-medium transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/contact-us"
                className="block px-3 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-50 rounded-md font-medium transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
              <div className="border-t border-gray-200 pt-2">
                <AuthButtons isMobile onLogout={() => setIsMobileMenuOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;