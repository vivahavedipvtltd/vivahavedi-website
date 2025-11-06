// Public Search API Functions (API 24 - No Authentication Required)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface PublicSearchParams {
  page?: number;
  per_page?: number;
  gender?: 'male' | 'female';
  age_from?: number;
  age_to?: number;
  height_from?: number;
  height_to?: number;
  religion?: number;
  caste?: number | number[];
}

export interface ProfileResult {
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

export interface PublicSearchResponse {
  status: 'success' | 'failed';
  data: ProfileResult[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  message?: string;
}

/**
 * Public Search API (API 24)
 * No authentication required
 * Search profiles with filters for Age, Height, Gender, Religion, and Caste
 */
export async function publicSearch(
  params: PublicSearchParams
): Promise<PublicSearchResponse> {
  try {
    // Build query string
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.gender) queryParams.append('gender', params.gender);
    if (params.age_from) queryParams.append('age_from', params.age_from.toString());
    if (params.age_to) queryParams.append('age_to', params.age_to.toString());
    if (params.height_from) queryParams.append('height_from', params.height_from.toString());
    if (params.height_to) queryParams.append('height_to', params.height_to.toString());
    if (params.religion) queryParams.append('religion', params.religion.toString());

    // Handle caste as array
    if (params.caste) {
      if (Array.isArray(params.caste)) {
        params.caste.forEach((c) => queryParams.append('caste[]', c.toString()));
      } else {
        queryParams.append('caste', params.caste.toString());
      }
    }

    const url = `${API_BASE_URL}/public-search?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Public search failed:', error);
    throw error;
  }
}
