'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, apiClient } from '@/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: number | null;
  token: string | null;
  login: (token: string, userId: number, expiryTimestamp: number) => void;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  userId: null,
  token: null,
  login: () => {},
  logout: async () => {},
  refreshToken: async () => false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Validate token on mount and handle auto-refresh
  useEffect(() => {
    const validateAuth = async () => {
      // Migrate from localStorage to sessionStorage (one-time)
      auth.migrateFromLocalStorage();

      const storedToken = auth.getToken();
      const storedUserId = auth.getUserId();

      if (storedToken && storedUserId) {
        // Check if token is expired
        if (auth.isTokenExpired()) {
          console.log('Token has expired, clearing auth');
          auth.removeToken();
          setIsAuthenticated(false);
          setToken(null);
          setUserId(null);
          setIsLoading(false);
          return;
        }

        // Check if token is expiring soon and refresh it
        if (auth.isTokenExpiringSoon()) {
          console.log('Token expiring soon, refreshing...');
          try {
            const refreshResponse = await apiClient.refreshToken(storedToken);

            if (refreshResponse.status === 'success' && refreshResponse.data) {
              const newToken = refreshResponse.data.token;
              const newExpiry = refreshResponse.data.expire_date;

              auth.setToken(newToken);
              auth.setTokenExpiry(newExpiry);
              setToken(newToken);
              setIsAuthenticated(true);
              setUserId(storedUserId);
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error('Token refresh error:', error);
          }
        }

        try {
          // Validate token with the API
          const response = await apiClient.validateToken(storedToken);

          if (response.status === 'success' && response.data) {
            // Token is valid, update state
            setIsAuthenticated(true);
            setToken(storedToken);
            setUserId(storedUserId);

            // Update token expiry if provided
            if (response.data.token_info?.expires_at_timestamp) {
              auth.setTokenExpiry(response.data.token_info.expires_at_timestamp);
            }
          } else {
            // Token is invalid, clear storage
            auth.removeToken();
            setIsAuthenticated(false);
            setToken(null);
            setUserId(null);
          }
        } catch (error) {
          // Error validating token, clear auth
          console.error('Token validation error:', error);
          auth.removeToken();
          setIsAuthenticated(false);
          setToken(null);
          setUserId(null);
        }
      } else {
        // No stored credentials
        setIsAuthenticated(false);
        setToken(null);
        setUserId(null);
      }

      // Set loading to false after validation is complete
      setIsLoading(false);
    };

    validateAuth();
  }, []);

  const login = (newToken: string, newUserId: number, expiryTimestamp: number) => {
    auth.setToken(newToken);
    auth.setUserId(newUserId);
    auth.setTokenExpiry(expiryTimestamp);
    setToken(newToken);
    setUserId(newUserId);
    setIsAuthenticated(true);
  };

  const refreshToken = async (): Promise<boolean> => {
    const currentToken = auth.getToken();

    if (!currentToken) {
      return false;
    }

    try {
      const response = await apiClient.refreshToken(currentToken);

      if (response.status === 'success' && response.data) {
        const newToken = response.data.token;
        const newExpiry = response.data.expire_date;
        const newUserId = response.data.user_id;

        auth.setToken(newToken);
        auth.setTokenExpiry(newExpiry);
        auth.setUserId(newUserId);
        setToken(newToken);
        setUserId(newUserId);
        setIsAuthenticated(true);

        return true;
      } else {
        // Token refresh failed, logout
        await logout();
        return false;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      await logout();
      return false;
    }
  };

  const logout = async () => {
    const currentToken = auth.getToken();

    if (currentToken) {
      try {
        // Call logout API to revoke token on server
        await apiClient.logout(currentToken);
      } catch (error) {
        console.error('Error during logout:', error);
        // Continue with local logout even if API call fails
      }
    }

    // Clear local storage and state
    auth.removeToken();
    setToken(null);
    setUserId(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        userId,
        token,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};