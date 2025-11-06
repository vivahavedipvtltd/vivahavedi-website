export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public startMeasure(name: string): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${name}-start`);
    }
  }

  public endMeasure(name: string): number | null {
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);

        const measure = performance.getEntriesByName(name, 'measure')[0];
        const duration = measure?.duration || 0;

        this.metrics.set(name, duration);
        return duration;
      } catch (error) {
        console.warn('Performance measurement failed:', error);
        return null;
      }
    }
    return null;
  }

  public measureComponent(name: string, fn: () => void): void {
    this.startMeasure(name);
    fn();
    this.endMeasure(name);
  }

  public logMetrics(): void {
    if (process.env.NODE_ENV === 'development') {
      console.group('Performance Metrics');
      this.metrics.forEach((duration, name) => {
        console.log(`${name}: ${duration.toFixed(2)}ms`);
      });
      console.groupEnd();
    }
  }

  public getCoreWebVitals(): void {
    if (typeof window !== 'undefined' && 'web-vitals' in window) {
      // Core Web Vitals monitoring would go here
      // This is a placeholder for actual web-vitals implementation
    }
  }

  public measureImageLoad(src: string): void {
    if (typeof window !== 'undefined') {
      const img = new Image();
      const startTime = performance.now();

      img.onload = () => {
        const loadTime = performance.now() - startTime;
        this.metrics.set(`image-load-${src}`, loadTime);
      };

      img.src = src;
    }
  }

  public clearMetrics(): void {
    this.metrics.clear();
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// Hook for React components
export const usePerformanceMonitor = () => {
  const monitor = PerformanceMonitor.getInstance();

  const measureRender = (componentName: string) => {
    monitor.startMeasure(`${componentName}-render`);

    return () => {
      monitor.endMeasure(`${componentName}-render`);
    };
  };

  return { measureRender, monitor };
};