'use client';

// Global scroll manager for ultra-smooth scrolling experience

class SmoothScrollManager {
  private isScrolling = false;
  private currentScroll = 0;
  private targetScroll = 0;
  private scrollVelocity = 0;
  private dampening = 0.08;
  private threshold = 0.5;
  private wheelHandlers: Array<(event: WheelEvent) => void> = [];

  constructor() {
    this.currentScroll = typeof window !== 'undefined' ? window.pageYOffset : 0;
    this.targetScroll = this.currentScroll;
  }

  init() {
    if (typeof window === 'undefined') return;

    // Override default wheel behavior for smoother scrolling
    this.addWheelListener();
    this.startSmoothLoop();
  }

  private addWheelListener() {
    const wheelHandler = (event: WheelEvent) => {
      // Prevent default scrolling
      event.preventDefault();

      // Add scroll velocity based on wheel delta
      const scrollAmount = event.deltaY * 1.2;
      this.targetScroll += scrollAmount;

      // Constrain scroll boundaries
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      this.targetScroll = Math.max(0, Math.min(this.targetScroll, maxScroll));

      // Start smooth scrolling if not already running
      if (!this.isScrolling) {
        this.isScrolling = true;
        this.smoothScroll();
      }
    };

    // Add passive: false to allow preventDefault
    window.addEventListener('wheel', wheelHandler, { passive: false });
    this.wheelHandlers.push(wheelHandler);
  }

  private smoothScroll() {
    if (!this.isScrolling) return;

    const diff = this.targetScroll - this.currentScroll;

    if (Math.abs(diff) < this.threshold) {
      this.currentScroll = this.targetScroll;
      this.isScrolling = false;
      return;
    }

    this.currentScroll += diff * this.dampening;
    window.scrollTo(0, this.currentScroll);

    requestAnimationFrame(() => this.smoothScroll());
  }

  private startSmoothLoop() {
    // Initialize current scroll position
    this.currentScroll = window.pageYOffset;
    this.targetScroll = this.currentScroll;
  }

  // Method to scroll to specific position smoothly
  scrollTo(position: number, smooth = true) {
    if (smooth) {
      this.targetScroll = position;
      if (!this.isScrolling) {
        this.isScrolling = true;
        this.smoothScroll();
      }
    } else {
      this.currentScroll = position;
      this.targetScroll = position;
      window.scrollTo(0, position);
    }
  }

  // Cleanup method
  destroy() {
    this.wheelHandlers.forEach(handler => {
      window.removeEventListener('wheel', handler);
    });
    this.wheelHandlers = [];
    this.isScrolling = false;
  }

  // Enable/disable smooth scrolling
  setEnabled(enabled: boolean) {
    if (enabled) {
      this.init();
    } else {
      this.destroy();
    }
  }
}

// Export singleton instance
export const smoothScrollManager = new SmoothScrollManager();