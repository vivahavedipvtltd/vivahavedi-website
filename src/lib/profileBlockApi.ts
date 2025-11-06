/**
 * Profile Block API
 *
 * API endpoints for blocking/unblocking user profiles
 * Base URL: http://127.0.0.1:8000/api/profile-block
 */

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/profile-block`;

export interface BlockProfileResponse {
  status: 'success' | 'failed' | 'error';
  message: string;
  errors?: {
    [key: string]: string[];
  };
}

export interface BlockedProfile {
  block_id: number;
  id: number;
  name: string;
  photo: string;
}

export interface BlockedProfilesResponse {
  status: 'success' | 'error';
  data?: BlockedProfile[];
  message?: string;
}

/**
 * Block a user profile
 *
 * @param token - Authentication token
 * @param matchId - ID of the profile to block
 * @returns Promise with block response
 */
export async function blockProfile(
  token: string,
  matchId: number
): Promise<BlockProfileResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/block`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        match_id: matchId,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Block profile error:', error);
    return {
      status: 'error',
      message: 'Failed to block profile. Please try again.',
    };
  }
}

/**
 * Unblock a user profile
 *
 * @param token - Authentication token
 * @param matchId - ID of the profile to unblock
 * @returns Promise with unblock response
 */
export async function unblockProfile(
  token: string,
  matchId: number
): Promise<BlockProfileResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/unblock`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        match_id: matchId,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Unblock profile error:', error);
    return {
      status: 'error',
      message: 'Failed to unblock profile. Please try again.',
    };
  }
}

/**
 * Get list of blocked profiles
 *
 * @param token - Authentication token
 * @returns Promise with list of blocked profiles
 */
export async function getBlockedProfiles(
  token: string
): Promise<BlockedProfilesResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/list`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get blocked profiles error:', error);
    return {
      status: 'error',
      message: 'Failed to fetch blocked profiles. Please try again.',
    };
  }
}
