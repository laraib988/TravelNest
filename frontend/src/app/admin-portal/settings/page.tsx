'use client';

import React, { useState } from 'react';
import {
  Settings, Shield, Bell, CreditCard, Lock, Save, Globe,
  CheckCircle2, Cpu, Server
} from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [platformName, setPlatformName] = useState('Vaitour Marketplace');
  const [commissionRate, setCommissionRate] = useState(15);
  const [autoApproveSuppliers, setAutoApproveSuppliers] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Platform Settings & System Configuration
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
            Configure marketplace commission rates, supplier auto-approval SLAs, and security controls.
          </p>
        </div>

        <button className="btn-primary" onClick={handleSave} style={{ padding: '10px 24px', fontSize: '0.88rem' }}>
          <Save size={16} /> Save Configuration
        </button>
      </div>

      {saved && (
        <div style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '12px 20px', borderRadius: '12px', fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={18} /> Settings updated successfully!
        </div>
      )}

      {/* Settings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
        
        {/* Marketplace Business Rules */}
        <div className="admin-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Settings size={20} color="#0284c7" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>General Marketplace Settings</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                Platform Branding Name
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                Default Marketplace Commission Rate (%)
              </label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Auto-Approve Solo Suppliers</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>If enabled, solo suppliers pass KYC verification instantly.</div>
              </div>
              <input
                type="checkbox"
                checked={autoApproveSuppliers}
                onChange={(e) => setAutoApproveSuppliers(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Security & AI Moderation */}
        <div className="admin-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Shield size={20} color="#7c3aed" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>AI Fraud Detection & Security</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>AI Document OCR Confidence Threshold</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>Minimum 85% confidence required for automated KYC approval.</div>
            </div>

            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>Review Moderation Sensitivity</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>High — Flags reviews with suspicious IP activity or spam patterns.</div>
            </div>
          </div>
        </div>

      </div>

      {/* Security Settings Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
        <MfaSettings />
      </div>

    </div>
  );
}

// MFA Settings Component
function MfaSettings() {
  const [mfaStatus, setMfaStatus] = useState<'LOADING' | 'UNENROLLED' | 'ENROLLED'>('LOADING');
  const [enrolling, setEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [factorId, setFactorId] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  React.useEffect(() => {
    checkMfaStatus();
  }, []);

  const checkMfaStatus = async () => {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (error) throw error;
      
      if (data.nextLevel === 'aal2') {
        setMfaStatus('ENROLLED');
      } else {
        setMfaStatus('UNENROLLED');
      }
    } catch (e) {
      console.error('Error checking MFA status:', e);
      setMfaStatus('UNENROLLED');
    }
  };

  const startEnrollment = async () => {
    try {
      setEnrolling(true);
      setErrorMsg('');
      const { supabase } = await import('@/lib/supabase');
      
      // Fix: Check and remove any existing incomplete MFA factors to prevent "already exists" error
      const existingFactors = await supabase.auth.mfa.listFactors();
      if (existingFactors.data?.totp && existingFactors.data.totp.length > 0) {
        for (const factor of existingFactors.data.totp) {
          await supabase.auth.mfa.unenroll({ factorId: factor.id });
        }
      }

      // Start fresh enrollment
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Vaitour Admin'
      });
      if (error) throw error;

      setFactorId(data.id);
      setQrCode(data.totp.qr_code); // SVG string
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to start MFA enrollment.');
      setEnrolling(false);
    }
  };

  const verifyEnrollment = async () => {
    try {
      setErrorMsg('');
      const { supabase } = await import('@/lib/supabase');
      
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) throw challenge.error;

      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code: verifyCode
      });
      if (verify.error) throw verify.error;

      setSuccessMsg('MFA successfully enabled! You will now be required to enter a code when logging in.');
      setMfaStatus('ENROLLED');
      setEnrolling(false);
    } catch (e: any) {
      setErrorMsg(e.message || 'Invalid code. Please try again.');
    }
  };

  const unenrollMfa = async () => {
    try {
      setErrorMsg('');
      const { supabase } = await import('@/lib/supabase');
      
      const factors = await supabase.auth.mfa.listFactors();
      if (factors.error) throw factors.error;
      
      const totpFactor = factors.data.totp[0];
      if (totpFactor) {
        const { error } = await supabase.auth.mfa.unenroll({ factorId: totpFactor.id });
        if (error) throw error;
      }
      
      setMfaStatus('UNENROLLED');
      setSuccessMsg('MFA has been disabled.');
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to disable MFA.');
    }
  };

  return (
    <div className="admin-stat-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Lock size={20} color="#e11d48" />
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Multi-Factor Authentication (MFA)</h2>
      </div>

      {errorMsg && (
        <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', border: '1px solid #fecaca' }}>
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div style={{ background: '#f0fdf4', color: '#15803d', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', border: '1px solid #bbf7d0' }}>
          {successMsg}
        </div>
      )}

      {mfaStatus === 'LOADING' ? (
        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Checking MFA status...</div>
      ) : mfaStatus === 'ENROLLED' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f0fdf4', color: '#16a34a', padding: '6px 12px', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 700, border: '1px solid #bbf7d0' }}>
            <CheckCircle2 size={16} /> MFA is currently Enabled
          </div>
          <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
            Your account is secured with Two-Factor Authentication. You will be prompted for an authenticator code during login.
          </p>
          <button onClick={unenrollMfa} className="btn-secondary" style={{ color: '#e11d48', borderColor: '#fecdd3', background: '#fff1f2', padding: '8px 16px', fontSize: '0.85rem' }}>
            Disable MFA
          </button>
        </div>
      ) : enrolling ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
            1. Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.).
          </p>
          <div 
            style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'inline-block', alignSelf: 'flex-start' }}
            dangerouslySetInnerHTML={{ __html: qrCode }}
          />
          <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
            2. Enter the 6-digit code from your app to verify.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              maxLength={6}
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="123456"
              style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', letterSpacing: '2px', width: '120px', textAlign: 'center' }}
            />
            <button onClick={verifyEnrollment} disabled={verifyCode.length !== 6} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              Verify & Enable
            </button>
            <button onClick={() => setEnrolling(false)} className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
          <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
            Add an extra layer of security to your admin account by requiring a code from an authenticator app when you log in.
          </p>
          <button onClick={startEnrollment} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
            <Shield size={16} /> Setup Authenticator App
          </button>
        </div>
      )}
    </div>
  );
}
