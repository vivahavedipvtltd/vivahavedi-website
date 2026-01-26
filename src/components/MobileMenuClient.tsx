'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import AuthButtons from './AuthButtons';

export default function MobileMenuClient() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
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
    </>
  );
}
