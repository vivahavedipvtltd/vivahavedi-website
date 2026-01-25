/**
 * Fetch with Retry and Exponential Backoff
 *
 * Implements automatic retry logic with exponential backoff for failed requests.
 * Improves resilience on intermittent network connections.
 */

/**
 * Configuration options for fetch with retry
 */
export interface FetchWithRetryOptions extends RequestInit {
  retries?: number;           // Number of retry attempts (default: 3)
  retryDelay?: number;        // Initial retry delay in ms (default: 1000)
  retryOn?: number[];         // HTTP status codes to retry on (default: [408, 429, 500, 502, 503, 504])
  shouldRetry?: (error: Error | Response) => boolean;  // Custom retry logic
  onRetry?: (attempt: number, error: Error | null) => void;  // Callback on retry
}

/**
 * HTTP status codes that indicate a retriable error
 */
const DEFAULT_RETRY_STATUS_CODES = [
  408, // Request Timeout
  429, // Too Many Requests
  500, // Internal Server Error
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
];

/**
 * Network errors that should trigger a retry
 */
const NETWORK_ERROR_MESSAGES = [
  'Failed to fetch',
  'Network request failed',
  'NetworkError',
  'Network error',
  'fetch failed',
  'Load failed',
];

/**
 * Check if an error is a network error that should be retried
 */
function isNetworkError(error: Error): boolean {
  return NETWORK_ERROR_MESSAGES.some(msg =>
    error.message.includes(msg) || error.name.includes('NetworkError')
  );
}

/**
 * Calculate exponential backoff delay
 * Formula: baseDelay * (2 ^ attempt) + random jitter
 *
 * @param attempt - Current retry attempt (0-based)
 * @param baseDelay - Base delay in milliseconds
 * @returns Delay in milliseconds
 */
function calculateBackoffDelay(attempt: number, baseDelay: number): number {
  // Exponential backoff: 2^attempt * baseDelay
  const exponentialDelay = Math.pow(2, attempt) * baseDelay;

  // Add random jitter (0-25% of delay) to prevent thundering herd
  const jitter = Math.random() * exponentialDelay * 0.25;

  // Cap maximum delay at 30 seconds
  return Math.min(exponentialDelay + jitter, 30000);
}

/**
 * Sleep for specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch with automatic retry and exponential backoff
 *
 * @param url - URL to fetch
 * @param options - Fetch options with retry configuration
 * @returns Promise resolving to Response
 *
 * @example
 * const response = await fetchWithRetry('/api/data', {
 *   method: 'GET',
 *   retries: 3,
 *   retryDelay: 1000,
 * });
 */
export async function fetchWithRetry(
  url: string,
  options: FetchWithRetryOptions = {}
): Promise<Response> {
  const {
    retries = 3,
    retryDelay = 1000,
    retryOn = DEFAULT_RETRY_STATUS_CODES,
    shouldRetry,
    onRetry,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;
  let lastResponse: Response | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions);

      // Check if response status should trigger a retry
      if (!response.ok && retryOn.includes(response.status)) {
        lastResponse = response;

        // Check custom retry logic if provided
        if (shouldRetry && !shouldRetry(response)) {
          return response; // Don't retry if custom logic says no
        }

        // Not the last attempt, retry
        if (attempt < retries) {
          const delay = calculateBackoffDelay(attempt, retryDelay);

          if (onRetry) {
            onRetry(attempt + 1, null);
          }

          await sleep(delay);
          continue;
        }
      }

      // Success or non-retriable error
      return response;

    } catch (error) {
      lastError = error as Error;

      // Check if it's a network error
      if (!isNetworkError(lastError)) {
        throw lastError; // Don't retry non-network errors
      }

      // Check custom retry logic if provided
      if (shouldRetry && !shouldRetry(lastError)) {
        throw lastError;
      }

      // Not the last attempt, retry
      if (attempt < retries) {
        const delay = calculateBackoffDelay(attempt, retryDelay);

        if (onRetry) {
          onRetry(attempt + 1, lastError);
        }

        await sleep(delay);
        continue;
      }

      // Last attempt failed, throw error
      throw lastError;
    }
  }

  // Should never reach here, but TypeScript needs it
  if (lastError) {
    throw lastError;
  }
  if (lastResponse) {
    return lastResponse;
  }
  throw new Error('Unexpected error in fetchWithRetry');
}

/**
 * Fetch JSON with retry logic
 * Convenience wrapper that automatically parses JSON response
 *
 * @param url - URL to fetch
 * @param options - Fetch options with retry configuration
 * @returns Promise resolving to parsed JSON data
 *
 * @example
 * const data = await fetchJSONWithRetry('/api/users', {
 *   method: 'GET',
 *   retries: 3,
 * });
 */
export async function fetchJSONWithRetry<T = unknown>(
  url: string,
  options: FetchWithRetryOptions = {}
): Promise<T> {
  const response = await fetchWithRetry(url, options);

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
}

/**
 * Create a fetcher function for SWR with retry logic
 *
 * @param options - Default retry options
 * @returns Fetcher function for SWR
 *
 * @example
 * const fetcher = createRetryFetcher({ retries: 3 });
 * useSWR('/api/data', fetcher);
 */
export function createRetryFetcher(options: FetchWithRetryOptions = {}) {
  return async (url: string) => {
    const response = await fetchWithRetry(url, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  };
}
