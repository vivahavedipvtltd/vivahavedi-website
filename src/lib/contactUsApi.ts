/**
 * Contact Us API Service
 *
 * This file contains API service functions for the Contact Us functionality.
 * It integrates with the Laravel backend APIs for fetching contact details and branches.
 *
 * API Base URL: http://127.0.0.1:8000
 *
 * Available Endpoints:
 * 1. GET /api/contact-us/home - Get main website contact details
 * 2. GET /api/contact-us/branches - Get all active company branches
 */

import { fetchWithRetry } from './fetchWithRetry';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Contact Details Interface
 * Represents the main website contact information
 */
export interface ContactDetails {
  name: string;
  mobile: string;
  email: string;
}

/**
 * Branch Interface
 * Represents a company branch with all its details
 */
export interface Branch {
  id: number;
  name: string;
  phone: string;
  service: string;
  email: string;
  address: string;
  map: string;
  image: string;
}

/**
 * API Response Interface
 * Generic response structure for all API calls
 */
interface ApiResponse<T> {
  status: 'success' | 'error' | 'failed';
  data?: T;
  message?: string;
}

/**
 * Get Home Contact Details
 *
 * Fetches the main contact details for the website home page.
 * This includes the website name, mobile number, and email address.
 *
 * @returns Promise<ContactDetails> - The contact details object
 * @throws Error if the API call fails or returns an error
 *
 * @example
 * ```typescript
 * const contactDetails = await getHomeContactDetails();
 * console.log(contactDetails.email); // "info@vivahavedi.com"
 * ```
 */
export async function getHomeContactDetails(): Promise<ContactDetails> {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/contact-us/home`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store', // Disable caching to get fresh data
      retries: 3,
      retryDelay: 1000,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<ContactDetails> = await response.json();

    if (result.status === 'success' && result.data) {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch contact details');
    }
  } catch (error) {
    console.error('Error fetching home contact details:', error);
    throw error;
  }
}

/**
 * Get Branches
 *
 * Fetches all active company branches with their contact details and locations.
 * Returns an array of branch objects containing phone, email, address, map link, and image.
 *
 * @returns Promise<Branch[]> - Array of branch objects
 * @throws Error if the API call fails or returns an error
 *
 * @example
 * ```typescript
 * const branches = await getBranches();
 * branches.forEach(branch => {
 *   console.log(`${branch.name}: ${branch.phone}`);
 * });
 * ```
 */
export async function getBranches(): Promise<Branch[]> {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/contact-us/branches`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store', // Disable caching to get fresh data
      retries: 3,
      retryDelay: 1000,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Branch[]> = await response.json();

    if (result.status === 'success' && result.data) {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch branches');
    }
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
}

/**
 * Format Phone Number
 *
 * Helper function to format phone numbers for display
 *
 * @param phone - The phone number string
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // If it starts with 91 (India country code), format accordingly
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }

  // Otherwise, return as is
  return phone;
}

/**
 * Get Map Embed URL
 *
 * Converts a Google Maps URL to an embed URL for iframe
 *
 * @param mapUrl - The Google Maps URL
 * @returns Embed URL for iframe or null if invalid
 */
export function getMapEmbedUrl(mapUrl: string): string | null {
  if (!mapUrl || mapUrl === '#' || mapUrl === 'null') {
    return null;
  }

  // If it's already an embed URL, return it
  if (mapUrl.includes('/embed')) {
    return mapUrl;
  }

  // Extract place ID or coordinates from various Google Maps URL formats
  try {
    const url = new URL(mapUrl);

    // Check if it's a place URL
    if (url.pathname.includes('/place/')) {
      const placeName = url.pathname.split('/place/')[1].split('/')[0];
      return `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(placeName)}`;
    }

    // For now, return the original URL (can be enhanced with actual API key)
    return mapUrl;
  } catch (error) {
    console.error('Error parsing map URL:', error);
    return null;
  }
}
