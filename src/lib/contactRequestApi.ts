/**
 * Contact Request API
 *
 * API endpoints for managing contact request functionality (locked contact view system)
 * Base URL: http://127.0.0.1:8000/api
 */

import { fetchWithRetry } from './fetchWithRetry';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ContactRequestResponse {
  status: 'success' | 'failed' | 'error';
  message?: string;
  mesage?: string; // Note: API has typo "mesage" instead of "message"
  error_code?: string;
  time?: string; // For time_limit error message
  data?: {
    request_id?: number;
    status?: string;
    mobile?: string;
    phone?: string;
    address?: string;
    remaining_contact?: number;
    time?: string; // For time_limit error message
  };
  errors?: {
    [key: string]: string[];
  };
}

/**
 * Lock or unlock contact view
 *
 * @param token - Authentication token
 * @param lock - true to lock contact view, false to unlock
 * @returns Promise with API response
 */
export async function lockUnlockContactView(
  token: string,
  lock: boolean
): Promise<ContactRequestResponse> {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/profile-settings/lock-contact`, {
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
    console.error('Lock/Unlock contact view error:', error);
    return {
      status: 'error',
      message: 'Failed to update contact lock status. Please try again.',
    };
  }
}

/**
 * Send contact request to a user with locked contact view
 *
 * @param token - Authentication token
 * @param matchId - ID of the user to request contact from
 * @returns Promise with API response
 */
export async function sendContactRequest(
  token: string,
  matchId: number
): Promise<ContactRequestResponse> {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/contact-request/send`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        match_id: matchId,
      }),
      retries: 2,
      retryDelay: 1000,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Send contact request error:', error);
    return {
      status: 'error',
      message: 'Failed to send contact request. Please try again.',
    };
  }
}

/**
 * Cancel a pending contact request
 *
 * @param token - Authentication token
 * @param requestId - ID of the contact request to cancel
 * @returns Promise with API response
 */
export async function cancelContactRequest(
  token: string,
  requestId: number
): Promise<ContactRequestResponse> {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/contact-request/cancel`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        request_id: requestId,
      }),
      retries: 2,
      retryDelay: 1000,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Cancel contact request error:', error);
    return {
      status: 'error',
      message: 'Failed to cancel contact request. Please try again.',
    };
  }
}

/**
 * Respond to a contact request (accept or reject)
 *
 * @param token - Authentication token
 * @param requestId - ID of the contact request to respond to
 * @param action - 'accept' or 'reject'
 * @returns Promise with API response
 */
export async function respondToContactRequest(
  token: string,
  requestId: number,
  action: 'accept' | 'reject'
): Promise<ContactRequestResponse> {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/contact-request/respond`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        request_id: requestId,
        action: action,
      }),
      retries: 2,
      retryDelay: 1000,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Respond to contact request error:', error);
    return {
      status: 'error',
      message: 'Failed to respond to contact request. Please try again.',
    };
  }
}

/**
 * View contact details (handles both locked and unlocked contacts)
 *
 * @param token - Authentication token
 * @param matchId - ID of the user whose contact to view
 * @returns Promise with API response
 */
export async function viewContactDetails(
  token: string,
  matchId: number
): Promise<ContactRequestResponse> {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/contact-details`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        match_id: matchId,
      }),
      retries: 2,
      retryDelay: 1000,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('View contact details error:', error);
    return {
      status: 'error',
      message: 'Failed to view contact details. Please try again.',
    };
  }
}
