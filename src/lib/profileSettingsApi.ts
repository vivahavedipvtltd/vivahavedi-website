/**
 * Profile Settings API
 *
 * API endpoints for managing profile privacy settings (photo lock and profile visibility)
 * Base URL: http://127.0.0.1:8000/api
 */

import { fetchWithRetry } from './fetchWithRetry';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ProfileSettingsResponse {
  status: 'success' | 'failed' | 'error';
  mesage?: string; // Note: API has typo "mesage" instead of "message"
  message?: string;
  errors?: {
    [key: string]: string[];
  };
}

/**
 * Lock or unlock profile photos
 *
 * @param token - Authentication token
 * @param lock - true to lock photos, false to unlock
 * @returns Promise with API response
 */
export async function lockUnlockPhoto(
  token: string,
  lock: boolean
): Promise<ProfileSettingsResponse> {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/profile-settings/lock-photo`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: lock ? 'true' : 'false',
      }),
      retries: 2,
      retryDelay: 1000,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lock/Unlock photo error:', error);
    return {
      status: 'error',
      message: 'Failed to update photo lock status. Please try again.',
    };
  }
}

/**
 * Hide or show profile from search results
 *
 * @param token - Authentication token
 * @param hide - true to hide profile, false to show
 * @returns Promise with API response
 */
export async function hideShowProfile(
  token: string,
  hide: boolean
): Promise<ProfileSettingsResponse> {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/profile-settings/hide-profile`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: hide ? 'true' : 'false',
      }),
      retries: 2,
      retryDelay: 1000,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hide/Show profile error:', error);
    return {
      status: 'error',
      message: 'Failed to update profile visibility. Please try again.',
    };
  }
}
