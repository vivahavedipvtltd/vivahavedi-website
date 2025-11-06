import { API_BASE_URL } from './config';

// API Response Types
export interface ApiResponse<T = unknown> {
  status: 'success' | 'failed';
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// API Helper Functions
export const apiClient = {
  /**
   * Fetch master data for registration dropdowns
   */
  async getMasterData() {
    const response = await fetch(`${API_BASE_URL}/masters`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  },

  /**
   * Fetch locations by district ID
   */
  async getLocationsByDistrict(districtId: number) {
    const response = await fetch(`${API_BASE_URL}/masters/locations?district_id=${districtId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  },

  /**
   * Register new user
   */
  async register(data: {
    mobile: string;
    email: string;
    password: string;
    name: string;
    last_name: string;
    gender: string;
    birth_day: number;
    birth_month: number;
    birth_year: number;
    religion: number;
    caste: number;
    country: number;
    state: number;
    district: number;
    location: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response.json();
  },

  /**
   * User login
   */
  async login(login: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, password }),
    });

    return response.json();
  },

  /**
   * Get authenticated user profile
   */
  async getUserProfile(token: string) {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  },

  /**
   * Get user's complete profile details
   */
  async getMyDetails(token: string) {
    const response = await fetch(`${API_BASE_URL}/my-details`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  },

  /**
   * Validate authentication token
   */
  async validateToken(token: string) {
    const response = await fetch(`${API_BASE_URL}/validate-token`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  },

  /**
   * Logout and revoke token
   */
  async logout(token: string) {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  },
};

// Authentication Helper Functions
export const auth = {
  /**
   * Store authentication token
   */
  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },

  /**
   * Get stored authentication token
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  /**
   * Remove authentication token
   */
  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
  },

  /**
   * Store user ID
   */
  setUserId(userId: number) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userId', userId.toString());
    }
  },

  /**
   * Get stored user ID
   */
  getUserId(): number | null {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId');
      return userId ? parseInt(userId) : null;
    }
    return null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export default apiClient;
