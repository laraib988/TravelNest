'use client';

import { useState } from 'react';
import { fetchFromAPI } from '@/lib/api-client';
import { ShieldCheck, FileText, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw, Upload, Lock, Building, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function KYCUploadPage() {
  const supplierId = 'sup-oceanic-tours';
  const [businessType, setBusinessType] = useState<'CORPORATE' | 'INDIVIDUAL_FREELANCER'>('CORPORATE');
  
  const [formDataCorporate, setFormDataCorporate] = useState({
    company_name: 'Oceanic Horizon Voyages Ltd',
    business_reg: 'ID-REG-2022-99182',
    tax_id: 'TAX-881920-ID',
    trade_license_doc: 'trade_license_bali_2026.pdf',
    tax_cert_doc: 'vat_registration_cert.pdf',
    insurance_doc: 'marine_liability_policy_2026.pdf',
    signatory_id_doc: 'director_passport_scan.pdf',
  });

  const [formDataIndividual, setFormDataIndividual] = useState({
    company_name: 'Captain Budi Santoso (Individual Skipper)',
    business_reg: 'GUIDE-LIC-77491-ID',
    tax_id: 'IND-TAX-441092-ID',
    trade_license_doc: 'maritime_skipper_permit.pdf',
    tax_cert_doc: 'individual_tax_return_2025.pdf',
    insurance_doc: 'personal_liability_insurance.pdf',
    signatory_id_doc: 'budi_santoso_national_id.pdf',
  });

  const [submitting, setSubmitting] = useState(false);
  const [kycResult, setKycResult] = useState<any>(null);

  const activeFormData = businessType === 'CORPORATE' ? formDataCorporate : formDataIndividual;

  const handleInputChange = (field: string, value: string) => {
    if (businessType === 'CORPORATE') {
      setFormDataCorporate({ ...formDataCorporate, [field]: value });
    } else {
      setFormDataIndividual({ ...formDataIndividual, [field]: value });
    }
  };

  const handleSubmitKYC = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setKycResult(null);
    try {
      const res = await fetchFromAPI('/kyc/submit', {
        method: 'POST',
        body: JSON.stringify({
          supplier_id: supplierId,
          business_type: businessType,
          ...activeFormData,
        }),
      });
      setKycResult(res);
    } catch (err: any) {
      alert('KYC submission failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 24px', background: '#ffffff' }}>
      <Link href="/supplier" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Return to Supplier Dashboard
      </Link>

      <div className="card-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '40px', background: '#ffffff', border: '1px solid #cbd5e1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--brand-gradient)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <ShieldCheck size={32} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.85rem', color: '#0f172a' }}>Supplier KYC Verification & OCR Scanner (SRS 4.2)</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Select entity type to load specific document verification rules. AI Pre-Screening processes instant validation.
            </p>
          </div>
        </div>

        {/* DYNAMIC BUSINESS TYPE TOGGLE BUTTONS */}
        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: '#0f172a', fontWeight: 700 }}>
          Select Supplier Entity Type
        </label>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
          <button
            type="button"
            onClick={() => setBusinessType('CORPORATE')}
            className={`btn-secondary ${businessType === 'CORPORATE' ? 'active' : ''}`}
            style={{
              flex: 1,
              justify: 'center',
              padding: '14px 18px',
              background: businessType === 'CORPORATE' ? '#f0f9ff' : '#f8fafc',
              border: businessType === 'CORPORATE' ? '2px solid var(--brand-primary)' : '1px solid #cbd5e1',
              color: businessType === 'CORPORATE' ? 'var(--brand-primary)' : '#475569',
              fontWeight: 700,
            }}
          >
            <Building size={18} /> 🏢 Registered Corporate Company
          </button>

          <button
            type="button"
            onClick={() => setBusinessType('INDIVIDUAL_FREELANCER')}
            className={`btn-secondary ${businessType === 'INDIVIDUAL_FREELANCER' ? 'active' : ''}`}
            style={{
              flex: 1,
              justify: 'center',
              padding: '14px 18px',
              background: businessType === 'INDIVIDUAL_FREELANCER' ? '#f0f9ff' : '#f8fafc',
              border: businessType === 'INDIVIDUAL_FREELANCER' ? '2px solid var(--brand-primary)' : '1px solid #cbd5e1',
              color: businessType === 'INDIVIDUAL_FREELANCER' ? 'var(--brand-primary)' : '#475569',
              fontWeight: 700,
            }}
          >
            <UserCheck size={18} /> 👤 Individual License Holder / Guide
          </button>
        </div>

        {/* DYNAMIC ENTITY BADGE INDICATOR */}
        <div style={{ padding: '10px 16px', background: '#f0f9ff', border: '1px solid #7dd3fc', borderRadius: 'var(--radius-sm)', marginBottom: '24px', fontSize: '0.88rem', color: '#0369a1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={16} /> Active Verification Profile: <strong>{businessType === 'CORPORATE' ? 'Corporate Business License Suite' : 'Individual Freelance Guide / Skipper Permit Suite'}</strong>
        </div>

        <form onSubmit={handleSubmitKYC} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: '#0f172a', fontWeight: 700 }}>
              {businessType === 'CORPORATE' ? 'Legal Business / Corporate Entity Name' : 'Full Legal Name of Individual / Guide'}
            </label>
            <input
              type="text"
              required
              value={activeFormData.company_name}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: '#0f172a', fontWeight: 700 }}>
                {businessType === 'CORPORATE' ? 'Corporate Trade License Registration No' : 'Tour Guide / Skipper Permit License No'}
              </label>
              <input
                type="text"
                required
                value={activeFormData.business_reg}
                onChange={(e) => handleInputChange('business_reg', e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: '#0f172a', fontWeight: 700 }}>
                {businessType === 'CORPORATE' ? 'Government VAT / GST Tax Identification No' : 'Personal National Tax Identification No'}
              </label>
              <input
                type="text"
                required
                value={activeFormData.tax_id}
                onChange={(e) => handleInputChange('tax_id', e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', outline: 'none' }}
              />
            </div>
          </div>

          {/* DYNAMIC DOCUMENT CHECKLIST DEPENDING ON BUSINESS TYPE */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--brand-primary)" /> Required Verification Documents ({businessType === 'CORPORATE' ? 'Corporate Set' : 'Individual Set'})
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 600 }}>
                  {businessType === 'CORPORATE' ? '1. Corporate Trade License Certificate' : '1. Official Tour Guide / Skipper Permit'}
                </label>
                <input
                  type="text"
                  value={activeFormData.trade_license_doc}
                  onChange={(e) => handleInputChange('trade_license_doc', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 600 }}>
                  {businessType === 'CORPORATE' ? '2. Corporate Tax / VAT Registration Document' : '2. Individual Tax Return Document'}
                </label>
                <input
                  type="text"
                  value={activeFormData.tax_cert_doc}
                  onChange={(e) => handleInputChange('tax_cert_doc', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 600 }}>
                  {businessType === 'CORPORATE' ? '3. Public Liability Marine Insurance Policy' : '3. Individual Professional Liability Insurance'}
                </label>
                <input
                  type="text"
                  value={activeFormData.insurance_doc}
                  onChange={(e) => handleInputChange('insurance_doc', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 600 }}>
                  {businessType === 'CORPORATE' ? '4. Director Passport / Signatory Govt ID' : '4. Personal National Identity Card / Passport Scan'}
                </label>
                <input
                  type="text"
                  value={activeFormData.signatory_id_doc}
                  onChange={(e) => handleInputChange('signatory_id_doc', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a' }}
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary" style={{ padding: '14px', justifyContent: 'center', fontSize: '1.05rem', marginTop: '10px' }}>
            {submitting ? <><RefreshCw size={18} className="animate-spin" /> Running AI OCR Prescreen & State Transition...</> : <><FileText size={18} /> Submit {businessType === 'CORPORATE' ? 'Corporate' : 'Individual'} Verification Documents</>}
          </button>
        </form>

        {/* RESULT DISPLAYER WITH DYNAMIC AUDIT TRAIL */}
        {kycResult && (
          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#0f172a' }}>AI Prescreening & State Machine Result</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Entity Type: <strong>{kycResult.business_type}</strong></span>
              </div>
              <span className={kycResult.kyc_state === 'APPROVED_VERIFIED' ? 'badge-emerald' : 'badge-amber'}>
                FINITE STATE: {kycResult.kyc_state}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>OCR Checksum Match:</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#059669' }}>{Math.round(kycResult.ocr_confidence * 100)}%</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>AI Fraud Risk Score:</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: kycResult.ai_fraud_score < 25 ? '#059669' : '#d97706' }}>
                  {kycResult.ai_fraud_score} / 100
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Verification Audit Trail:</span>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {kycResult.audit_reasons?.map((r: string, i: number) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                    <CheckCircle2 size={14} color="#059669" /> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
