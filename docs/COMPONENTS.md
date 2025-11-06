# Component Documentation

This document provides detailed information about the components used in the VivaMatrimony website.

## Component Architecture

### Design Principles
- **Reusability**: Components are designed to be reused across different parts of the application
- **Accessibility**: All components follow WCAG guidelines
- **Mobile-First**: Components are built with mobile responsiveness as a priority
- **TypeScript**: Fully typed props and state for better development experience

## Current Components

### Header Component

**Location**: `/src/components/Header.tsx`

#### Overview
The Header component is the main navigation component that appears at the top of every page. It provides navigation links, search functionality, and user authentication options.

#### Features
- **Responsive Design**: Adapts from desktop navigation to mobile hamburger menu
- **Sticky Navigation**: Stays fixed at the top when scrolling
- **Search Integration**: Includes search icon (ready for functionality)
- **Authentication**: Login/Signup button
- **Smooth Animations**: Hover effects and mobile menu transitions

#### Props
```typescript
// Currently no props (static component)
// Future props may include:
interface HeaderProps {
  user?: User | null;           // User authentication state
  onSearch?: (query: string) => void;  // Search handler
  className?: string;           // Additional styling
}
```

#### Usage Examples
```tsx
// Basic usage
import Header from '@/components/Header';

export default function Layout() {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
```

#### Styling
- **Colors**: Red primary (`red-500`), gray text (`gray-700`)
- **Breakpoint**: Mobile menu activates below `md` (768px)
- **Spacing**: Uses Tailwind's spacing scale
- **Typography**: Medium font weight for navigation items

#### Mobile Behavior
- Navigation items collapse into hamburger menu
- Menu slides down with border separator
- Search and auth buttons stack vertically
- Touch-friendly button sizes (44px minimum)

#### Accessibility Features
- Proper ARIA labels for mobile menu button
- Keyboard navigation support
- Focus management for mobile menu
- Semantic HTML structure

#### Future Enhancements
1. **User Authentication State**
   ```tsx
   // Show different content based on auth state
   {user ? (
     <UserMenu user={user} />
   ) : (
     <LoginButton />
   )}
   ```

2. **Search Functionality**
   ```tsx
   const [searchQuery, setSearchQuery] = useState('');

   const handleSearch = (query: string) => {
     // Implement search logic
     router.push(`/search?q=${encodeURIComponent(query)}`);
   };
   ```

3. **Active Link Highlighting**
   ```tsx
   // Highlight current page in navigation
   const pathname = usePathname();
   const isActive = (path: string) => pathname === path;
   ```

### Footer Component

**Location**: `/src/components/Footer.tsx`

#### Overview
The Footer component provides comprehensive site navigation, contact information, and additional resources. It's designed to match matrimonial site standards with organized sections and social media integration.

#### Features
- **Company Information**: Logo, contact details, and address
- **Organized Navigation**: Browse profiles, services, and company links
- **City-wise Links**: SEO-friendly city-specific matrimony pages
- **Social Media**: Facebook, Twitter, Instagram, YouTube links
- **App Downloads**: Google Play and App Store links
- **Legal Links**: Privacy policy, terms & conditions, sitemap
- **Responsive Design**: Mobile-first with grid layout

#### Props
```typescript
// Currently no props (static component)
// Future props may include:
interface FooterProps {
  className?: string;           // Additional styling
  showSocialMedia?: boolean;    // Toggle social media section
  showAppDownloads?: boolean;   // Toggle app download links
  cities?: string[];            // Dynamic city list
}
```

