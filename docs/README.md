# VivaMatrimony - Next.js Matrimonial Website

A modern, mobile-friendly, SEO-optimized matrimonial website built with Next.js 15, TypeScript, and Tailwind CSS.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development](#development)
- [Components](#components)
- [Styling Guidelines](#styling-guidelines)
- [SEO Configuration](#seo-configuration)
- [Performance Optimizations](#performance-optimizations)
- [Future Development](#future-development)
- [API Integration](#api-integration)
- [Deployment](#deployment)

## Overview

This project is a matrimonial website designed to help users find their perfect life partner. It features a responsive header navigation system similar to nestmatrimony.com and is built with modern web technologies for optimal performance and SEO.

## Features

### ✅ Implemented
- **Responsive Header Navigation**: Desktop and mobile-friendly header with hamburger menu
- **Complete Homepage**: Hero section, search form, featured profiles, success stories, about section
- **Site Footer**: Comprehensive footer with navigation, social media, and legal links
- **SEO Optimized**: Comprehensive meta tags, Open Graph, and Twitter cards
- **Modern UI**: Clean design with Tailwind CSS and smooth animations
- **TypeScript Support**: Full type safety throughout the application
- **Mobile-First Design**: Optimized for all device sizes
- **Performance Optimized**: Lazy loading, code splitting, and optimized animations
- **Scroll Effects**: Smooth scroll animations with throttled event handlers
- **GPU Acceleration**: Hardware-accelerated animations for better performance

### 🔄 Planned Features
- User authentication and registration
- Profile browsing and search
- Advanced filtering options
- Messaging system
- Payment integration
- Admin dashboard

## Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Laravel APIs (separate project)
- **Development**: ESLint for code quality

## Project Structure

```
matrimonial-website/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with SEO meta tags
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   └── components/
│       ├── Header.tsx          # Main navigation header
│       ├── Footer.tsx          # Site footer with links
│       ├── HeroSection.tsx     # Homepage hero carousel
│       ├── SearchSection.tsx   # Profile search form
│       ├── FeaturedProfiles.tsx # Sample profile cards
│       ├── SuccessStories.tsx  # Testimonials and stats
│       ├── CircularCarousel.tsx # Why Choose Us circular carousel
│       ├── AboutSection.tsx    # Communities and how it works
│       └── MobileAppSection.tsx # App download promotion
├── public/                     # Static assets
├── package.json               # Dependencies and scripts
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd matrimonial-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npm run type-check
```

### Development Guidelines

1. **Code Style**: Follow TypeScript and ESLint configurations
2. **Components**: Create reusable components in `/src/components`
3. **Pages**: Add new pages in `/src/app` directory
4. **Styling**: Use Tailwind CSS classes, avoid custom CSS when possible
5. **TypeScript**: Maintain strict type checking

## Components

### Header Component (`/src/components/Header.tsx`)

The main navigation component featuring:

**Props**: None (currently static)

**Features**:
- Responsive navigation menu
- Mobile hamburger menu
- Search functionality placeholder
- Login/Signup button
- Smooth hover animations

**Usage**:
```tsx
import Header from '@/components/Header';

export default function Layout() {
  return (
    <>
      <Header />
      {/* Page content */}
    </>
  );
}
```

**Customization**:
- Navigation items can be modified in the `nav` sections
- Colors can be changed by updating Tailwind classes
- Mobile breakpoint is set at `md` (768px)

## Styling Guidelines

### Color Scheme
- **Primary**: Red (`red-500`, `red-600`)
- **Text**: Gray scale (`gray-700`, `gray-800`)
- **Background**: White and light gray (`gray-50`)
- **Hover States**: Consistent red accent color

### Typography
- **Headings**: Bold weights with gray-800
- **Body**: Regular weights with gray-700
- **Font**: Geist Sans (primary), Geist Mono (code)

### Responsive Design
- **Mobile First**: Design starts from mobile (320px)
- **Breakpoints**:
  - `sm`: 640px
  - `md`: 768px (main mobile menu breakpoint)
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

### Component Patterns
- Use `flex` and `grid` for layouts
- Consistent spacing with Tailwind's spacing scale
- Hover effects with `transition-colors duration-200`
- Round corners with `rounded-md` or `rounded-full`

## SEO Configuration

### Meta Tags (configured in `/src/app/layout.tsx`)

```tsx
export const metadata: Metadata = {
  title: "VivaMatrimony - Find Your Perfect Life Partner | Indian Matrimonial Site",
  description: "Discover your ideal life partner on VivaMatrimony...",
  keywords: "matrimony, marriage, wedding, indian matrimony...",
  // ... other SEO configurations
};
```

### SEO Best Practices Implemented
- **Title Tags**: Descriptive and keyword-rich
- **Meta Descriptions**: Compelling and under 160 characters
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Twitter-specific meta tags
- **Canonical URLs**: Prevent duplicate content issues
- **Structured Data**: Ready for JSON-LD implementation

### Adding New Pages SEO
When creating new pages, add page-specific metadata:

```tsx
// app/about/page.tsx
export const metadata = {
  title: 'About Us - VivaMatrimony',
  description: 'Learn about VivaMatrimony mission...',
};
```

## Performance Optimizations

The application has been optimized for performance with the following implementations:

### Code Splitting & Lazy Loading
- **Dynamic Imports**: Heavy components are lazy-loaded using `React.lazy()`
- **Suspense Boundaries**: Each lazy component wrapped with proper loading states
- **Bundle Optimization**: Reduces initial bundle size and improves Time to Interactive (TTI)

```tsx
const SearchSection = lazy(() => import('@/components/SearchSection'));
const FeaturedProfiles = lazy(() => import('@/components/FeaturedProfiles'));
```

### Scroll Performance
- **Throttled Scroll Events**: RequestAnimationFrame-based throttling prevents excessive re-renders
- **Viewport Optimization**: Animations only trigger for visible elements
- **Efficient DOM Queries**: Cached selectors and conditional checks reduce computational overhead

```tsx
const handleScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      // Optimized scroll handling
      ticking = false;
    });
    ticking = true;
  }
};
```

### Animation Performance
- **GPU Acceleration**: Hardware-accelerated transforms using `translateZ(0)`
- **Will-Change Property**: Optimized for transform animations
- **Reduced Motion Support**: Respects user accessibility preferences

```css
.gpu-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
```

### Image Optimization
- **Responsive Images**: Optimized images with proper sizing
- **Lazy Loading**: Background images load conditionally
- **WebP Format**: Modern image formats for better compression

### Memory Management
- **useCallback**: Memoized event handlers prevent unnecessary re-renders
- **useMemo**: Cached expensive computations and object references
- **Proper Cleanup**: Event listeners properly removed on unmount

### Performance Monitoring
To monitor performance, use Chrome DevTools:
1. Open DevTools → Performance tab
2. Record page load and interactions
3. Check for layout thrashing and paint issues
4. Monitor Core Web Vitals (LCP, FID, CLS)

### Performance Checklist
- [ ] Images optimized and properly sized
- [ ] Components lazy-loaded where appropriate
- [ ] Scroll events throttled
- [ ] Animations use GPU acceleration
- [ ] Bundle size monitored and optimized
- [ ] Core Web Vitals meeting benchmarks

## Future Development

### Immediate Next Steps
1. **Authentication System**
   - Login/Register pages
   - User session management
   - Protected routes

2. **Profile System**
   - User profile creation
   - Profile browsing
   - Advanced search filters

3. **API Integration**
   - Connect to Laravel backend
   - User management endpoints
   - Profile data management

### Recommended File Structure for Expansion

```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── profiles/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   └── dashboard/
│       └── page.tsx
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── forms/                 # Form components
│   ├── profiles/             # Profile-related components
│   └── auth/                 # Authentication components
├── lib/
│   ├── api.ts                # API utilities
│   ├── auth.ts               # Authentication utilities
│   └── utils.ts              # General utilities
└── types/
    ├── user.ts               # User type definitions
    └── profile.ts            # Profile type definitions
```

## API Integration

### Backend Connection
The project is designed to work with Laravel APIs. API calls should be made to your Laravel backend.

### Recommended API Structure
```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = {
  auth: {
    login: (credentials) => fetch(`${API_BASE_URL}/login`, { /* config */ }),
    register: (userData) => fetch(`${API_BASE_URL}/register`, { /* config */ }),
  },
  profiles: {
    getAll: () => fetch(`${API_BASE_URL}/profiles`),
    getById: (id) => fetch(`${API_BASE_URL}/profiles/${id}`),
  },
};
```

### Environment Variables
Create `.env.local` for environment-specific configurations:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Deployment

### Build Process
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

### Deployment Platforms
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Traditional hosting with Node.js**

### Pre-deployment Checklist
- [ ] Update `NEXT_PUBLIC_API_URL` for production
- [ ] Update canonical URLs in metadata
- [ ] Test mobile responsiveness
- [ ] Verify SEO meta tags
- [ ] Run `npm run build` successfully
- [ ] Test production build locally

## Contributing

### Code Quality
1. Run ESLint before committing: `npm run lint`
2. Ensure TypeScript compilation: `npm run build`
3. Follow the established component patterns
4. Add proper TypeScript types for new features

### Git Workflow
1. Create feature branches from `main`
2. Make descriptive commit messages
3. Test thoroughly before merging
4. Update documentation for new features

## Support

For questions about this project structure or implementation details, refer to:
- Next.js Documentation: https://nextjs.org/docs
- Tailwind CSS Documentation: https://tailwindcss.com/docs
- TypeScript Documentation: https://www.typescriptlang.org/docs

## License

[Add your license information here]

---

**Last Updated**: September 26, 2025
**Project Version**: 1.0.0
**Next.js Version**: 15.x
**Node.js Version**: 18.x or higher recommended
