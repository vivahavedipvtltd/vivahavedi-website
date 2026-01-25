import { SWRConfiguration } from 'swr';
import { fetchWithRetry, createRetryFetcher } from './fetchWithRetry';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Default fetcher for SWR with retry logic
 * Handles GET requests with automatic retry and exponential backoff
 */
export const fetcher = createRetryFetcher({
  retries: 3,
  retryDelay: 1000,
  retryOn: [408, 429, 500, 502, 503, 504],
});

/**
 * Authenticated fetcher for SWR with retry logic
 * Handles GET requests with authentication token
 */
export const authenticatedFetcher = async (url: string, token: string) => {
  const response = await fetchWithRetry(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    retries: 3,
    retryDelay: 1000,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * SWR configuration for static/master data
 * Data that rarely changes (religions, castes, countries, etc.)
 */
export const staticDataConfig: SWRConfiguration = {
  revalidateOnFocus: false,        // Don't refetch when window regains focus
  revalidateOnReconnect: false,    // Don't refetch when reconnecting
  revalidateIfStale: false,        // Don't refetch if data is stale
  dedupingInterval: 3600000,       // Dedupe requests within 1 hour (3600000ms)
  errorRetryCount: 3,              // Retry failed requests 3 times
  errorRetryInterval: 5000,        // Wait 5 seconds between retries
  shouldRetryOnError: true,        // Retry on error
  onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
    // Don't retry on 404
    if (error.status === 404) return;

    // Don't retry after max retries
    if (retryCount >= 3) return;

    // Retry after 5 seconds
    setTimeout(() => revalidate({ retryCount }), 5000);
  },
};

/**
 * SWR configuration for semi-static data
 * Data that changes occasionally (user plans, communication stats)
 */
export const semiStaticDataConfig: SWRConfiguration = {
  revalidateOnFocus: false,        // Don't refetch when window regains focus
  revalidateOnReconnect: true,     // Refetch when reconnecting
  revalidateIfStale: true,         // Refetch if data is stale
  dedupingInterval: 60000,         // Dedupe requests within 1 minute
  refreshInterval: 300000,         // Auto-refresh every 5 minutes
  errorRetryCount: 3,
  errorRetryInterval: 3000,
};

/**
 * SWR configuration for dynamic data
 * Data that changes frequently (notifications, messages, profile views)
 */
export const dynamicDataConfig: SWRConfiguration = {
  revalidateOnFocus: true,         // Refetch when window regains focus
  revalidateOnReconnect: true,     // Refetch when reconnecting
  revalidateIfStale: true,         // Refetch if data is stale
  dedupingInterval: 10000,         // Dedupe requests within 10 seconds
  refreshInterval: 60000,          // Auto-refresh every 1 minute
  errorRetryCount: 2,
  errorRetryInterval: 2000,
};

/**
 * Helper to build full API URLs
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

/**
 * Global SWR configuration provider values
 */
export const globalSWRConfig: SWRConfiguration = {
  fetcher,
  errorRetryCount: 3,
  errorRetryInterval: 3000,
  dedupingInterval: 10000,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
};
