# Styling Guide

This document outlines the styling standards, design system, and best practices for the VivaMatrimony website.

## Design System Overview

### Brand Identity
- **Theme**: Matrimonial/Wedding
- **Primary Color**: Red (love, passion, marriage)
- **Design Philosophy**: Clean, trustworthy, accessible, mobile-first
- **Target Audience**: Indian families and individuals looking for marriage partners

## Color Palette

### Primary Colors
```css
/* Red - Primary brand color */
--red-50: #fef2f2;
--red-100: #fee2e2;
--red-200: #fecaca;
--red-300: #fca5a5;
--red-400: #f87171;
--red-500: #ef4444;  /* Primary */
--red-600: #dc2626;  /* Primary hover */
--red-700: #b91c1c;
--red-800: #991b1b;
--red-900: #7f1d1d;
```

### Neutral Colors
```css
/* Gray - Text and backgrounds */
--gray-50: #f9fafb;   /* Light backgrounds */
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;  /* Borders */
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;  /* Body text */
--gray-800: #1f2937;  /* Headings */
--gray-900: #111827;  /* Dark text */
```

### Usage Guidelines
```tsx
// Primary actions and branding
'bg-red-500 hover:bg-red-600'
'text-red-500 hover:text-red-600'
'border-red-500'

// Text hierarchy
'text-gray-900'  // Headings and important text
'text-gray-700'  // Body text
'text-gray-500'  // Secondary text
'text-gray-400'  // Placeholder text

// Backgrounds
'bg-white'       // Main content areas
'bg-gray-50'     // Page backgrounds
'bg-gray-100'    // Subtle backgrounds
```

## Typography

### Font Stack
```css
/* Primary font - Geist Sans */
font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui;

/* Monospace font - Geist Mono */
font-family: var(--font-geist-mono), 'SF Mono', Monaco, 'Cascadia Code', monospace;
```

### Font Scale
```tsx
// Headings
'text-4xl font-bold'    // H1 - Main page titles (36px)
'text-3xl font-bold'    // H2 - Section titles (30px)
'text-2xl font-semibold' // H3 - Subsections (24px)
'text-xl font-semibold'  // H4 - Card titles (20px)
'text-lg font-medium'    // H5 - Small headings (18px)

// Body text
'text-base'             // Regular body text (16px)
'text-sm'               // Small text (14px)
'text-xs'               // Caption text (12px)

// Special cases
'text-lg'               // Larger body text for important content
'text-sm text-gray-500' // Muted text for secondary information
```

### Font Weight Usage
```tsx
'font-normal'     // Regular text (400)
'font-medium'     // Navigation, buttons (500)
'font-semibold'   // Subheadings, emphasis (600)
'font-bold'       // Main headings (700)
```

## Spacing System

### Padding and Margin Scale
```tsx
// Container spacing
'px-4 sm:px-6 lg:px-8'    // Horizontal container padding
'py-8 sm:py-12 lg:py-16'  // Vertical section padding

// Component spacing
'p-4'      // 16px - Small components
'p-6'      // 24px - Medium components
'p-8'      // 32px - Large components

// Element spacing
'mb-2'     // 8px - Small margins
'mb-4'     // 16px - Medium margins
'mb-6'     // 24px - Large margins
'mb-8'     // 32px - Section margins

// Gap spacing
'gap-2'    // 8px - Small gaps
'gap-4'    // 16px - Medium gaps
'gap-6'    // 24px - Large gaps
```

### Layout Patterns
```tsx
// Container pattern
'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'

// Card pattern
'bg-white rounded-lg shadow-sm border border-gray-200 p-6'

// Flex layouts
'flex items-center justify-between'
'flex flex-col sm:flex-row gap-4'
```

## Component Styling Standards

### Buttons

#### Primary Button
```tsx
className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200"
```

#### Secondary Button
```tsx
className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-2 rounded-full font-medium transition-colors duration-200"
```

#### Button Sizes
```tsx
// Small button
'px-4 py-1.5 text-sm'

// Medium button (default)
'px-6 py-2 text-base'

// Large button
'px-8 py-3 text-lg'
```

### Form Elements

#### Input Fields
```tsx
className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
```

#### Labels
```tsx
className="block text-sm font-medium text-gray-700 mb-2"
```

#### Error States
```tsx
className="border-red-300 focus:ring-red-500 focus:border-red-500"
// Error message
className="text-red-600 text-sm mt-1"
```

### Cards

#### Basic Card
```tsx
className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
```

#### Hover Card
```tsx
className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
```

