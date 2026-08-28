'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@supabase/supabase-js';
import { Edit2, Save, AlertTriangle, User, Building2, MapPin, Phone, Hash, FileText, Lock, Mail, Image as ImageIcon, Upload, Plus } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export default function AccountSettingsClient() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [kycData, setKycData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [message, setMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [showBankForm, setShowBankForm] = useState(false);
  const [toastMessage, setToastMessage] = useState<{title: string, message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchBankAccounts();
    }
  }, [user]);

  const fetchBankAccounts = async () => {
    try {
      const res = await fetch(`/api/supplier/bank-details?supplierId=${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setBankAccounts(data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const triggerToast = (title: string, message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ title, message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };


  useEffect(() => {
    if (user?.id) {
      fetchAccountData();
    }
  }, [user]);

  const fetchAccountData = async () => {
    try {
      const res = await fetch(`/api/supplier/profile?userId=${user?.id}`);
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      
      const profile = data.profile || { name: user?.name, email: user?.email, avatar: user?.avatar };
      const kyc = data.kyc || {};
      
      setProfileData(profile);
      setKycData(kyc);
      
      setFormData({
        name: profile?.name || user?.name || '',
        avatar: profile?.avatar || user?.avatar || '',
        company_name: kyc?.company_name || '',
        phone: kyc?.phone || '',
        location: kyc?.location || '',
        currency: kyc?.currency || 'USD',
        tax_id: kyc?.tax_id || '',
        business_reg: kyc?.business_reg || '',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const uploadImageToCloudinary = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData(prev => ({ ...prev, avatar: data.url }));
      } else {
        throw new Error(data.error || 'Failed to upload image');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setMessage('Saving profile changes...');
      const res = await fetch('/api/supplier/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, formData, profileData, kycData })
      });
      
      if (!res.ok) throw new Error('Failed to save profile changes');
        
      setIsEditing(false);
      setMessage('Profile changes saved successfully.');
      fetchAccountData(); // Refresh
      setTimeout(() => setMessage(''), 4000);
    } catch (e) {
      console.error(e);
      setMessage('Failed to save profile changes.');
    }
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordMessage({ text: 'Password must be at least 8 characters.', type: 'error' });
      return;
    }
    
    setPasswordMessage({ text: 'Updating password...', type: 'info' });
    
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: passwordForm.currentPassword
      });
      
      if (signInError) {
        setPasswordMessage({ text: 'Current password is incorrect.', type: 'error' });
        return;
      }
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });
      
      if (updateError) throw updateError;
      
      setPasswordMessage({ text: 'Password updated successfully.', type: 'success' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
      setTimeout(() => setPasswordMessage({ text: '', type: '' }), 4000);
      
    } catch (e: any) {
      setPasswordMessage({ text: e.message || 'Failed to update password.', type: 'error' });
    }
  };

  if (loading) return <div>Loading account details...</div>;

  return (
    <div className="account-settings-container" style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <style>{`
        @media (max-width: 768px) {
          .account-settings-container { padding: 16px !important; }
          .account-header { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
          .account-header button { width: 100% !important; justify-content: center !important; }
          .account-header > div { width: 100% !important; flex-direction: column !important; gap: 8px !important; }
          .account-avatar-section { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
          .account-avatar-section > div { flex-direction: column !important; width: 100% !important; }
          .account-avatar-section button { width: 100% !important; justify-content: center !important; padding: 12px !important; }
          .account-grid { grid-template-columns: 1fr !important; }
          .account-form-buttons { flex-direction: column !important; width: 100% !important; }
          .account-form-buttons > button { width: 100% !important; }
          .bank-card { flex-direction: column !important; align-items: stretch !important; gap: 16px !important; padding: 16px !important; }
        }
      `}</style>
      
      {/* 1. Profile Information */}
      <section>
        <div className="account-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Account Profile</h2>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#f1f5f9', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
            >
              <Edit2 size={16} /> Edit Profile
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => { setIsEditing(false); fetchAccountData(); }}
                style={{ padding: '8px 16px', background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          )}
        </div>

        {message && (
          <div style={{ padding: '12px', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '24px', fontWeight: 600 }}>
            {message}
          </div>
        )}

        {isEditing && (
          <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '16px', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '24px' }}>
            <AlertTriangle color="#d97706" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: '#92400e', fontWeight: 700 }}>Profile Review Required</h4>
              <p style={{ margin: 0, color: '#b45309', fontSize: '0.9rem', lineHeight: 1.5 }}>
                After editing, your profile will be reviewed by admin. It will take up to one week. During approval, you can use your old information and changes and products will be still live without any issue.
              </p>
            </div>
          </div>
        )}

        <div className="account-avatar-section" style={{ display: 'flex', gap: '32px', marginBottom: '24px', alignItems: 'center' }}>
          <Image src={isEditing ? formData.avatar : (profileData?.avatar || 'https://ui-avatars.com/api/?name=Supplier')} alt="Profile Icon" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }}  width={100} height={100} />
          {isEditing && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}><ImageIcon size={14} /> Profile Image URL</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input type="text" value={formData.avatar || ''} onChange={e => setFormData({...formData, avatar: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="https://..." />
                <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && uploadImageToCloudinary(e.target.files[0])} style={{ display: 'none' }} />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  style={{ padding: '0 20px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#0f172a', fontWeight: 600 }}
                >
                  <Upload size={16} /> {uploadingImage ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="account-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} /> Full Name</label>
            {isEditing ? (
              <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            ) : (
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#0f172a', fontWeight: 600 }}>{profileData?.name || 'N/A'}</div>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> Email Address</label>
            <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>
              {profileData?.email || user?.email} (Cannot be changed)
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}><Building2 size={14} /> Company Name</label>
            {isEditing ? (
              <input type="text" value={formData.company_name || ''} onChange={e => setFormData({...formData, company_name: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            ) : (
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#0f172a', fontWeight: 600 }}>{kycData?.company_name || 'N/A'}</div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} /> Business Type</label>
            <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>
              {kycData?.business_type || 'SOLO'} (Cannot be changed)
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> Location</label>
            {isEditing ? (
              <input type="text" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            ) : (
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#0f172a', fontWeight: 600 }}>{kycData?.location || 'N/A'}</div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> Phone Number</label>
            {isEditing ? (
              <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            ) : (
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#0f172a', fontWeight: 600 }}>{kycData?.phone || 'N/A'}</div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}><Hash size={14} /> Currency</label>
            <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>
              USD (Cannot be changed)
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={14} /> Tax ID / NTN</label>
            <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>
              {kycData?.tax_id || 'N/A'} (Cannot be changed)
            </div>
          </div>
        </div>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />

      {/* 2. Security (Password Change) */}
      <section>
        <div className="account-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={24} color="#0284c7" /> Security Settings
          </h2>
          {!isChangingPassword ? (
            <button 
              onClick={() => setIsChangingPassword(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#f1f5f9', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
            >
              Change Password
            </button>
          ) : null}
        </div>

        {passwordMessage.text && (
          <div style={{ padding: '12px', background: passwordMessage.type === 'error' ? '#fee2e2' : passwordMessage.type === 'success' ? '#dcfce7' : '#e0f2fe', color: passwordMessage.type === 'error' ? '#991b1b' : passwordMessage.type === 'success' ? '#166534' : '#0369a1', borderRadius: '8px', marginBottom: '24px', fontWeight: 600 }}>
            {passwordMessage.text}
          </div>
        )}

        {isChangingPassword ? (
          <form onSubmit={handlePasswordChange} style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>Current Password</label>
              <input type="password" required value={passwordForm.currentPassword} onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>New Password</label>
              <input type="password" required minLength={8} value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>Confirm New Password</label>
              <input type="password" required minLength={8} value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>
            
            <div className="account-form-buttons" style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button 
                type="button"
                onClick={() => { setIsChangingPassword(false); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); setPasswordMessage({text:'', type:''}); }}
                style={{ flex: 1, padding: '10px', background: '#fff', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                style={{ flex: 1, padding: '10px', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
              >
                Update Password
              </button>
            </div>
          </form>
        ) : (
          <div style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Password last changed: Recently. Use a strong password to protect your account.
          </div>
        )}
      </section>


      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />

      {/* 3. KYC Documents */}
      <section>
        <div className="account-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={24} color="#0284c7" /> KYC Documents
          </h2>
        </div>
        
        {kycData?.documents && kycData.documents.length > 0 ? (
          <div className="account-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {kycData.documents.map((doc: any, i: number) => (
              <div key={i} style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '0.95rem' }}>{doc.doc_type}</h4>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>{doc.file_name || 'Document Uploaded'}</p>
                </div>
                <span style={{ padding: '4px 10px', background: (kycData.status === 'APPROVED' || doc.status === 'APPROVED' || doc.status === 'VERIFIED') ? '#dcfce7' : '#fef3c7', color: (kycData.status === 'APPROVED' || doc.status === 'APPROVED' || doc.status === 'VERIFIED') ? '#166534' : '#92400e', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>
                  {kycData.status === 'APPROVED' ? 'VERIFIED' : (doc.status || 'PENDING')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <AlertTriangle color="#b91c1c" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: '#991b1b', fontWeight: 700 }}>Missing Documents</h4>
              <p style={{ margin: 0, color: '#b91c1c', fontSize: '0.9rem', lineHeight: 1.5 }}>
                No KYC documents found. Please upload them as soon as possible for account verification.
              </p>
            </div>
          </div>
        )}
      </section>


      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />

      {/* 4. Payment Settings */}
      <section>
        {toastMessage && (
          <div style={{ padding: '12px', background: toastMessage.type === 'error' ? '#fee2e2' : '#dcfce7', color: toastMessage.type === 'error' ? '#991b1b' : '#166534', borderRadius: '8px', marginBottom: '24px', fontWeight: 600 }}>
            {toastMessage.message}
          </div>
        )}
        
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div className="account-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Payment Settings</h2>
                    <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '0.9rem' }}>Manage your bank accounts for international payouts.</p>
                  </div>
                  {!showBankForm && (
                    <button 
                      onClick={() => setShowBankForm(true)}
                      style={{ padding: '10px 16px', borderRadius: '8px', background: '#0f172a', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Plus size={16} /> Add Another Payment Method
                    </button>
                  )}
                </div>

                {!showBankForm && bankAccounts.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {bankAccounts.map((account) => (
                      <div className="bank-card" key={account.id} style={{ background: '#fff', borderRadius: '16px', border: account.is_primary ? '2px solid #10b981' : '1px solid #e2e8f0', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: account.is_primary ? '0 4px 12px rgba(16, 185, 129, 0.1)' : 'none' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{account.bank_name}</h3>
                            {account.is_primary && (
                              <span style={{ background: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid #a7f3d0' }}>PRIMARY</span>
                            )}
                          </div>
                          <div style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '4px' }}>{account.bank_account_holder} • {account.bank_account_number}</div>
                          <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{account.bank_country} • {account.bank_currency} • Routing: {account.bank_routing_number}</div>
                        </div>
                        {!account.is_primary && (
                          <button 
                            onClick={async () => {
                              try {
                                const res = await fetch('/api/supplier/bank-details/set-primary', {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ supplierId: user?.id, accountId: account.id })
                                });
                                if (res.ok) {
                                  setBankAccounts(prev => prev.map(a => ({ ...a, is_primary: a.id === account.id })));
                                  triggerToast('Primary Updated', 'Successfully changed your primary payout account.');
                                }
                              } catch (err) {}
                            }}
                            style={{ padding: '8px 16px', borderRadius: '8px', background: '#f8fafc', color: '#475569', fontWeight: 700, border: '1px solid #cbd5e1', cursor: 'pointer' }}
                          >
                            Set as Primary
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {showBankForm && (
                  <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px' }}>
                    <form onSubmit={async (e: any) => {
                      e.preventDefault();
                      const btn = document.getElementById('save_bank_btn');
                      if (btn) btn.innerText = 'Saving...';
                      
                      try {
                        const formData = new FormData(e.target);
                        const bankDetails = {
                          account_holder: formData.get('bank_account_name'),
                          bank_name: formData.get('bank_name'),
                          account_number: formData.get('bank_account_number'),
                          routing_number: formData.get('bank_routing'),
                          country: formData.get('bank_country'),
                          currency: formData.get('bank_currency')
                        };
                        const isPrimary = formData.get('is_primary') === 'on';

                        const res = await fetch('/api/supplier/bank-details/update', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ supplierId: user?.id, bankDetails, isPrimary })
                        });
                        if (res.ok) {
                          // Fetch latest accounts
                          const fetchRes = await fetch(`/api/supplier/bank-details?supplierId=${user?.id}`);
                          const data = await fetchRes.json();
                          setBankAccounts(data);
                          setShowBankForm(false);
                          triggerToast('Awesome!', 'Your new payment method has been added successfully.');
                        } else {
                          const data = await res.json();
                          triggerToast('Error', data.error, 'error');
                        }
                      } catch (err) {
                        triggerToast('Error', 'Network error saving bank details.', 'error');
                      }
                      if (btn) btn.innerText = 'Save Payment Settings';
                    }}>
                      <div className="account-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Account Holder Name</label>
                          <input name="bank_account_name" id="bank_account_name" type="text" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} placeholder="John Doe" required />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Bank Name</label>
                          <input name="bank_name" id="bank_name" type="text" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} placeholder="Chase Bank" required />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Account Number / IBAN</label>
                          <input name="bank_account_number" id="bank_account_number" type="text" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} placeholder="GB0000..." required />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Routing / SWIFT / BIC</label>
                          <input name="bank_routing" id="bank_routing" type="text" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} placeholder="CHASUS..." required />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Bank Country</label>
                          <select name="bank_country" id="bank_country" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#fff' }} required>
                            <option value="US">United States</option>
                            <option value="GB">United Kingdom</option>
                            <option value="EU">European Union</option>
                            <option value="AE">United Arab Emirates</option>
                            <option value="AU">Australia</option>
                            <option value="SG">Singapore</option>
                            <option value="JP">Japan</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Payout Currency</label>
                          <select name="bank_currency" id="bank_currency" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#fff' }} required>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="AED">AED (د.إ)</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <input name="is_primary" type="checkbox" id="is_primary" defaultChecked={bankAccounts.length === 0} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                        <label htmlFor="is_primary" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>Make this my primary payout method</label>
                      </div>
                      
                      <div className="account-form-buttons" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                        {bankAccounts.length > 0 && (
                          <button type="button" onClick={() => setShowBankForm(false)} style={{ padding: '12px 24px', borderRadius: '8px', background: '#fff', color: '#64748b', fontWeight: 700, border: '1px solid #cbd5e1', cursor: 'pointer' }}>
                            Cancel
                          </button>
                        )}
                        <button type="submit" id="save_bank_btn" style={{ padding: '12px 24px', borderRadius: '8px', background: '#0f172a', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                          Save Payment Settings
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            
      </section>
    </div>
  );
}