#### Usage Examples
```tsx
// Basic usage
import Footer from '@/components/Footer';

export default function Layout() {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

#### Structure
- **Main Content**: 4-column grid (company info, profiles, services, company)
- **City Links**: Dynamic city-wise matrimony links for SEO
- **Social & Apps**: Social media and mobile app download section
- **Bottom Bar**: Legal links and copyright information

#### Styling
- **Background**: Dark theme (`bg-gray-900`)
- **Text Colors**: White headings, gray-300 links
- **Hover Effects**: Red accent color (`hover:text-red-400`)
- **Responsive**: Grid adjusts from 1 to 4 columns
- **Spacing**: Consistent padding and margins

#### SEO Benefits
- Internal linking structure for better crawling
- City-specific pages for local SEO
- Organized content hierarchy
- Footer links boost page authority

### Homepage Components

#### HeroSection Component

**Location**: `/src/components/HeroSection.tsx`

**Features**:
- Rotating slide carousel with 4 different messages
- Gradient background with overlay
- Auto-advance every 5 seconds
- Manual navigation arrows and indicators
- Call-to-action buttons
- Responsive design

#### SearchSection Component

**Location**: `/src/components/SearchSection.tsx`

**Features**:
- Comprehensive search form with filters
- Gender selection (Bride/Groom)
- Age and height range selectors
- Religion and caste dropdowns
- Location search with map icon
- Register free call-to-action

#### FeaturedProfiles Component

**Location**: `/src/components/FeaturedProfiles.tsx`

**Features**:
- Grid of 8 sample profiles
- Profile cards with images and details
- Verified badges and heart icons
- Hover effects and transitions
- Education, profession, location display
- View profile and chat buttons

#### SuccessStories Component

**Location**: `/src/components/SuccessStories.tsx`

**Features**:
- **Animated Slider**: 6 testimonial cards with smooth sliding animation
- **Auto-advance**: Automatically slides every 4 seconds
- **Navigation**: Previous/next arrows with hover animations
- **Indicators**: Clickable dots showing current slide position
- **Responsive Layout**: 2 stories per slide on desktop, 1 on mobile
- **Hover Effects**: Scale animations on story cards and profile images
- **Star Ratings**: Animated star ratings with pulse effect
- **Success Statistics**: Gradient background with key metrics
- **Interactive Controls**: Manual navigation pauses auto-advance

**Animation Details**:
- Smooth CSS transitions with `duration-500 ease-in-out`
- Hover scale effects on cards (`hover:scale-105`)
- Arrow button scale animations (`group-hover:scale-110`)
- Slide indicators with scale and shadow effects
- Profile image zoom on hover (`hover:scale-110`)
- Animated star ratings with pulse effect

#### CircularCarousel Component

**Location**: `/src/components/CircularCarousel.tsx`

**Features**:
- **Stunning Visual Design**: Gradient background with floating decorative elements
- **Circular Navigation**: 6 feature items arranged in a circle with rotating animation
- **Premium Center Display**: Glass-morphism card with glow effects and backdrop blur
- **Auto-advance**: Automatically rotates every 3 seconds with enhanced pause/play control
- **Interactive Navigation**: Click any circular dot to jump to that feature
- **Enhanced Arrow Controls**: Glass-morphism arrows with gradient hover effects
- **Gradient Icons**: Each feature has a unique gradient color scheme with shine effects
- **Premium Transitions**: 1-second rotation animation with advanced easing
- **Animated Progress Indicators**: Enhanced dot indicators with gradient active states

**Visual Enhancements**:
- **Background**: Multi-layer gradient from red-50 to purple-50 with animated blobs
- **Floating Elements**: Heart icons and sparkles with staggered float animations
- **Glass Morphism**: Backdrop blur effects on center card and navigation elements
- **Glow Effects**: Active elements have animated glow and ring effects
- **Shine Animation**: Circular dots have moving shine effects
- **Trust Indicators**: Animated statistics with staggered entrance
- **Circular Connection Line**: Animated gradient dashed circle connecting all navigation dots

**Advanced Animation Details**:
- **Background Blobs**: 3 large animated gradient circles with pulse and blur
- **Floating Hearts**: 3 heart icons floating at different speeds and delays
- **Sparkle Effects**: 2 twinkling star elements with scale and rotation
- **Center Card**: Glass morphism with hover scale, glow border, and decorative dots
- **Circular Dots**: Enhanced scale (150%), glow animation, and floating rings positioned on 300px radius
- **Perfect Positioning**: Active dot always positioned at top of circle (12 o'clock position)
- **Clockwise Layout**: Dots arranged clockwise starting from top (-90 degrees offset)
- **Connection Circle**: 600px diameter SVG circle with animated gradient dashed stroke
- **Navigation Arrows**: Glass morphism with gradient hover and scale effects
- **Progress Dots**: Gradient active state with pulse animation
- **Title**: Animated gradient text with moving background
- **Statistics**: Fade-in-up animation with staggered delays

**Custom Animations**:
- `animate-float`: 4s floating motion for decorative elements
- `animate-twinkle`: 3s twinkling with rotation for sparkles
- `animate-bounce-subtle`: 2s subtle bounce for icons
- `animate-glow`: 2s pulsing glow effect for active elements
- `animate-shine`: 2s moving shine effect across circular dots
- `animate-gradient-x`: 3s moving gradient background for text
- `animate-dash`: 4s linear infinite dashed stroke animation for circular connection line

**Features Included**:
1. **100% Verified Profiles** (Blue gradient)
2. **2M+ Active Members** (Green gradient)
3. **Advanced AI Matching** (Red gradient)
4. **15+ Years of Trust** (Purple gradient)
5. **Secure & Private** (Orange gradient)
6. **24/7 Customer Support** (Teal gradient)

#### AboutSection Component

**Location**: `/src/components/AboutSection.tsx`

**Features**:
- Community browsing section
- **Animated "How it Works" section** with enhanced animations
- Grid layouts with hover effects
- Call-to-action buttons

**"How It Works" Animation Details**:
- **Sequential Slide-up**: Each step animates with staggered delays (0.2s, 0.4s, 0.6s)
- **Bounce-in Numbers**: Step numbers bounce in with scale animation
- **Floating Icons**: Info, search, and heart icons float around steps
- **Color-coded Indicators**: Green, yellow, pink pulsing dots for each step
- **Hover Effects**: Cards scale up (105%) with color transitions
- **Sparkle Effects**: Twinkling star on final step
- **Fade-in Headers**: Title and subtitle fade in with delays

**Animation Classes**:
- `animate-fade-in`: Smooth fade-in from bottom
- `animate-slide-up`: Sequential slide-up animation
- `animate-bounce-in`: Bouncing scale effect for numbers
- `animate-float`: Continuous floating motion for icons
- `animate-twinkle`: Star sparkle animation

#### MobileAppSection Component

**Location**: `/src/components/MobileAppSection.tsx`

**Features**:
- App download promotion
- Feature list with star icons
- Mock phone screenshots
- App store buttons (iOS/Android)
- Floating animation elements
- Final registration call-to-action

## Component Guidelines

### Creating New Components

#### File Structure
```
src/components/
├── ui/                     # Basic UI components (Button, Input, etc.)
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Modal.tsx
├── forms/                  # Form-specific components
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── ProfileForm.tsx
├── layout/                 # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
└── features/               # Feature-specific components
    ├── profiles/
    ├── messaging/
    └── payments/
