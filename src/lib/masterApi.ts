// Master Data API Functions
import { fetchWithRetry } from './fetchWithRetry';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface MasterDataResponse {
  status: 'success' | 'failed';
  data: {
    religion: Array<{ id: number; name: string }>;
    caste: Array<{ id: number; name: string; masterId: number }>;
    nakshathra: Array<{ id: number; name: string }>;
    country: Array<{ id: number; name: string }>;
    state: Array<{ id: number; name: string; masterId: number }>;
    district: Array<{ id: number; name: string; masterId: number }>;
    qualification_level: Array<{ id: number; name: string }>;
    qualification: Array<{ id: number; name: string; masterId: number }>;
    specialization: Array<{ id: number; name: string }>;
    profession: Array<{ id: number; name: string }>;
    job_status: Array<{ id: number; name: string }>;
    manglik: Array<{ id: number; name: string }>;
    marital_status: Array<{ id: number; name: string }>;
    physical_status: Array<{ id: number; name: string }>;
    body_type: Array<{ id: number; name: string }>;
    complexion: Array<{ id: number; name: string }>;
    created: Array<{ id: number; name: string }>;
    mother_tongue: Array<{ id: number; name: string }>;
    personal_values: Array<{ id: number; name: string }>;
    hobbies: Array<{ id: number; name: string }>;
    favourite_cuisine: Array<{ id: number; name: string }>;
    favourite_music: Array<{ id: number; name: string }>;
    favourite_reads: Array<{ id: number; name: string }>;
    profile_report_reasons: Array<{ id: number; name: string }>;
  };
  message?: string;
}

export interface LocationsResponse {
  status: 'success' | 'failed';
  data: Array<{ id: number; name: string; masterId: number }>;
  message?: string;
}

/**
 * Fetch all master data for dropdowns with automatic retry
 */
export async function getMasterData(): Promise<MasterDataResponse> {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/masters`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      retries: 3,
      retryDelay: 1000,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch master data:', error);
    throw error;
  }
}

/**
 * Fetch locations by district ID with automatic retry
 */
export async function getLocationsByDistrict(
  districtId: number
): Promise<LocationsResponse> {
  try {
    const response = await fetchWithRetry(
      `${API_BASE_URL}/masters/locations?district_id=${districtId}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        retries: 3,
        retryDelay: 1000,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    throw error;
  }
}

/**
 * Get filtered data based on master ID (e.g., get castes for a religion)
 */
export function getFilteredData<T extends { masterId?: number }>(
  data: T[],
  masterId: number
): T[] {
  return data.filter((item) => item.masterId === masterId);
}
