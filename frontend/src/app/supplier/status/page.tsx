'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Clock, AlertTriangle, Ban, LogOut, CheckCircle2 } from 'lucide-react';

export default function SupplierStatusPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [kycRecord, setKycRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submittingFix, setSubmittingFix] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);

  // Edit fields
  const [editLocation, setEditLocation] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBusinessReg, setEditBusinessReg] = useState('');
  const [editTaxId, setEditTaxId] = useState('');

  const fetchStatus = async () => {
    setLoading(true);
    const res = await fetch('/api/supplier/kyc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user?.id })
    });
    
    const data = res.ok ? await res.json() : null;
      
      if (data) {
      if (data.status === 'APPROVED') {
        router.push('/supplier/dashboard');
      } else {
        setKycRecord(data);
        setEditLocation(data.location || '');
        setEditPhone(data.phone || '');
        setEditBusinessReg(data.business_reg || '');
        setEditTaxId(data.tax_id || '');
        setLoading(false);
      }
    } else {
      logout();
      router.push('/supplier/login');
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/supplier/login');
      return;
    }
    
    if (authLoading || !user) return;
    
    fetchStatus();
  }, [user, authLoading, router, logout]);

  const handleLogout = () => {
    logout();
    router.push('/supplier/login');
  };

  const handleResubmit = async () => {
    if (!newFile) return;
    setSubmittingFix(true);
    try {
      await fetch('/api/supplier/kyc/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user?.id, 
          status: 'PENDING',
          location: editLocation,
          phone: editPhone,
          business_reg: editBusinessReg,
          tax_id: editTaxId,
          new_document_name: newFile ? newFile.name : null
        })
      });
      // Refresh status after update
      await fetchStatus();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingFix(false);
      setNewFile(null);
    }
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading status...</div>;
  }

  const renderContent = () => {
    switch (kycRecord?.status) {
      case 'PENDING':
      case 'UNDER_REVIEW':
        return (
          <>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fef9c3', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Clock size={40} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Account Under Review</h1>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Thank you for applying, {user?.name || 'Partner'}. Our team is currently reviewing your verification documents. This process usually takes less than 24 hours.
            </p>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', fontSize: '0.9rem', color: '#64748b' }}>
              We will email you at <strong>{user?.email}</strong> as soon as your account is approved.
            </div>
          </>
        );

      case 'CHANGES_REQUESTED':
        return (
          <>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fffbe6', color: '#d97706', border: '2px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <AlertTriangle size={36} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Action Required</h1>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Our compliance team reviewed your application but we need a few things fixed before we can approve your account.
            </p>
            <div style={{ background: '#fff', border: '1px solid #fcd34d', padding: '24px', borderRadius: '16px', textAlign: 'left', marginBottom: '32px' }}>
              <div style={{ fontWeight: 800, color: '#b45309', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} /> Admin Feedback:
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#451a03', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {kycRecord?.audit_reasons?.map((reason: string, i: number) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            </div>

            <div style={{ textAlign: 'left', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Location</label>
                  <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                  <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }} />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>CNIC / Reg Number</label>
                  <input type="text" value={editBusinessReg} onChange={(e) => setEditBusinessReg(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>NTN / Tax ID</label>
                  <input type="text" value={editTaxId} onChange={(e) => setEditTaxId(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }} />
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'left', marginBottom: '24px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                Upload Updated Document
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', borderRadius: '12px', border: '2px dashed #cbd5e1', background: '#f8fafc', cursor: 'pointer', transition: 'all 0.2s' }}>
                <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={(e) => setNewFile(e.target.files?.[0] || null)} />
                {newFile ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: 700, fontSize: '0.88rem' }}>
                    <CheckCircle2 size={20} /> {newFile.name}
                  </div>
                ) : (
                  <>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0284c7' }}>Click to browse file</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>JPG, PNG or PDF (Max 10MB)</span>
                  </>
                )}
              </label>
            </div>
            <button 
              className="btn-primary" 
              onClick={handleResubmit}
              disabled={submittingFix}
              style={{ width: '100%', padding: '14px', borderRadius: '100px', fontWeight: 700, opacity: submittingFix ? 0.6 : 1 }}
            >
              {submittingFix ? 'Submitting...' : 'Re-submit Application'}
            </button>
          </>
        );

      case 'REJECTED':
        return (
          <>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fff1f2', color: '#e11d48', border: '2px solid #fecdd3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Ban size={36} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Application Rejected</h1>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Unfortunately, we could not verify your business at this time. Your application has been rejected.
            </p>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', fontSize: '0.9rem', color: '#64748b' }}>
              You may re-apply with this email address after <strong>30 days</strong>.
            </div>
          </>
        );

      case 'SUSPENDED':
        return (
          <>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Ban size={36} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Account Banned</h1>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Your account has been permanently banned due to a violation of our Terms of Service or fraudulent activity detected.
            </p>
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '16px', borderRadius: '12px', fontSize: '0.9rem', color: '#b91c1c', fontWeight: 600, marginBottom: '16px' }}>
              This email address is permanently banned from creating new accounts on Vaitour.
            </div>
            {kycRecord?.audit_reasons && kycRecord.audit_reasons.length > 0 && (
              <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '16px', borderRadius: '12px', textAlign: 'left', marginBottom: '24px' }}>
                <div style={{ fontWeight: 800, color: '#be123c', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={18} /> Ban Reason:
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#881337', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {kycRecord.audit_reasons.map((reason: string, i: number) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '16px', textAlign: 'left', marginBottom: '8px' }}>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem', marginBottom: '8px' }}>
                Want to appeal this ban?
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
                You can submit an appeal to our compliance team. They will review your case and respond via email.
              </p>
              <button
                type="button"
                style={{
                  marginTop: '14px', padding: '12px 20px', borderRadius: '12px', background: '#0f172a', color: '#ffffff',
                  fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%'
                }}
              >
                <LogOut size={16} style={{ transform: 'rotate(180deg)' }} /> Appeal Ban via Email
              </button>
              <p style={{ margin: '10px 0 0', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
                You will be contacted at <strong>{user?.email}</strong>
              </p>
            </div>
          </>
        );
        
      default:
        return <div>Unknown Status</div>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '540px', background: '#ffffff', borderRadius: '24px', padding: '48px 40px', textAlign: 'center', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}>
        {renderContent()}
        
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
          <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#64748b', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