#### Profile Card (Example)
```tsx
className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
```

## Responsive Design

### Breakpoint Strategy
```tsx
// Mobile first approach
'text-sm md:text-base lg:text-lg'

// Progressive enhancement
'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

// Hide/show elements
'hidden md:block'    // Desktop only
'md:hidden'          // Mobile only
'lg:flex'            // Large screens and up
```

### Common Responsive Patterns
```tsx
// Navigation
'flex flex-col md:flex-row'
'space-y-4 md:space-y-0 md:space-x-6'

// Grid layouts
'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'

// Spacing adjustments
'px-4 md:px-6 lg:px-8'
'py-8 md:py-12 lg:py-16'

// Text sizing
'text-2xl md:text-3xl lg:text-4xl'
```

## Animation and Transitions

### Standard Transitions
```tsx
// Color transitions
'transition-colors duration-200'

// All properties
'transition-all duration-200'

// Shadow transitions
'transition-shadow duration-200'

// Transform transitions
'transition-transform duration-200 hover:scale-105'
```

### Hover Effects
```tsx
// Subtle hover for cards
'hover:shadow-md transition-shadow duration-200'

// Color changes
'hover:bg-red-600 transition-colors duration-200'

// Text color changes
'hover:text-red-500 transition-colors duration-200'
```

### Loading States
```tsx
// Skeleton loading
'animate-pulse bg-gray-200 rounded'

// Spinner
'animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full'
```

## Accessibility Guidelines

### Focus States
```tsx
// Standard focus ring
'focus:ring-2 focus:ring-red-500 focus:ring-offset-2'

// Button focus
'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'

// Input focus
'focus:ring-red-500 focus:border-red-500'
```

### Color Contrast
- **Text on White**: Ensure minimum 4.5:1 contrast ratio
- **White Text on Red**: Test with contrast checker
- **Gray Text**: Use gray-700 or darker for body text

### Touch Targets
```tsx
// Minimum 44px touch targets for mobile
'min-h-[44px] px-4'

// Button touch targets
'py-2 px-6'  // Adequate for desktop
'py-3 px-6'  // Better for mobile
```

## Dark Mode Preparation

### Color Variables (Future)
```tsx
// Prepare for dark mode with semantic colors
'bg-background text-foreground'
'border-border'
'text-muted-foreground'

// Define in CSS custom properties
:root {
  --background: 255 255 255;
  --foreground: 31 41 55;
  --border: 229 231 235;
}

[data-theme="dark"] {
  --background: 17 24 39;
  --foreground: 243 244 246;
  --border: 55 65 81;
}
```

## Custom Utility Classes

### Project-Specific Utilities
```css
/* globals.css */
@layer utilities {
  .container-padding {
    @apply px-4 sm:px-6 lg:px-8;
  }

  .section-spacing {
    @apply py-12 sm:py-16 lg:py-20;
  }

  .card-hover {
    @apply hover:shadow-md transition-shadow duration-200;
  }

  .btn-primary {
    @apply bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200;
  }
}
```

## Code Organization

### Class Name Ordering
```tsx
// 1. Layout (flex, grid, position)
// 2. Box model (width, height, padding, margin)
// 3. Typography (font, text)
// 4. Visual (background, border, shadow)
// 5. Interactivity (cursor, transition)
// 6. State variants (hover, focus)

className="flex items-center w-full px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer transition-colors duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-red-500"
```

### Component Styling Pattern
```tsx
import { cn } from '@/lib/utils'; // className utility

interface ComponentProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Component = ({ variant = 'primary', size = 'md', className, ...props }) => {
  return (
    <div
      className={cn(
        // Base styles
        'inline-flex items-center justify-center font-medium rounded-full transition-colors duration-200',
        // Variant styles
        {
          'bg-red-500 hover:bg-red-600 text-white': variant === 'primary',
          'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300': variant === 'secondary',
        },
        // Size styles
        {
          'px-4 py-1.5 text-sm': size === 'sm',
          'px-6 py-2 text-base': size === 'md',
          'px-8 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
};
```

## Performance Considerations

### CSS Optimization
- Use Tailwind's purge functionality to remove unused CSS
- Prefer utility classes over custom CSS
- Use CSS variables for theme colors
- Minimize custom @apply usage

### Bundle Size
- Import only needed Tailwind components
- Use dynamic imports for large component libraries
- Optimize images and icons

---

**Last Updated**: September 26, 2025
**Styling Guide Version**: 1.0.0
**Tailwind CSS Version**: 3.x