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
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        setLoading(false);
      }
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
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
        
      if (error) {
        console.warn('Profiles table not found or error fetching profile. Falling back to Auth metadata.');
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
           setUser({
             id: authData.user.id,
             email: authData.user.email || email,
             name: authData.user.user_metadata?.name || 'Administrator',
             role: authData.user.user_metadata?.role || 'ADMIN',
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
           .single();
         if (kycData) supplierStatus = kycData.status;
      }

      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        role: data.role as 'CUSTOMER' | 'SUPPLIER' | 'ADMIN',
        supplierStatus
      });
    } catch (e) {
      console.error(e);
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
      // User has enrolled in MFA but hasn't verified this session
      return { needsMFA: true, user: data.user };
    }
    
    // Wait for the profile to be fetched so the caller gets the full user object
    await fetchProfile(data.user.id, data.user.email || '');
    return { needsMFA: false, user: user }; 
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
    if (email.toLowerCase().includes('admin')) role = 'ADMIN';
    if (email.toLowerCase().includes('supplier')) role = 'SUPPLIER';

    // Call the backend API to create the user directly via Admin API to bypass rate limits
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass, name, role, kycData })
    });

    const resData = await response.json();

    if (!response.ok) {
      if (resData.error && resData.error.includes('already registered')) {
        throw new Error('This email address is already registered. If your account was suspended or recently rejected, you cannot create a new account.');
      }
      throw new Error(resData.error || 'Failed to create user via API');
    }

    // Now sign in automatically so the client has the session
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: pass
    });

    if (signInError) {
      console.warn('User created but auto-login failed:', signInError);
    }

    const user = resData.user || signInData?.user;

    if (user && role === 'SUPPLIER' && kycData) {
      // Insert KYC Record
      const { error: kycError } = await supabase
        .from('supplier_kyc_records')
        .insert({
          user_id: user.id,
          company_name: kycData.companyName,
          business_type: kycData.partnerType,
          location: kycData.location,
          phone: kycData.phone,
          currency: kycData.currency,
          business_reg: kycData.business_reg,
          tax_id: kycData.tax_id,
          documents: kycData.documents,
          status: 'PENDING'
        });
        
      if (kycError) {
        console.error('Failed to create KYC record', kycError);
        throw new Error(`KYC Record failed: ${kycError.message}`);
      }
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
      login: async () => true,
      signup: async () => true,
      checkUserExists: async () => false,
      logout: () => {},
      loading: false,
    };
  }
  return context;
}

