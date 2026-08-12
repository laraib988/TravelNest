'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  UserCheck,
  MapPin,
  Phone,
  DollarSign,
  UploadCloud,
  FileCheck,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SupplierSignupPage() {
  const router = useRouter();
  const { checkUserExists, signup } = useAuth();

  // Wizard Step State (1: Basic Signup, 2: Select Solo/Company, 3: Detailed Form, 4: Success)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [partnerType, setPartnerType] = useState<'SOLO' | 'COMPANY'>('SOLO');

  // Step 1 State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Solo Fields
  const [soloLocation, setSoloLocation] = useState('');
  const [soloPhone, setSoloPhone] = useState('');
  const [soloCurrency, setSoloCurrency] = useState('USD');
  const [soloCnic, setSoloCnic] = useState('');
  const [soloNtn, setSoloNtn] = useState('');
  const [soloIdFile, setSoloIdFile] = useState<File | null>(null);

  // Company Fields
  const [companyName, setCompanyName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyReg, setCompanyReg] = useState('');
  const [companyTaxId, setCompanyTaxId] = useState('');
  const [companyRegFile, setCompanyRegFile] = useState<File | null>(null);
  const [companyInsFile, setCompanyInsFile] = useState<File | null>(null);

  // Company -> Lead Solo Operator Info
  const [leadOperatorName, setLeadOperatorName] = useState('');
  const [leadOperatorEmail, setLeadOperatorEmail] = useState('');
  const [leadOperatorPhone, setLeadOperatorPhone] = useState('');
  const [leadOperatorIdFile, setLeadOperatorIdFile] = useState<File | null>(null);
  const [companyCurrency, setCompanyCurrency] = useState('USD');

  const [loading, setLoading] = useState(false);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      const exists = await checkUserExists(email);
      if (exists) {
        setAuthError('This email is already registered. Please sign in or use a different email.');
        return;
      }
      setStep(2);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Construct documents array based on partner type
      let docs = [];
      if (partnerType === 'SOLO') {
        if (soloIdFile) docs.push({ doc_id: `doc-${Date.now()}-1`, doc_type: 'CNIC/Passport', file_name: soloIdFile.name, status: 'PENDING' });
      } else {
        if (companyRegFile) docs.push({ doc_id: `doc-${Date.now()}-2`, doc_type: 'Registration Doc', file_name: companyRegFile.name, status: 'PENDING' });
        if (companyInsFile) docs.push({ doc_id: `doc-${Date.now()}-3`, doc_type: 'Insurance Policy', file_name: companyInsFile.name, status: 'PENDING' });
        if (leadOperatorIdFile) docs.push({ doc_id: `doc-${Date.now()}-4`, doc_type: 'Lead Operator ID', file_name: leadOperatorIdFile.name, status: 'PENDING' });
      }

      // Construct KYC Data based on inputs
      const kycData = {
        partnerType,
        companyName: partnerType === 'SOLO' ? name : companyName,
        location: partnerType === 'SOLO' ? soloLocation : companyLocation,
        phone: partnerType === 'SOLO' ? soloPhone : companyPhone,
        currency: partnerType === 'SOLO' ? soloCurrency : companyCurrency,
        business_reg: partnerType === 'SOLO' ? (soloCnic || 'N/A') : (companyReg || 'N/A'),
        tax_id: partnerType === 'SOLO' ? (soloNtn || 'N/A') : (companyTaxId || 'N/A'),
        documents: docs
      };

      await signup(
        partnerType === 'SOLO' ? name : leadOperatorName,
        partnerType === 'SOLO' ? email : companyEmail || email,
        password,
        'SUPPLIER',
        kycData
      );
      setStep(4);
    } catch (err: any) {
      console.error('Signup error:', err);
      alert(`Signup Failed: ${err.message || 'Unknown error occurred.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    router.push('/supplier');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          maxWidth: step === 3 && partnerType === 'COMPANY' ? '720px' : '600px',
          width: '100%',
          padding: '40px 32px',
          position: 'relative',
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease'
        }}
      >
        {/* STEP BACK BUTTON */}
        {step > 1 && step < 4 && (
          <button
            onClick={() => setStep((s) => (s - 1) as any)}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {/* WIZARD PROGRESS BAR */}
        {step < 4 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  height: '6px',
                  width: s === step ? '36px' : '16px',
                  borderRadius: '100px',
                  background: s <= step ? 'var(--brand-primary)' : '#e2e8f0',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div className="badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <ShieldCheck size={14} /> TravelNest Partner Portal
              </div>
              <h2 style={{ fontSize: '1.75rem', color: '#0f172a', fontWeight: 800, marginBottom: '6px' }}>
                Create Your Supplier Account
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                Start listing your tours & experiences in minutes
              </p>
            </div>

            <form onSubmit={handleStep1Submit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <UserIcon size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

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
                    type="password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              {authError && (
                <div style={{ padding: '12px', borderRadius: '12px', background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} /> {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ padding: '14px', fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius-pill)', justifyContent: 'center', marginTop: '8px' }}
              >
                {loading ? 'Processing...' : 'Continue to Partner Setup'} <ArrowRight size={18} />
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link href="/supplier/login" style={{ color: 'var(--brand-primary)', fontWeight: 700, textDecoration: 'underline' }}>
                Sign In
              </Link>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <span className="badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                Step 2 of 3 • Account Type
              </span>
              <h2 style={{ fontSize: '1.75rem', color: '#0f172a', fontWeight: 800, marginBottom: '6px' }}>
                Choose Your Business Structure
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0 }}>
                Are you joining as an individual guide or a registered company?
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              <div
                onClick={() => setPartnerType('SOLO')}
                style={{ padding: '20px', borderRadius: '16px', border: partnerType === 'SOLO' ? '2px solid #0284c7' : '1.5px solid #e2e8f0', background: partnerType === 'SOLO' ? '#f0f9ff' : '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '16px', transition: 'all 0.2s' }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: partnerType === 'SOLO' ? '#0284c7' : '#f1f5f9', color: partnerType === 'SOLO' ? '#ffffff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <UserCheck size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Solo Operator / Individual Guide</div>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>For independent tour guides, local experience hosts, and solo travel creators.</p>
                </div>
              </div>

              <div
                onClick={() => setPartnerType('COMPANY')}
                style={{ padding: '20px', borderRadius: '16px', border: partnerType === 'COMPANY' ? '2px solid #0284c7' : '1.5px solid #e2e8f0', background: partnerType === 'COMPANY' ? '#f0f9ff' : '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '16px', transition: 'all 0.2s' }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: partnerType === 'COMPANY' ? '#0284c7' : '#f1f5f9', color: partnerType === 'COMPANY' ? '#ffffff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Building2 size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Registered Travel Company</div>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>For registered agencies, corporate operators, and licensed travel businesses.</p>
                </div>
              </div>
            </div>

            <button onClick={() => setStep(3)} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius-pill)', justifyContent: 'center' }}>
              Continue to {partnerType === 'SOLO' ? 'Solo Profile' : 'Company Profile'} <ArrowRight size={18} />
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span className="badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                Step 3 of 3 • {partnerType === 'SOLO' ? 'Solo Verification' : 'Company & Lead Operator Docs'}
              </span>
              <h2 style={{ fontSize: '1.65rem', color: '#0f172a', fontWeight: 800, marginBottom: '4px' }}>
                {partnerType === 'SOLO' ? 'Solo Operator Details' : 'Company & Solo Operator Details'}
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>
                Please provide your contact information and required verification documents.
              </p>
            </div>

            <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* SOLO OPERATOR */}
              {partnerType === 'SOLO' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Full Name *</label>
                      <div style={{ position: 'relative' }}>
                        <UserIcon size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" style={{ width: '100%', padding: '11px 12px 11px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Email Address *</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" style={{ width: '100%', padding: '11px 12px 11px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Location (City, Country) *</label>
                      <div style={{ position: 'relative' }}>
                        <MapPin size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="text" required value={soloLocation} onChange={(e) => setSoloLocation(e.target.value)} placeholder="e.g. Lahore, Pakistan" style={{ width: '100%', padding: '11px 12px 11px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Mobile Phone *</label>
                      <div style={{ position: 'relative' }}>
                        <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="tel" required value={soloPhone} onChange={(e) => setSoloPhone(e.target.value)} placeholder="+92 300 1234567" style={{ width: '100%', padding: '11px 12px 11px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>CNIC / Passport Number *</label>
                      <div style={{ position: 'relative' }}>
                        <ShieldCheck size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="text" required value={soloCnic} onChange={(e) => setSoloCnic(e.target.value)} placeholder="National ID Number" style={{ width: '100%', padding: '11px 12px 11px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Tax ID / NTN *</label>
                      <div style={{ position: 'relative' }}>
                        <FileCheck size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="text" required value={soloNtn} onChange={(e) => setSoloNtn(e.target.value)} placeholder="Tax Registration Number" style={{ width: '100%', padding: '11px 12px 11px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Preferred Payout Currency *</label>
                    <div style={{ position: 'relative' }}>
                      <DollarSign size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <select value={soloCurrency} onChange={(e) => setSoloCurrency(e.target.value)} style={{ width: '100%', padding: '11px 12px 11px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', background: '#fff' }}>
                        <option value="USD">USD ($) - US Dollar</option>
                        <option value="PKR">PKR (Rs) - Pakistani Rupee</option>
                        <option value="EUR">EUR (€) - Euro</option>
                        <option value="GBP">GBP (£) - British Pound</option>
                        <option value="AED">AED (AED) - UAE Dirham</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>ID Card Documents (CNIC / Passport) *</label>
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', borderRadius: '12px', border: '2px dashed #cbd5e1', background: '#f8fafc', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={(e) => setSoloIdFile(e.target.files?.[0] || null)} />
                      {soloIdFile ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: 700, fontSize: '0.88rem' }}>
                          <FileCheck size={20} /> {soloIdFile.name} (Attached)
                        </div>
                      ) : (
                        <>
                          <UploadCloud size={24} color="#0284c7" style={{ marginBottom: '6px' }} />
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Click to upload CNIC or Passport front/back</span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>JPG, PNG or PDF (Max 10MB)</span>
                        </>
                      )}
                    </label>
                  </div>
                </>
              )}

              {/* COMPANY OPERATOR */}
              {partnerType === 'COMPANY' && (
                <>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                      <Building2 size={16} /> 1. Company Information
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Company Name *</label>
                        <input type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. TravelNest Voyages" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Company Location *</label>
                        <input type="text" required value={companyLocation} onChange={(e) => setCompanyLocation(e.target.value)} placeholder="e.g. Lahore, Pakistan" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Company Email *</label>
                        <input type="email" required value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} placeholder="contact@company.com" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Company Contact Number *</label>
                        <input type="tel" required value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} placeholder="+92 42 35789000" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Company Registration # *</label>
                        <input type="text" required value={companyReg} onChange={(e) => setCompanyReg(e.target.value)} placeholder="Business Reg Number" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Corporate Tax ID / NTN *</label>
                        <input type="text" required value={companyTaxId} onChange={(e) => setCompanyTaxId(e.target.value)} placeholder="Tax Registration Number" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Company Registration Doc *</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px', borderRadius: '8px', border: '1.5px dashed #cbd5e1', background: '#fff', cursor: 'pointer' }}>
                          <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={(e) => setCompanyRegFile(e.target.files?.[0] || null)} />
                          <UploadCloud size={16} color="#0284c7" />
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: companyRegFile ? '#059669' : '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{companyRegFile ? companyRegFile.name : 'Upload Reg Certificate'}</span>
                        </label>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Company Insurance Doc *</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px', borderRadius: '8px', border: '1.5px dashed #cbd5e1', background: '#fff', cursor: 'pointer' }}>
                          <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={(e) => setCompanyInsFile(e.target.files?.[0] || null)} />
                          <UploadCloud size={16} color="#0284c7" />
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: companyInsFile ? '#059669' : '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{companyInsFile ? companyInsFile.name : 'Upload Insurance Policy'}</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                      <UserCheck size={16} /> 2. Solo Lead Representative Information
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Lead Operator Name *</label>
                        <input type="text" required value={leadOperatorName} onChange={(e) => setLeadOperatorName(e.target.value)} placeholder="Full Name" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Lead Operator Email *</label>
                        <input type="email" required value={leadOperatorEmail} onChange={(e) => setLeadOperatorEmail(e.target.value)} placeholder="Email Address" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Lead Operator Phone *</label>
                        <input type="tel" required value={leadOperatorPhone} onChange={(e) => setLeadOperatorPhone(e.target.value)} placeholder="+92 300 1234567" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Payout Currency *</label>
                        <select value={companyCurrency} onChange={(e) => setCompanyCurrency(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: '#fff' }}>
                          <option value="USD">USD ($) - US Dollar</option>
                          <option value="PKR">PKR (Rs) - Pakistani Rupee</option>
                          <option value="EUR">EUR (€) - Euro</option>
                          <option value="GBP">GBP (£) - British Pound</option>
                          <option value="AED">AED (AED) - UAE Dirham</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Lead Operator ID Card (CNIC / Passport) *</label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px', borderRadius: '8px', border: '1.5px dashed #cbd5e1', background: '#fff', cursor: 'pointer' }}>
                        <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={(e) => setLeadOperatorIdFile(e.target.files?.[0] || null)} />
                        <UploadCloud size={16} color="#7c3aed" />
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: leadOperatorIdFile ? '#059669' : '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{leadOperatorIdFile ? leadOperatorIdFile.name : 'Upload Lead CNIC / Passport'}</span>
                      </label>
                    </div>
                  </div>
                </>
              )}
              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius-pill)', justifyContent: 'center', marginTop: '8px' }}>
                {loading ? 'Submitting Application...' : 'Complete Registration & Submit Verification'} <ArrowRight size={18} />
              </button>
            </form>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '2px solid #a7f3d0' }}>
              <CheckCircle2 size={36} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Verification Submitted!</h2>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Thank you, <strong style={{ color: '#0f172a' }}>{partnerType === 'SOLO' ? name : leadOperatorName}</strong>. Your {partnerType === 'SOLO' ? 'Solo Operator' : 'Company Partner'} application and verification documents have been received.
            </p>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'left', marginBottom: '28px', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Application Summary:</div>
              <div style={{ color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>• Type: <span style={{ fontWeight: 700, color: '#0284c7' }}>{partnerType === 'SOLO' ? 'Solo Operator' : `Company (${companyName || 'Registered Agency'})`}</span></div>
                <div>• Email: <span style={{ fontWeight: 600, color: '#334155' }}>{partnerType === 'SOLO' ? email : companyEmail || email}</span></div>
                <div>• Payout Currency: <span style={{ fontWeight: 600, color: '#334155' }}>{partnerType === 'SOLO' ? soloCurrency : companyCurrency}</span></div>
                <div>• Review SLA: <span style={{ fontWeight: 700, color: '#059669' }}>Within 24 Hours</span></div>
              </div>
            </div>
            <button onClick={handleFinish} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius-pill)', justifyContent: 'center' }}>
              Go to Supplier Dashboard <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
