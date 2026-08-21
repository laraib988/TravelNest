'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'CUSTOMER' | 'SUPPLIER' | 'ADMIN';
  supplierStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'CHANGES_REQUESTED';
}

interface AuthContextType {
  user: User | null;
  isAuthModalOpen: boolean;
  authMode: 'LOGIN' | 'SIGNUP';
  openAuthModal: (mode?: 'LOGIN' | 'SIGNUP') => void;
  closeAuthModal: () => void;
  login: (email: string, pass: string) => Promise<any>;
  signup: (name: string, email: string, pass: string, role?: string, kycData?: any) => Promise<boolean>;
  checkUserExists: (email: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error || !data) {
        // Fallback: use auth metadata directly
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          setUser({
            id: authData.user.id,
            email: authData.user.email || email,
            name: authData.user.user_metadata?.name || email.split('@')[0],
            role: authData.user.user_metadata?.role || 'CUSTOMER',
            avatar: authData.user.user_metadata?.avatar,
          });
        }
        return;
      }
      
      let supplierStatus;
      if (data.role === 'SUPPLIER') {
        const { data: kycData } = await supabase
          .from('supplier_kyc_records')
          .select('status')
          .eq('user_id', userId)
          .maybeSingle();
        if (kycData) supplierStatus = kycData.status;
      }

      setUser({
        id: data.id,
        name: data.name || email.split('@')[0],
        email: data.email,
        avatar: data.avatar,
        role: data.role as 'CUSTOMER' | 'SUPPLIER' | 'ADMIN',
        supplierStatus
      });
    } catch (e) {
      console.error('fetchProfile error:', e);
    } finally {
      setLoading(false);
    }
  };

  const openAuthModal = (mode: 'LOGIN' | 'SIGNUP' = 'LOGIN') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) throw error;
    
    // Check if MFA is required
    const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (!aalError && aalData?.nextLevel === 'aal2' && aalData?.currentLevel === 'aal1') {
      return { needsMFA: true, user: data.user };
    }
    
    await fetchProfile(data.user.id, data.user.email || '');
    return { needsMFA: false, user: data.user };
  };

  const checkUserExists = async (email: string) => {
    try {
      const { data } = await supabase.from('profiles').select('id').eq('email', email).maybeSingle();
      return !!data;
    } catch {
      return false;
    }
  };

  const signup = async (name: string, email: string, pass: string, requestedRole?: string, kycData?: any) => {
    let role = requestedRole || 'CUSTOMER';
    // Don't override role based on email content for security
    // The requestedRole from the supplier signup form is what we trust

    // Call the backend API — it handles user creation, profiles upsert, and KYC insert server-side
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass, name, role, kycData })
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.error || 'Signup failed. Please try again.');
    }

    // Auto sign-in after successful creation
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: pass
    });

    if (signInError) {
      console.warn('User created but auto-login failed:', signInError.message);
      // Don't throw — user was created successfully, they can log in manually
    }

    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
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
        checkUserExists,
        logout,
        loading
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
      login: async () => ({ needsMFA: false, user: null }),
      signup: async () => true,
      checkUserExists: async () => false,
      logout: () => {},
      loading: false,
    };
  }
  return context;
}
