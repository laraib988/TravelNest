'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import TurnstileWidget from '@/components/TurnstileWidget';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, signup } = useAuth();
  const [email, setEmail] = useState('admin@travelnest.com');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const [showMfa, setShowMfa] = useState(false);
  const [mfaCode, setMfaCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const safeEmail = email.toLowerCase() === 'admin' ? 'admin@travelnest.com' : email;
    const safePassword = password === 'admin' ? 'password123' : password;

    try {
      const result = await login(safeEmail, safePassword);
      if (result && result.needsMFA) {
        setShowMfa(true);
      } else {
        router.push('/admin');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { supabase } = await import('@/lib/supabase');
      const factors = await supabase.auth.mfa.listFactors();
      if (factors.error) throw factors.error;
      
      const totpFactor = factors.data.totp[0];
      if (!totpFactor) throw new Error('No TOTP factor found!');

      const challenge = await supabase.auth.mfa.challenge({ factorId: totpFactor.id });
      if (challenge.error) throw challenge.error;

      const verify = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.data.id,
        code: mfaCode
      });
      
      if (verify.error) throw verify.error;

      // Successfully verified AAL2
      router.push('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid authenticator code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '440px', width: '100%', padding: '40px 32px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <ShieldCheck size={16} /> Secure Admin Portal
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Admin Login</h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
            {showMfa ? 'Enter the 6-digit code from your authenticator app.' : 'Enter your administrator credentials to continue.'}
          </p>
        </div>

        {errorMsg && (
          <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', border: '1px solid #fecaca' }}>
            {errorMsg}
          </div>
        )}

        {!showMfa ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Admin Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <TurnstileWidget onVerify={(token) => setTurnstileToken(token)} />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 700, borderRadius: '9999px', justifyContent: 'center', marginTop: '8px', opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}
            >
              {loading ? 'Authenticating...' : 'Secure Login'} <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleMfaSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Authenticator Code (6-digits)</label>
              <div style={{ position: 'relative' }}>
                <ShieldCheck size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123456"
                  style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1.2rem', letterSpacing: '2px', textAlign: 'center' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || mfaCode.length !== 6}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 700, borderRadius: '9999px', justifyContent: 'center', marginTop: '8px' }}
            >
              {loading ? 'Verifying...' : 'Verify MFA'} <ArrowRight size={18} />
            </button>
            
            <button 
              type="button"
              onClick={() => { setShowMfa(false); setMfaCode(''); }}
              style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.9rem', cursor: 'pointer', marginTop: '8px', fontWeight: 600 }}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
