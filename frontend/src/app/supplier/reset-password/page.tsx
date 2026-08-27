'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Check if we have a session to reset the password
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setErrorMsg('Invalid or expired reset link. Please try again.');
      }
    });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setMessage('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }
      
      setMessage('Password successfully updated! Redirecting to login...');
      setTimeout(() => {
        router.push('/supplier/login');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to update password.');
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
          
          <button onClick={() => router.push('/supplier/login')} style={{ background: 'none', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer', padding: 0, marginBottom: '24px' }}>
            <ArrowLeft size={16} /> Back to Login
          </button>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Create New Password</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '32px', lineHeight: 1.5 }}>
            Enter your new password below.
          </p>

          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                />
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                </button>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                />
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
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
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>

        </div>
      </main>
    </div>
  );
}
