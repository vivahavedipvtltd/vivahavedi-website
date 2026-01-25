import { API_BASE_URL } from './config';
import { fetchWithRetry } from './fetchWithRetry';

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
    const response = await fetchWithRetry(`${API_BASE_URL}/masters`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      retries: 3,
      retryDelay: 1000,
    });

    return response.json();
  },

  /**
   * Fetch locations by district ID
   */
  async getLocationsByDistrict(districtId: number) {
    const response = await fetchWithRetry(`${API_BASE_URL}/masters/locations?district_id=${districtId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      retries: 3,
      retryDelay: 1000,
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
    const response = await fetchWithRetry(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      retries: 2,
      retryDelay: 1000,
    });

    return response.json();
  },

  /**
   * User login
   */
  async login(login: string, password: string) {
    const response = await fetchWithRetry(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, password }),
      retries: 2,
      retryDelay: 1000,
    });

    return response.json();
  },

  /**
   * Get authenticated user profile
   */
  async getUserProfile(token: string) {
    const response = await fetchWithRetry(`${API_BASE_URL}/user`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      retries: 3,
      retryDelay: 1000,
    });

    return response.json();
  },

  /**
   * Get user's complete profile details
   */
  async getMyDetails(token: string) {
    const response = await fetchWithRetry(`${API_BASE_URL}/my-details`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      retries: 3,
      retryDelay: 1000,
    });

    return response.json();
  },

  /**
   * Validate authentication token
   */
  async validateToken(token: string) {
    const response = await fetchWithRetry(`${API_BASE_URL}/validate-token`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      retries: 3,
      retryDelay: 1000,
    });

    return response.json();
  },

  /**
   * Logout and revoke token
   */
  async logout(token: string) {
    const response = await fetchWithRetry(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      retries: 2,
      retryDelay: 1000,
    });

    return response.json();
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(token: string) {
    const response = await fetchWithRetry(`${API_BASE_URL}/refresh-token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      retries: 2,
      retryDelay: 1000,
    });

    return response.json();
  },
};

// Authentication Helper Functions with Enhanced Security
export const auth = {
  /**
   * Get the storage mechanism (sessionStorage for better security)
   * sessionStorage clears on browser tab close, reducing XSS attack window
   */
  getStorage() {
    if (typeof window !== 'undefined') {
      return sessionStorage;
    }
    return null;
  },

  /**
   * Encrypt token for storage (simple base64 encoding as obfuscation)
   * Note: Not cryptographically secure, but adds a layer of obfuscation
   */
  encryptToken(token: string): string {
    try {
      return btoa(token);
    } catch {
      return token;
    }
  },

  /**
   * Decrypt token from storage
   */
  decryptToken(encryptedToken: string): string {
    try {
      return atob(encryptedToken);
    } catch {
      return encryptedToken;
    }
  },

  /**
   * Store authentication token (encrypted in sessionStorage)
   */
  setToken(token: string) {
    const storage = this.getStorage();
    if (storage) {
      const encrypted = this.encryptToken(token);
      storage.setItem('_at', encrypted); // Obfuscated key name
    }
  },

  /**
   * Get stored authentication token
   */
  getToken(): string | null {
    const storage = this.getStorage();
    if (storage) {
      const encrypted = storage.getItem('_at');
      return encrypted ? this.decryptToken(encrypted) : null;
    }
    return null;
  },

  /**
   * Remove authentication token
   */
  removeToken() {
    const storage = this.getStorage();
    if (storage) {
      storage.removeItem('_at');
      storage.removeItem('_uid');
      storage.removeItem('_exp');
    }
  },

  /**
   * Store user ID
   */
  setUserId(userId: number) {
    const storage = this.getStorage();
    if (storage) {
      storage.setItem('_uid', userId.toString());
    }
  },

  /**
   * Get stored user ID
   */
  getUserId(): number | null {
    const storage = this.getStorage();
    if (storage) {
      const userId = storage.getItem('_uid');
      return userId ? parseInt(userId) : null;
    }
    return null;
  },

  /**
   * Store token expiry timestamp
   */
  setTokenExpiry(expiryTimestamp: number) {
    const storage = this.getStorage();
    if (storage) {
      storage.setItem('_exp', expiryTimestamp.toString());
    }
  },

  /**
   * Get stored token expiry timestamp
   */
  getTokenExpiry(): number | null {
    const storage = this.getStorage();
    if (storage) {
      const expiry = storage.getItem('_exp');
      return expiry ? parseInt(expiry) : null;
    }
    return null;
  },

  /**
   * Check if token has expired
   */
  isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return false;

    const now = Math.floor(Date.now() / 1000);
    return now >= expiry;
  },

  /**
   * Check if token will expire soon (within 24 hours)
   */
  isTokenExpiringSoon(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return false;

    const now = Math.floor(Date.now() / 1000);
    const twentyFourHours = 24 * 60 * 60;
    return (expiry - now) <= twentyFourHours && (expiry - now) > 0;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  },

  /**
   * Migrate data from localStorage to sessionStorage (one-time migration)
   */
  migrateFromLocalStorage() {
    if (typeof window !== 'undefined' && localStorage) {
      // Check if old data exists in localStorage
      const oldToken = localStorage.getItem('token');
      const oldUserId = localStorage.getItem('userId');
      const oldExpiry = localStorage.getItem('tokenExpiry');

      if (oldToken) {
        this.setToken(oldToken);
        localStorage.removeItem('token');
      }
      if (oldUserId) {
        this.setUserId(parseInt(oldUserId));
        localStorage.removeItem('userId');
      }
      if (oldExpiry) {
        this.setTokenExpiry(parseInt(oldExpiry));
        localStorage.removeItem('tokenExpiry');
      }
    }
  },
};

export default apiClient;
