'use client';

// Modern smooth scrolling implementation inspired by leading matrimonial sites
export interface ScrollOptions {
  duration?: number;
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  offset?: number;
  callback?: () => void;
}

class ModernScrollManager {
  private isScrolling = false;
  private scrollAnimations = new Set<number>();

  constructor() {
    this.initializeScrolling();
  }

  private initializeScrolling() {
    if (typeof window === 'undefined') return;

    // Wait for client-side hydration to complete
    setTimeout(() => {
      // Handle smooth anchor link scrolling
      this.initAnchorLinks();

      // Handle scroll reveal animations
      this.initScrollReveal();

      // Handle header scroll effects
      this.initHeaderEffects();
    }, 100);
  }

  private initAnchorLinks() {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement;

      if (link && link.getAttribute('href') !== '#') {
        e.preventDefault();
        const targetId = link.getAttribute('href')?.substring(1);
        if (targetId) {
          this.scrollToElement(targetId);
        }
      }
    });
  }

  private initScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      {
        rootMargin: '-10% 0px',
        threshold: 0.1
      }
    );

    // Observe all scroll reveal elements
    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale')
      .forEach((el) => observer.observe(el));
  }

  private initHeaderEffects() {
    let ticking = false;

    const updateHeader = () => {
      const header = document.querySelector('header');
      if (header) {
        const scrollY = window.pageYOffset;

        if (scrollY > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }

        // Add scroll direction classes (disabled for better UX)
        // if (scrollY > lastScrollY && scrollY > 200) {
        //   header.classList.add('scroll-down');
        //   header.classList.remove('scroll-up');
        // } else {
        //   header.classList.add('scroll-up');
        //   header.classList.remove('scroll-down');
        // }

        // lastScrollY = scrollY;
      }
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  public scrollToElement(elementId: string, options: ScrollOptions = {}) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const { offset = 80, duration = 800, callback } = options;

    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;

    // Use native smooth scrolling for better performance
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // Call callback after estimated scroll duration
    if (callback) {
      setTimeout(callback, duration);
    }
  }

  public scrollToTop(options: ScrollOptions = {}) {
    const { duration = 600, callback } = options;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    if (callback) {
      setTimeout(callback, duration);
    }
  }

  public scrollBy(amount: number, options: ScrollOptions = {}) {
    const currentY = window.pageYOffset;
    this.scrollToPosition(currentY + amount, options);
  }

  public scrollToPosition(position: number, options: ScrollOptions = {}) {
    const { duration = 800, callback } = options;

    window.scrollTo({
      top: position,
      behavior: 'smooth'
    });

    if (callback) {
      setTimeout(callback, duration);
    }
  }

  // Get current scroll position
  public getCurrentScroll(): number {
    return window.pageYOffset;
  }

  // Check if scrolling is in progress
  public get isActive(): boolean {
    return this.isScrolling;
  }
}

// Export singleton instance
export const modernScrollManager = new ModernScrollManager();

// Convenience functions
export const scrollToElement = (elementId: string, options?: ScrollOptions) => {
  modernScrollManager.scrollToElement(elementId, options);
};

export const scrollToTop = (options?: ScrollOptions) => {
  modernScrollManager.scrollToTop(options);
};

export const scrollBy = (amount: number, options?: ScrollOptions) => {
  modernScrollManager.scrollBy(amount, options);
};