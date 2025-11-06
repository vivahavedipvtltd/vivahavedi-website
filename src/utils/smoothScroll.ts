// Ultra-smooth scroll utility with advanced interpolation
import { smoothScrollPhysics } from '@/utils/smoothScrollPhysics';

export interface SmoothScrollOptions {
  duration?: number;
  easing?: 'easeInOut' | 'easeOut' | 'easeIn' | 'linear' | 'easeInOutCubic' | 'easeInOutQuart';
  offset?: number;
  callback?: () => void;
  smooth?: boolean; // Enable ultra-smooth interpolation
}

// Advanced easing functions for ultra-smooth transitions
// const easingFunctions = {
//   linear: (t: number): number => t,
//   easeIn: (t: number): number => t * t,
//   easeOut: (t: number): number => t * (2 - t),
//   easeInOut: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
//   easeInOutCubic: (t: number): number => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
//   easeInOutQuart: (t: number): number => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
// };

// Smooth interpolation for ultra-smooth scrolling
// let currentScroll = 0;
// const targetScroll = 0;
// let isScrolling = false;

// const smoothInterpolation = () => {
//   if (!isScrolling) return;
//
//   const diff = targetScroll - currentScroll;
//   const dampening = 0.08; // Lower value = smoother but slower
//
//   if (Math.abs(diff) < 0.5) {
//     currentScroll = targetScroll;
//     isScrolling = false;
//     return;
//   }
//
//   currentScroll += diff * dampening;
//   window.scrollTo(0, currentScroll);
//   requestAnimationFrame(smoothInterpolation);
// };

/**
 * Smooth scroll to a specific element or position
 * @param target - Element, element ID, or Y position
 * @param options - Scroll options
 */
export const smoothScrollTo = (
  target: Element | string | number,
  options: SmoothScrollOptions = {}
): Promise<void> => {
  const {
    // duration = 800,
    // easing = 'easeInOutCubic',
    offset = 80,
    callback,
    // smooth = false // Disable problematic smooth interpolation by default
  } = options;

  return new Promise((resolve) => {
    let targetY: number;

    // Determine target position
    if (typeof target === 'number') {
      targetY = target;
    } else if (typeof target === 'string') {
      const element = document.getElementById(target);
      if (!element) {
        console.warn(`Element with ID "${target}" not found`);
        resolve();
        return;
      }
      targetY = element.getBoundingClientRect().top + window.pageYOffset - offset;
    } else {
      targetY = target.getBoundingClientRect().top + window.pageYOffset - offset;
    }

    // Don't animate if already at target
    if (Math.abs(targetY - window.pageYOffset) < 10) {
      callback?.();
      resolve();
      return;
    }

    // Use our physics engine for smooth scrolling
    try {
      // Scroll using physics engine
      smoothScrollPhysics.scrollTo(targetY, true);

      // Wait for scroll to complete
      const checkScrollComplete = () => {
        const currentScroll = smoothScrollPhysics.currentScroll;
        if (Math.abs(currentScroll - targetY) < 2 && !smoothScrollPhysics.isActive) {
          callback?.();
          resolve();
        } else {
          requestAnimationFrame(checkScrollComplete);
        }
      };

      // Give a small delay for the scroll to start
      setTimeout(checkScrollComplete, 50);
    } catch {
      // Fallback to native scrolling if physics engine fails
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });

      setTimeout(() => {
        callback?.();
        resolve();
      }, 800);
    }
  });
};

/**
 * Smooth scroll to top of page
 */
export const scrollToTop = (options: Omit<SmoothScrollOptions, 'offset'> = {}): Promise<void> => {
  return smoothScrollTo(0, { ...options, offset: 0 });
};

/**
 * Smooth scroll by a specific amount
 */
export const scrollBy = (amount: number, options: SmoothScrollOptions = {}): Promise<void> => {
  const currentY = window.pageYOffset;
  return smoothScrollTo(currentY + amount, options);
};

/**
 * Auto-initialize smooth scrolling for anchor links
 */
export const initSmoothScrolling = (options: SmoothScrollOptions = {}): (() => void) => {
  const handleAnchorClick = (e: Event) => {
    const target = e.target as HTMLAnchorElement;

    if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
      e.preventDefault();
      const targetId = target.getAttribute('href')?.substring(1);

      if (targetId) {
        smoothScrollTo(targetId, options);
      }
    }
  };

  document.addEventListener('click', handleAnchorClick);

  // Return cleanup function
  return () => {
    document.removeEventListener('click', handleAnchorClick);
  };
};