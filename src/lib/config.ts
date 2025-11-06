/**
 * Centralized API Configuration
 * Single source of truth for all API endpoints
 */

// Base API URL - reads from environment variable with fallback
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Base URL without /api suffix (for specific endpoints that need it)
export const BASE_URL = API_BASE_URL.replace('/api', '');

/**
 * API Configuration Object
 * Use this instead of hardcoding API_BASE_URL in components
 */
export const apiConfig = {
  baseURL: API_BASE_URL,
  baseURLWithoutApi: BASE_URL,

  // Common headers
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },

  // Helper to get auth headers
  getAuthHeaders: (token: string) => ({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }),
};

export default apiConfig;
