/**
 * API Error Interceptor
 * Wraps fetch calls with consistent error handling
 */

import { errorHandler, ApiError } from './errorHandler';

export interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
}

/**
 * Enhanced fetch with error handling, retries, and timeout
 */
export async function fetchWithErrorHandling(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const {
    retries = 0,
    timeout = 30000,
    ...fetchOptions
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Don't retry on successful response or client errors (4xx)
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }

      // Server error (5xx) - might retry
      if (response.status >= 500 && attempt < retries) {
        lastError = await response.json().catch(() => ({
          status: 'failed',
          message: `Server error: ${response.status}`,
          code: 'SERVER_ERROR',
        }));

        // Wait before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, errorHandler.getRetryDelay(attempt))
        );
        continue;
      }

      return response;
    } catch (error) {
      lastError = error;

      // Don't retry on abort (timeout) or network errors unless specified
      if (error instanceof Error && error.name === 'AbortError') {
        throw {
          status: 'failed',
          message: 'Request timeout. Please try again.',
          code: 'TIMEOUT_ERROR',
        };
      }

      // Retry on network errors
      if (attempt < retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, errorHandler.getRetryDelay(attempt))
        );
        continue;
      }

      // Final attempt failed
      throw error;
    }
  }

  // All retries failed
  throw lastError;
}

/**
 * Parse API response and handle errors
 */
export async function parseApiResponse<T = unknown>(
  response: Response,
  requestInfo?: { url: string; method: string }
): Promise<T> {
  try {
    const data = await response.json();

    // Handle API error response
    if (data.status === 'failed') {
      const apiError = data as ApiError;

      // Log the error
      if (requestInfo) {
        errorHandler.logApiError(apiError, requestInfo);
      }

      // Track error for analytics
      if (apiError.code) {
        errorHandler.trackError(apiError.code, apiError.message);
      }

      throw apiError;
    }

    // Handle HTTP error status
    if (!response.ok) {
      const error: ApiError = {
        status: 'failed',
        message: data.message || `HTTP Error: ${response.status}`,
        code: `HTTP_${response.status}`,
      };

      if (requestInfo) {
        errorHandler.logApiError(error, requestInfo);
      }

      throw error;
    }

    return data as T;
  } catch (error) {
    // If error is already an ApiError, rethrow it
    if (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      (error as ApiError).status === 'failed'
    ) {
      throw error;
    }

    // Parse error
    const parsedError = errorHandler.handleApiError(error);

    if (requestInfo) {
      errorHandler.logApiError(parsedError, requestInfo);
    }

    throw parsedError;
  }
}

/**
 * Wrapper for fetch with full error handling
 */
export async function apiFetch<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  try {
    const response = await fetchWithErrorHandling(url, options);

    return await parseApiResponse<T>(response, {
      url,
      method: options.method || 'GET',
    });
  } catch (error) {
    // Ensure error is in ApiError format
    const apiError = errorHandler.handleApiError(error);
    throw apiError;
  }
}

/**
 * GET request with error handling
 */
export async function apiGet<T = unknown>(
  url: string,
  options?: FetchOptions
): Promise<T> {
  return apiFetch<T>(url, { ...options, method: 'GET' });
}

/**
 * POST request with error handling
 */
export async function apiPost<T = unknown>(
  url: string,
  data?: unknown,
  options?: FetchOptions
): Promise<T> {
  return apiFetch<T>(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request with error handling
 */
export async function apiPut<T = unknown>(
  url: string,
  data?: unknown,
  options?: FetchOptions
): Promise<T> {
  return apiFetch<T>(url, {
    ...options,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request with error handling
 */
export async function apiDelete<T = unknown>(
  url: string,
  options?: FetchOptions
): Promise<T> {
  return apiFetch<T>(url, { ...options, method: 'DELETE' });
}
