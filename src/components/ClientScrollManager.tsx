'use client';

import { useEffect } from 'react';

const ClientScrollManager = () => {
  useEffect(() => {
    // Only run on client side after hydration
    const initializeScrolling = () => {
      // Handle smooth anchor link scrolling
      const handleAnchorClick = (e: Event) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a[href^="#"]') as HTMLAnchorElement;

        if (link && link.getAttribute('href') !== '#') {
          e.preventDefault();
          const targetId = link.getAttribute('href')?.substring(1);

          if (targetId) {
            const element = document.getElementById(targetId);
            if (element) {
              const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;

              window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
              });
            }
          }
        }
      };

      document.addEventListener('click', handleAnchorClick);

      // Add scroll-reveal classes to sections after hydration
      const sections = [
        { id: 'search', className: 'scroll-reveal' },
        { id: 'profiles', className: 'scroll-reveal-left' },
        { id: 'find-special-someone', className: 'scroll-reveal' },
        { id: 'why-choose-us', className: 'scroll-reveal-scale' },
        { id: 'success-stories', className: 'scroll-reveal-right' },
        { id: 'mobile-app', className: 'scroll-reveal' },
        { id: 'faq', className: 'scroll-reveal-scale' },
      ];

      sections.forEach(({ id, className }) => {
        const element = document.getElementById(id);
        if (element) {
          element.classList.add(className);
        }
      });

      // Handle scroll reveal animations with Intersection Observer
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
            } else {
              entry.target.classList.remove('revealed');
            }
          });
        },
        {
          rootMargin: '-10% 0px',
          threshold: 0.1
        }
      );

      // Observe all scroll reveal elements
      const scrollRevealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');

      // Let IntersectionObserver handle visibility after hydration
      scrollRevealElements.forEach((el) => {
        observer.observe(el);
      });

      // Handle header scroll effects
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

          // lastScrollY = scrollY;
        }
        ticking = false;
      };

      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(updateHeader);
          ticking = true;
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      // Cleanup function
      return () => {
        document.removeEventListener('click', handleAnchorClick);
        window.removeEventListener('scroll', handleScroll);
        observer.disconnect();
      };
    };

    // Initialize after a short delay to ensure DOM is ready
    const timer = setTimeout(initializeScrolling, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default ClientScrollManager;