'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { auth, apiClient } from '@/lib/api';

// Split contexts: State vs Actions for better performance
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: number | null;
  token: string | null;
}

interface AuthActions {
  login: (token: string, userId: number, expiryTimestamp: number) => void;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

// Separate contexts to prevent unnecessary re-renders
const AuthStateContext = createContext<AuthState | undefined>(undefined);
const AuthActionsContext = createContext<AuthActions | undefined>(undefined);

// Hook to access auth state
export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (!context) {
    throw new Error('useAuthState must be used within an AuthProvider');
  }
  return context;
};

// Hook to access auth actions
export const useAuthActions = () => {
  const context = useContext(AuthActionsContext);
  if (!context) {
    throw new Error('useAuthActions must be used within an AuthProvider');
  }
  return context;
};

// Convenience hook that provides both state and actions (for backward compatibility)
export const useAuth = () => {
  const state = useAuthState();
  const actions = useAuthActions();
  return useMemo(() => ({ ...state, ...actions }), [state, actions]);
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
          auth.removeToken();
          setIsAuthenticated(false);
          setToken(null);
          setUserId(null);
          setIsLoading(false);
          return;
        }

        // Check if token is expiring soon and refresh it
        if (auth.isTokenExpiringSoon()) {
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

  // Memoize auth state to prevent unnecessary re-renders
  const authState = useMemo<AuthState>(
    () => ({
      isAuthenticated,
      isLoading,
      userId,
      token,
    }),
    [isAuthenticated, isLoading, userId, token]
  );

  // Memoize login function to prevent recreation on every render
  const login = useCallback((newToken: string, newUserId: number, expiryTimestamp: number) => {
    auth.setToken(newToken);
    auth.setUserId(newUserId);
    auth.setTokenExpiry(expiryTimestamp);
    setToken(newToken);
    setUserId(newUserId);
    setIsAuthenticated(true);
  }, []);

  // Memoize logout function
  const logout = useCallback(async () => {
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
  }, []);

  // Memoize refreshToken function
  const refreshTokenFn = useCallback(async (): Promise<boolean> => {
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
  }, [logout]);

  // Memoize auth actions to prevent recreation on every render
  const authActions = useMemo<AuthActions>(
    () => ({
      login,
      logout,
      refreshToken: refreshTokenFn,
    }),
    [login, logout, refreshTokenFn]
  );

  return (
    <AuthStateContext.Provider value={authState}>
      <AuthActionsContext.Provider value={authActions}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
};
