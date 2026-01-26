/**
 * Matching Profiles API
 *
 * API endpoints for fetching profiles that match user's partner preferences
 * Base URL: http://127.0.0.1:8000/api
 */

import { fetchWithRetry } from './fetchWithRetry';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface MatchingProfile {
  photo: string;
  id: number;
  name: string;
  age: number;
  height: string;
  marital_status: string;
  religion: string;
  caste: string;
  district: string;
  qualification: string;
}

export interface MatchingProfilesResponse {
  status: 'success' | 'failed';
  data?: MatchingProfile[];
  message?: string;
}

export interface MatchingProfilesCountResponse {
  status: 'success' | 'failed';
  data?: number;
  message?: string;
}

export type MatchType = 'latest_match' | 'perfect_match' | 'latest_match_count' | 'perfect_match_count';

/**
 * Get matching profiles based on partner preferences
 *
 * @param token - Authentication token
 * @param type - Match type (latest_match, perfect_match, etc.)
 * @param page - Page number for pagination (5 profiles per page)
 * @returns Promise with matching profiles
 */
export async function getMatchingProfiles(
  token: string,
  type: MatchType = 'latest_match',
  page: number = 1
): Promise<MatchingProfilesResponse> {
  try {
    const params = new URLSearchParams({
      type,
      page: page.toString(),
    });

    const response = await fetchWithRetry(`${API_BASE_URL}/matching-profiles?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      retries: 3,
      retryDelay: 1000,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get matching profiles error:', error);
    return {
      status: 'failed',
      message: 'Failed to fetch matching profiles. Please try again.',
    };
  }
}

/**
 * Get count of matching profiles
 *
 * @param token - Authentication token
 * @param type - Count type (latest_match_count or perfect_match_count)
 * @returns Promise with count
 */
export async function getMatchingProfilesCount(
  token: string,
  type: 'latest_match_count' | 'perfect_match_count' = 'latest_match_count'
): Promise<MatchingProfilesCountResponse> {
  try {
    const params = new URLSearchParams({ type });

    const response = await fetchWithRetry(`${API_BASE_URL}/matching-profiles?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      retries: 3,
      retryDelay: 1000,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get matching profiles count error:', error);
    return {
      status: 'failed',
      message: 'Failed to fetch matching profiles count. Please try again.',
    };
  }
}
