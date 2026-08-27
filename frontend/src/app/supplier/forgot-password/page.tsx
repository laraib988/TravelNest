'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Using public client for reset
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/supplier/reset-password`,
      });

      if (error) {
        throw error;
      }
      
      setMessage('Password reset link sent! Check your email.');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Header */}
      <header style={{ padding: '24px 40px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
          Vai<span style={{ color: '#fbbf24' }}>tour</span>
          <span style={{ marginLeft: '12px', fontSize: '1rem', color: '#10b981', fontWeight: 600, letterSpacing: '0' }}>SUPPLIER PORTAL</span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)', width: '100%', maxWidth: '440px' }}>
          
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer', padding: 0, marginBottom: '24px' }}>
            <ArrowLeft size={16} /> Back to Login
          </button>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Reset Password</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '32px', lineHeight: 1.5 }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                />
                <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {errorMsg && (
              <div style={{ padding: '12px', background: '#fef2f2', color: '#ef4444', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
                {errorMsg}
              </div>
            )}
            
            {message && (
              <div style={{ padding: '12px', background: '#ecfdf5', color: '#10b981', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#94a3b8' : '#0284c7',
                color: 'white',
                padding: '14px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '8px'
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

        </div>
      </main>
    </div>
  );
}
