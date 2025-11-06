'use client';

// Ultra-smooth scrolling with physics-based approach similar to Lenis/Locomotive

class SmoothScrollPhysics {
  private isScrolling = false;
  private scrollY = 0;
  private targetY = 0;
  private velocity = 0;
  private rafId: number | null = null;

  // Physics parameters for ultra-smooth feel
  private lerp = 0.08; // Linear interpolation factor (lower = smoother)
  private friction = 0.8; // Velocity friction
  private threshold = 0.1; // Stop threshold

  constructor() {
    if (typeof window !== 'undefined') {
      this.scrollY = window.pageYOffset;
      this.targetY = this.scrollY;
    }
  }

  init() {
    if (typeof window === 'undefined') return;

    // Override default scroll behavior
    this.addEventListeners();
    this.startRenderLoop();
  }

  private addEventListeners() {
    // Intercept wheel events
    window.addEventListener('wheel', this.handleWheel, { passive: false });

    // Handle touch events for mobile
    window.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    window.addEventListener('touchend', this.handleTouchEnd, { passive: true });

    // Handle keyboard navigation
    window.addEventListener('keydown', this.handleKeyDown);

    // Handle resize
    window.addEventListener('resize', this.handleResize);
  }

  private handleWheel = (e: WheelEvent) => {
    e.preventDefault();

    const delta = e.deltaY;
    this.targetY += delta * 1.5; // Multiply for more responsive feel
    this.constrainTarget();

    if (!this.isScrolling) {
      this.isScrolling = true;
    }
  };

  private touchStartY = 0;
  private lastTouchY = 0;

  private handleTouchStart = (e: TouchEvent) => {
    this.touchStartY = e.touches[0].clientY;
    this.lastTouchY = this.touchStartY;
  };

  private handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();

    const currentY = e.touches[0].clientY;
    const deltaY = this.lastTouchY - currentY;

    this.targetY += deltaY * 2; // Touch sensitivity
    this.constrainTarget();
    this.lastTouchY = currentY;

    if (!this.isScrolling) {
      this.isScrolling = true;
    }
  };

  private handleTouchEnd = () => {
    // Add momentum based on velocity
    const momentum = this.velocity * 10;
    this.targetY += momentum;
    this.constrainTarget();
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    let delta = 0;

    switch (e.key) {
      case 'ArrowDown':
      case 'PageDown':
        delta = 300;
        break;
      case 'ArrowUp':
      case 'PageUp':
        delta = -300;
        break;
      case 'Home':
        this.targetY = 0;
        break;
      case 'End':
        this.targetY = this.getMaxScroll();
        break;
      case ' ':
        delta = e.shiftKey ? -300 : 300;
        break;
      default:
        return;
    }

    e.preventDefault();
    this.targetY += delta;
    this.constrainTarget();

    if (!this.isScrolling) {
      this.isScrolling = true;
    }
  };

  private handleResize = () => {
    this.constrainTarget();
  };

  private constrainTarget() {
    const maxScroll = this.getMaxScroll();
    this.targetY = Math.max(0, Math.min(this.targetY, maxScroll));
  }

  private getMaxScroll(): number {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  private startRenderLoop() {
    const render = () => {
      if (this.isScrolling) {
        // Calculate velocity for momentum
        const previousY = this.scrollY;

        // Lerp towards target with easing
        this.scrollY += (this.targetY - this.scrollY) * this.lerp;

        // Calculate and apply friction to velocity
        this.velocity = (this.scrollY - previousY) * this.friction;

        // Apply the scroll
        window.scrollTo(0, this.scrollY);

        // Check if we should stop
        const diff = Math.abs(this.targetY - this.scrollY);
        if (diff < this.threshold && Math.abs(this.velocity) < 0.1) {
          this.scrollY = this.targetY;
          this.velocity = 0;
          this.isScrolling = false;
          window.scrollTo(0, this.scrollY);
        }
      }

      this.rafId = requestAnimationFrame(render);
    };

    render();
  }

  // Public methods
  scrollTo(target: number, smooth = true) {
    if (smooth) {
      this.targetY = Math.max(0, Math.min(target, this.getMaxScroll()));
      if (!this.isScrolling) {
        this.isScrolling = true;
      }
    } else {
      this.scrollY = target;
      this.targetY = target;
      window.scrollTo(0, target);
    }
  }

  scrollBy(delta: number) {
    this.targetY += delta;
    this.constrainTarget();
    if (!this.isScrolling) {
      this.isScrolling = true;
    }
  }

  stop() {
    this.targetY = this.scrollY;
    this.velocity = 0;
    this.isScrolling = false;
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    window.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('resize', this.handleResize);
  }

  // Getters
  get currentScroll() {
    return this.scrollY;
  }

  get isActive() {
    return this.isScrolling;
  }
}

// Export singleton instance
export const smoothScrollPhysics = new SmoothScrollPhysics();