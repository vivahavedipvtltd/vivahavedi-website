// Search API Functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface SearchFilters {
  age_from?: number;
  age_to?: number;
  height_from?: string;
  height_to?: string;
  religion?: number;
  country?: number;
  state?: number;
  marital_status?: string[];
  caste?: number[];
  nakshatra?: number[];
  district?: number[];
  qualification?: number[];
  q_level?: number[];
  specialization?: number[];
  profession?: number[];
  workedin?: string[];
  manglik?: string[];
  physicalstatus?: string[];
  user_id?: string;
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

export interface SearchResponse {
  status: 'success' | 'failed';
  data: ProfileResult[];
  message?: string;
}

export interface SearchCountResponse {
  status: 'success' | 'failed';
  data: number;
  message?: string;
}

/**
 * Search profiles with filters
 */
export async function searchProfiles(
  token: string,
  filters: SearchFilters,
  sortBy: 'featured' | 'new' | 'photo' = 'featured',
  page: number = 1,
  type: 'advance_search' | 'id_search' = 'advance_search'
): Promise<SearchResponse> {
  try {
    const requestBody: any = {
      type,
      page,
    };

    if (type === 'advance_search') {
      requestBody.filters = filters;
      requestBody.sort = {
        sort_by: sortBy,
      };
    } else if (type === 'id_search') {
      requestBody.filters = {
        user_id: filters.user_id,
      };
    }

    const response = await fetch(`${API_BASE_URL}/search-profiles`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Search profiles failed:', error);
    throw error;
  }
}

/**
 * Get count of matching profiles
 */
export async function getSearchCount(
  token: string,
  filters: SearchFilters
): Promise<SearchCountResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/search-profiles`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: 'advance_search_count',
        ...filters,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get search count failed:', error);
    throw error;
  }
}

/**
 * Save search with name and filters
 */
export async function saveSearch(
  token: string,
  searchName: string,
  filters: SearchFilters,
  sortBy: 'featured' | 'new' | 'photo' = 'featured'
): Promise<{ status: 'success' | 'failed'; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/saved-searches`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: 'save_search',
        search_name: searchName,
        filters,
        sort: {
          sort_by: sortBy,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('Save search error:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Save search failed:', error);
    throw error;
  }
}

/**
 * Get saved searches list
 */
export async function getSavedSearches(
  token: string
): Promise<{ status: 'success' | 'failed'; data: Array<{ id: number; name: string }> }> {
  try {
    const response = await fetch(`${API_BASE_URL}/saved-searches`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: 'saved_search_list',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('Get saved searches error:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get saved searches failed:', error);
    throw error;
  }
}

/**
 * Execute saved search
 */
export async function executeSavedSearch(
  token: string,
  searchId: number,
  page: number = 1
): Promise<SearchResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/saved-searches`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: 'saved_search_result',
        search_id: searchId,
        page,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Execute saved search failed:', error);
    throw error;
  }
}

/**
 * Get count of results for a saved search
 */
export async function getSavedSearchCount(
  token: string,
  searchId: number
): Promise<SearchCountResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/saved-searches`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: 'saved_search_result_count',
        search_id: searchId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get saved search count failed:', error);
    throw error;
  }
}

/**
 * Delete saved search
 */
export async function deleteSavedSearch(
  token: string,
  searchId: number
): Promise<{ status: 'success' | 'failed'; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/saved-searches`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: 'delete_search',
        search_id: searchId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Delete saved search failed:', error);
    throw error;
  }
}
