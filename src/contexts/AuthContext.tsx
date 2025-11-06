'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, apiClient } from '@/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: number | null;
  token: string | null;
  login: (token: string, userId: number) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  userId: null,
  token: null,
  login: () => {},
  logout: async () => {},
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

  // Validate token on mount
  useEffect(() => {
    const validateAuth = async () => {
      const storedToken = auth.getToken();
      const storedUserId = auth.getUserId();

      if (storedToken && storedUserId) {
        try {
          // Validate token with the API
          const response = await apiClient.validateToken(storedToken);

          if (response.status === 'success' && response.data) {
            // Token is valid, update state
            setIsAuthenticated(true);
            setToken(storedToken);
            setUserId(storedUserId);
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

  const login = (newToken: string, newUserId: number) => {
    auth.setToken(newToken);
    auth.setUserId(newUserId);
    setToken(newToken);
    setUserId(newUserId);
    setIsAuthenticated(true);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};