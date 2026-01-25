/**
 * Success Stories API Integration
 *
 * API 49: Get Paginated Success Stories (Public API - No Auth Required)
 * Laravel Backend: http://127.0.0.1:8000
 * Controller: SuccessStoryController
 * Endpoint: GET /api/success-stories/paginated
 */

import { fetchWithRetry } from './fetchWithRetry';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Success Story interface matching Laravel API response
 */
export interface SuccessStory {
  id: number;
  name: string;
  desc: string;
  date: string;
  photo: string;
}

/**
 * Pagination interface
 */
export interface SuccessStoriesPagination {
  current_page: number;
  last_page: number;
  per_page: number | string;
  total: number;
  from: number | null;
  to: number | null;
}

/**
 * API Response interface
 */
export interface SuccessStoriesResponse {
  status: 'success' | 'failed';
  data: SuccessStory[];
  pagination: SuccessStoriesPagination;
  message?: string;
}

/**
 * Fetch paginated success stories from Laravel API
 *
 * @param page - Page number (default: 1)
 * @param perPage - Stories per page (default: 10, max: 50)
 * @returns Promise with success stories data and pagination
 */
export async function getPaginatedSuccessStories(
  page: number = 1,
  perPage: number = 10
): Promise<SuccessStoriesResponse> {
  try {
    // Validate parameters
    const validPage = Math.max(1, page);
    const validPerPage = Math.min(50, Math.max(1, perPage));

    // Build URL with query parameters
    const url = new URL(`${API_BASE_URL}/success-stories/paginated`);
    url.searchParams.append('page', validPage.toString());
    url.searchParams.append('per_page', validPerPage.toString());

    // Fetch data from Laravel API
    const response = await fetchWithRetry(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // Disable cache for fresh data
      cache: 'no-store',
      retries: 3,
      retryDelay: 1000,
    });

    // Check if response is ok
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    // Parse JSON response
    const data: SuccessStoriesResponse = await response.json();

    // Validate response structure
    if (data.status !== 'success') {
      throw new Error(data.message || 'Failed to fetch success stories');
    }

    return data;

  } catch (error) {
    console.error('Error fetching success stories:', error);

    // Return error response
    return {
      status: 'failed',
      data: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: perPage,
        total: 0,
        from: null,
        to: null,
      },
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Format date to readable format
 *
 * @param dateString - Date string from API (YYYY-MM-DD)
 * @returns Formatted date (e.g., "August 2022")
 */
export function formatStoryDate(dateString: string): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  } catch {
    return dateString;
  }
}

/**
 * Truncate long text
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length (default: 200)
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number = 200): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
