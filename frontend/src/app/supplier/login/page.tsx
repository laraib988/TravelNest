'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Clock,
  ArrowLeft,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SupplierLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      await login(email, password);
      router.push('/supplier/status');
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          maxWidth: '500px',
          width: '100%',
          padding: '40px 32px',
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <ShieldCheck size={14} /> Vaitour Partner Portal
          </div>
          <h2 style={{ fontSize: '1.75rem', color: '#0f172a', fontWeight: 800, marginBottom: '6px' }}>
            Welcome Back!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Sign in to access your supplier dashboard
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 42px 12px 42px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: '0' }}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button 
                type="button"
                onClick={() => router.push('/supplier/forgot-password')}
                style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                Forgot password?
              </button>
            </div>
          </div>

          {authError && (
            <div style={{ padding: '12px', borderRadius: '12px', background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <ShieldCheck size={16} /> {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              padding: '14px',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-pill)',
              justifyContent: 'center',
              marginTop: '8px',
            }}
          >
            {loading ? 'Processing...' : 'Sign In to Account'} <ArrowRight size={18} />
          </button>
        </form>

        {/* SOCIAL AUTH STRIP */}
        <div style={{ margin: '24px 0 16px', textAlign: 'center', position: 'relative' }}>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
          <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '0 12px', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>OR SOCIAL SIGN-ON</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          <button
            type="button"
            onClick={async () => {
              await login('google.user@gmail.com', 'pass');
              router.push('/supplier');
            }}
            style={{ padding: '10px 6px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
          >
            🌐 Google
          </button>
          <button
            type="button"
            onClick={async () => {
              await login('fb.user@facebook.com', 'pass');
              router.push('/supplier');
            }}
            style={{ padding: '10px 6px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
          >
            📘 Facebook
          </button>
          <button
            type="button"
            onClick={async () => {
              await login('apple.user@apple.com', 'pass');
              router.push('/supplier');
            }}
            style={{ padding: '10px 6px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
          >
            🍎 Apple ID
          </button>
        </div>

        {/* MODE TOGGLE */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/supplier/signup" style={{ color: 'var(--brand-primary)', fontWeight: 700, textDecoration: 'underline' }}>
            Sign Up
          </Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Are you a Traveler/Customer? <Link href="/login" style={{ color: 'var(--brand-primary)', fontWeight: 700, textDecoration: 'underline' }}>Customer Login</Link>
        </div>
      </div>
    </div>
  );
}
