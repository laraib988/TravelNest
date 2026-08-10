'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'CUSTOMER' | 'SUPPLIER' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  isAuthModalOpen: boolean;
  authMode: 'LOGIN' | 'SIGNUP';
  openAuthModal: (mode?: 'LOGIN' | 'SIGNUP') => void;
  closeAuthModal: () => void;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  useEffect(() => {
    const savedUser = localStorage.getItem('travelnest_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
  }, []);

  const openAuthModal = (mode: 'LOGIN' | 'SIGNUP' = 'LOGIN') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, pass: string) => {
    const displayName = email.includes('sunnypirkash') ? 'Suneel Pirkash' : (email.split('@')[0].toUpperCase() || 'Traveler');
    const mockUser: User = {
      id: 'usr-' + Math.random().toString(36).substr(2, 6),
      name: displayName,
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'CUSTOMER',
    };
    setUser(mockUser);
    localStorage.setItem('travelnest_user', JSON.stringify(mockUser));
    setIsAuthModalOpen(false);
    return true;
  };

  const signup = async (name: string, email: string, pass: string) => {
    const mockUser: User = {
      id: 'usr-' + Math.random().toString(36).substr(2, 6),
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'CUSTOMER',
    };
    setUser(mockUser);
    localStorage.setItem('travelnest_user', JSON.stringify(mockUser));
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('travelnest_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      isAuthModalOpen: false,
      authMode: 'LOGIN' as const,
      openAuthModal: () => {},
      closeAuthModal: () => {},
      login: async () => true,
      signup: async () => true,
      logout: () => {},
    };
  }
  return context;
}
