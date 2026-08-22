'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import TurnstileWidget from '@/components/TurnstileWidget';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('/');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redir = params.get('redirect');
    if (redir) setRedirectUrl(redir);
  }, []);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      await login(email, password);
      router.push(redirectUrl);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '60px auto', padding: '0 24px' }}>
      <div className="card-panel" style={{ padding: '36px', borderRadius: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <ShieldCheck size={14} /> TravelNest Secure Sign In
          </div>
          <h1 style={{ fontSize: '1.8rem', color: '#0f172a', fontWeight: 800, marginBottom: '6px' }}>
            Welcome Back!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sign in to manage your bookings & access saved itineraries
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                placeholder="e.g. traveler@example.com"
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
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}
              />
            </div>
          </div>

          <TurnstileWidget onVerify={(token) => setTurnstileToken(token)} />

          {authError && (
            <div style={{ padding: '12px', borderRadius: '12px', background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
              {authError}
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
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'wait' : 'pointer'
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link href={redirectUrl !== '/' ? `/signup?redirect=${encodeURIComponent(redirectUrl)}` : '/signup'} style={{ color: 'var(--brand-primary)', fontWeight: 700, textDecoration: 'underline' }}>
            Create Account
          </Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Are you a Supplier/Partner? <Link href="/supplier/login" style={{ color: 'var(--brand-primary)', fontWeight: 700, textDecoration: 'underline' }}>Supplier Login</Link>
        </div>
      </div>
    </div>
  );
}










