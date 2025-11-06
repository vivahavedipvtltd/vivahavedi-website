/**
 * Homepage Profiles API Integration
 *
 * API 23: Homepage Profiles (Public API - No Auth Required)
 * Laravel Backend: http://127.0.0.1:8000
 * Controller: HomepageProfilesController
 * Endpoint: GET /api/homepage-profiles
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Profile interface matching Laravel API response
 */
export interface HomepageProfile {
  id: number;
  name: string;
  age: number;
  height: string;
  marital_status: string;
  religion: string;
  caste: string;
  district: string;
  qualification: string;
  photo: string;
}

/**
 * Pagination interface
 */
export interface ProfilesPagination {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

/**
 * API Response interface
 */
export interface HomepageProfilesResponse {
  status: 'success' | 'failed';
  data: HomepageProfile[];
  pagination: ProfilesPagination;
  message?: string;
}

/**
 * Fetch homepage profiles from Laravel API
 *
 * @param page - Page number (default: 1)
 * @param perPage - Profiles per page (default: 12, max: 50)
 * @returns Promise with profiles data and pagination
 */
export async function getHomepageProfiles(
  page: number = 1,
  perPage: number = 12
): Promise<HomepageProfilesResponse> {
  try {
    // Validate parameters
    const validPage = Math.max(1, page);
    const validPerPage = Math.min(50, Math.max(1, perPage));

    // Build URL with query parameters
    const url = new URL(`${API_BASE_URL}/homepage-profiles`);
    url.searchParams.append('page', validPage.toString());
    url.searchParams.append('per_page', validPerPage.toString());

    // Fetch data from Laravel API
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // Disable cache for fresh data
      cache: 'no-store',
    });

    // Check if response is ok
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    // Parse JSON response
    const data: HomepageProfilesResponse = await response.json();

    // Validate response structure
    if (data.status !== 'success') {
      throw new Error(data.message || 'Failed to fetch homepage profiles');
    }

    return data;

  } catch (error) {
    console.error('Error fetching homepage profiles:', error);

    // Return error response
    return {
      status: 'failed',
      data: [],
      pagination: {
        current_page: 1,
        per_page: perPage,
        total: 0,
        total_pages: 0,
      },
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Convert height from cm to feet-inches format
 *
 * @param heightCm - Height in centimeters
 * @returns Height in format like "5'8\""
 */
export function formatHeight(heightCm: string): string {
  const cm = parseInt(heightCm);
  if (isNaN(cm) || cm === 0) return '';

  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);

  return `${feet}'${inches}"`;
}

/**
 * Get display name (truncated if too long)
 *
 * @param name - Full name
 * @param maxLength - Maximum length (default: 20)
 * @returns Truncated name with ellipsis if needed
 */
export function getDisplayName(name: string, maxLength: number = 20): string {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength) + '...';
}
