import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import * as authService from '../services/auth.service';

type UserRole = 'client' | 'agent' | null;

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check if user is already logged in (has valid token)
    const initializeAuth = async () => {
      try {
        const storedUser = authService.getStoredUser();
        const storedToken = authService.getStoredToken();
        
        if (storedUser && storedToken) {
          // Verify the token is still valid
          const isValid = await authService.verifyToken();
          
          if (isValid) {
            // Ensure the role is cast to UserRole
            setUser({
              ...storedUser,
              role: storedUser.role as UserRole
            });
          } else {
            // Token is invalid, clear auth data
            authService.clearAuthData();
          }
        }
      } catch (error) {
        console.error('Error initializing authentication:', error);
        authService.clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ usernameOrEmail, password });
      
      // Store token and user data
      authService.setAuthData(response);
      
      // Update state with properly typed role
      setUser({
        ...response.user,
        role: response.user.role as UserRole
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    setLoading(true);
    try {
      const response = await authService.register({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        password: userData.password,
        role: userData.role || 'client',
      });
      
      // Store token and user data
      authService.setAuthData(response);
      
      // Update state with properly typed role
      setUser({
        ...response.user,
        role: response.user.role as UserRole
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear auth data from localStorage
    authService.clearAuthData();
    
    // Reset state
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 