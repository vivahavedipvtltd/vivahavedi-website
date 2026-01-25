/**
 * Centralized Error Handling Service
 * Provides consistent error handling across the application
 */

export interface ApiError {
  status: 'failed';
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
  debug?: {
    exception: string;
    message: string;
    file: string;
    line: number;
  };
}

export interface ErrorLogContext {
  url?: string;
  method?: string;
  userId?: number | string;
  timestamp: string;
  userAgent: string;
  [key: string]: unknown;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errorMonitoringEnabled: boolean = false;

  private constructor() {
    this.errorMonitoringEnabled = process.env.NODE_ENV === 'production';
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle API errors and return user-friendly messages
   */
  public handleApiError(error: unknown): ApiError {
    // Default error structure
    const defaultError: ApiError = {
      status: 'failed',
      message: 'An unexpected error occurred. Please try again.',
      code: 'UNKNOWN_ERROR',
    };

    // Network error (no response)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return {
        status: 'failed',
        message: 'Unable to connect to the server. Please check your internet connection.',
        code: 'NETWORK_ERROR',
      };
    }

    // Error is already in our API format
    if (this.isApiError(error)) {
      return error;
    }

    // Error has a response property (from fetch)
    if (error && typeof error === 'object' && 'message' in error) {
      const err = error as { message: string };
      return {
        status: 'failed',
        message: err.message || defaultError.message,
        code: 'CLIENT_ERROR',
      };
    }

    return defaultError;
  }

  /**
   * Get user-friendly error message based on error code
   */
  public getUserMessage(error: ApiError): string {
    const errorMessages: Record<string, string> = {
      NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
      UNAUTHENTICATED: 'Please log in to continue.',
      UNAUTHORIZED: 'You don\'t have permission to perform this action.',
      FORBIDDEN: 'Access denied.',
      NOT_FOUND: 'The requested resource was not found.',
      RESOURCE_NOT_FOUND: 'The requested item could not be found.',
      VALIDATION_ERROR: 'Please check the form and correct any errors.',
      DATABASE_ERROR: 'A database error occurred. Please try again later.',
      SERVER_ERROR: 'A server error occurred. Please try again later.',
      TIMEOUT_ERROR: 'The request took too long. Please try again.',
    };

    return errorMessages[error.code || ''] || error.message;
  }

  /**
   * Log error to monitoring service (Sentry, LogRocket, etc.)
   */
  public logError(error: unknown, context?: Partial<ErrorLogContext>): void {
    const errorContext: ErrorLogContext = {
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      ...context,
    };

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🔴 Error Logged');
      console.error('Error:', error);
      console.table(errorContext);
      console.groupEnd();
    }

    // Send to monitoring service in production
    if (this.errorMonitoringEnabled && typeof window !== 'undefined') {
      this.sendToMonitoringService(error, errorContext);
    }
  }

  /**
   * Log error with additional context
   */
  public logApiError(error: ApiError, request: {
    url: string;
    method: string;
  }): void {
    this.logError(error, {
      url: request.url,
      method: request.method,
      errorCode: error.code,
      errorMessage: error.message,
    });
  }

  /**
   * Handle validation errors
   */
  public getValidationErrors(error: ApiError): Record<string, string> {
    if (!error.errors) {
      return {};
    }

    const validationErrors: Record<string, string> = {};

    // Convert array of errors to single string per field
    Object.keys(error.errors).forEach((field) => {
      const fieldErrors = error.errors![field];
      validationErrors[field] = Array.isArray(fieldErrors)
        ? fieldErrors[0]
        : fieldErrors;
    });

    return validationErrors;
  }

  /**
   * Check if error is an API error
   */
  private isApiError(error: unknown): error is ApiError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      'message' in error &&
      (error as ApiError).status === 'failed'
    );
  }

  /**
   * Send error to monitoring service
   * Placeholder for integration with Sentry, LogRocket, etc.
   */
  private sendToMonitoringService(error: unknown, context: ErrorLogContext): void {
    // Example Sentry integration:
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, { extra: context });
    // }

    // Example LogRocket integration:
    // if (window.LogRocket) {
    //   window.LogRocket.captureException(error, { extra: context });
    // }

    // For now, just log to console in production for debugging
    if (process.env.NODE_ENV === 'production') {
      console.error('Production Error:', {
        error,
        context,
      });
    }
  }

  /**
   * Track error for analytics
   */
  public trackError(errorCode: string, errorMessage: string): void {
    // Example Google Analytics integration:
    // if (window.gtag) {
    //   window.gtag('event', 'exception', {
    //     description: `${errorCode}: ${errorMessage}`,
    //     fatal: false,
    //   });
    // }

    // Example custom analytics:
    // this.sendToAnalytics('error', {
    //   code: errorCode,
    //   message: errorMessage,
    // });

    // Development logging
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Error Tracked:', errorCode, errorMessage);
    }
  }

  /**
   * Determine if error should be retried
   */
  public shouldRetry(error: ApiError): boolean {
    const retryableErrors = [
      'NETWORK_ERROR',
      'TIMEOUT_ERROR',
      'SERVER_ERROR',
      'DATABASE_ERROR',
    ];

    return retryableErrors.includes(error.code || '');
  }

  /**
   * Get retry delay based on attempt number (exponential backoff)
   */
  public getRetryDelay(attemptNumber: number): number {
    return Math.min(1000 * Math.pow(2, attemptNumber), 10000);
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Export convenience functions
export const handleApiError = (error: unknown) => errorHandler.handleApiError(error);
export const logError = (error: unknown, context?: Partial<ErrorLogContext>) =>
  errorHandler.logError(error, context);
export const getUserMessage = (error: ApiError) => errorHandler.getUserMessage(error);
export const getValidationErrors = (error: ApiError) => errorHandler.getValidationErrors(error);
export const trackError = (errorCode: string, errorMessage: string) =>
  errorHandler.trackError(errorCode, errorMessage);