```

#### Component Template
```tsx
'use client';

import { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils'; // utility for className merging

interface ComponentNameProps {
  children?: ReactNode;
  className?: string;
  // Add specific props here
}

const ComponentName: FC<ComponentNameProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'default-classes-here',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default ComponentName;
```

#### TypeScript Interfaces
```typescript
// types/components.ts
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}
```

### Styling Standards

#### CSS Classes Organization
```tsx
// Order: Layout -> Spacing -> Typography -> Colors -> States
className="flex items-center justify-between px-4 py-2 text-lg font-medium text-gray-700 bg-white hover:bg-gray-50"
```

#### Responsive Design Pattern
```tsx
// Mobile first approach
className="text-sm md:text-base lg:text-lg"
className="px-2 md:px-4 lg:px-6"
className="hidden md:flex"  // Show only on desktop
className="md:hidden"       // Show only on mobile
```

#### Color Usage
```tsx
// Primary colors (matrimonial theme)
'text-red-500'      // Primary text
'bg-red-500'        // Primary background
'border-red-500'    // Primary borders
'hover:bg-red-600'  // Hover states

// Neutral colors
'text-gray-700'     // Body text
'text-gray-900'     // Headings
'bg-gray-50'        // Light backgrounds
'border-gray-200'   // Subtle borders
```

## Future Component Plan

### Authentication Components
```tsx
// components/auth/LoginForm.tsx
interface LoginFormProps {
  onSuccess: (user: User) => void;
  onError: (error: string) => void;
}

// components/auth/RegisterForm.tsx
interface RegisterFormProps {
  onSuccess: (user: User) => void;
  initialData?: Partial<UserRegistration>;
}
```

### Profile Components
```tsx
// components/profiles/ProfileCard.tsx
interface ProfileCardProps {
  profile: Profile;
  showActions?: boolean;
  onLike?: (profileId: string) => void;
  onMessage?: (profileId: string) => void;
}

// components/profiles/ProfileFilter.tsx
interface ProfileFilterProps {
  filters: ProfileFilters;
  onFilterChange: (filters: ProfileFilters) => void;
}
```

### UI Components
```tsx
// components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  children: ReactNode;
  disabled?: boolean;
}

// components/ui/Input.tsx
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  error?: string;
  label?: string;
}

// components/ui/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}
```

## Testing Components

### Unit Testing Pattern
```tsx
// __tests__/Header.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/Header';

describe('Header Component', () => {
  it('renders navigation items', () => {
    render(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Packages')).toBeInTheDocument();
  });

  it('toggles mobile menu', () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    // Add assertions for menu visibility
  });
});
```

## Performance Considerations

### Code Splitting
```tsx
// Lazy load heavy components
import dynamic from 'next/dynamic';

const ProfileModal = dynamic(() => import('@/components/profiles/ProfileModal'), {
  loading: () => <div>Loading...</div>
});
```

### Memoization
```tsx
import { memo, useMemo } from 'react';

const ProfileCard = memo(({ profile, onLike }) => {
  const profileAge = useMemo(() => {
    return calculateAge(profile.dateOfBirth);
  }, [profile.dateOfBirth]);

  return (
    // Component JSX
  );
});
```

---

**Last Updated**: September 26, 2025
**Components Version**: 1.0.0