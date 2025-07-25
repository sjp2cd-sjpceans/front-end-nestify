import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

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
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  // These functions will be implemented later with actual API calls
  const login = async (email: string, password: string) => {
    // Mock implementation for now
    console.log('Login attempt with:', email, password);
    // In a real implementation, you would make an API call here
    // and handle the response, storing tokens, etc.
    const mockUser: User = {
      id: '1',
      email,
      firstName: 'John',
      lastName: 'Doe',
      role: 'client',
    };
    setUser(mockUser);
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    // Mock implementation for now
    console.log('Register attempt with:', userData);
    // In a real implementation, you would make an API call here
    const mockUser: User = {
      id: '1',
      email: userData.email || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      role: userData.role || 'client',
    };
    setUser(mockUser);
  };

  const logout = () => {
    // Mock implementation for now
    setUser(null);
    // In a real implementation, you would also clear tokens, etc.
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
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