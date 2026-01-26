import Link from 'next/link';
import Image from 'next/image';
import AuthButtons from './AuthButtons';
import MobileMenuClient from './MobileMenuClient';

export default function Header() {
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

          {/* Mobile Menu - Client Component */}
          <MobileMenuClient />
        </div>
      </div>
    </header>
  );
}
