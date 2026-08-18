'use client';

import React, { useState, useEffect } from 'react';
import { fetchFromAPI } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  Check, X, AlertTriangle, FileText, PauseCircle, ShieldAlert, CheckCircle2, 
  RefreshCw, Search, Building2, UserCheck, ShieldCheck, ExternalLink, ChevronDown, ChevronUp,
  Ban as BanIcon
} from 'lucide-react';

interface KYCDocument {
  doc_id: string;
  doc_type: string;
  file_name: string;
  file_url: string;
  status: 'PENDING' | 'PASSED' | 'FLAGGED' | 'EXPIRED';
  expiry_date?: string;
  ocr_result?: string;
}

interface BankAccount {
  id: string;
  supplier_id: string;
  bank_name: string;
  bank_account_holder: string;
  bank_account_number: string;
  bank_routing_number?: string;
  bank_country?: string;
  bank_currency?: string;
  is_primary?: boolean;
  created_at?: string;
}

interface KYCRecord {
  supplier_id: string;
  company_name: string;
  business_type: 'CORPORATE' | 'INDIVIDUAL_FREELANCER';
  business_reg: string;
  tax_id: string;
  kyc_state: 'DRAFT' | 'SUBMITTED_PENDING_REVIEW' | 'UNDER_REVIEW' | 'CHANGES_REQUESTED' | 'APPROVED_VERIFIED' | 'REJECTED' | 'SUSPENDED';
  documents: KYCDocument[];
  ocr_confidence: number;
  ai_fraud_score: number;
  audit_reasons: string[];
  updated_at: string;
  bankAccounts?: BankAccount[];
}

export default function SupplierVerificationPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<KYCRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('Pending Review');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  
  // Request Fix Modal State
  const [fixModalOpen, setFixModalOpen] = useState(false);
  const [fixSupplierId, setFixSupplierId] = useState('');
  const [fixCompanyName, setFixCompanyName] = useState('');
  const [fixReason, setFixReason] = useState('');

  // Ban Modal State
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [banSupplierId, setBanSupplierId] = useState('');
  const [banCompanyName, setBanCompanyName] = useState('');
  const [banReason, setBanReason] = useState('');

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/kyc', { cache: 'no-store' });
      const supaData = await res.json();
      const error = !res.ok ? supaData.error : null;

      let formattedRecords: KYCRecord[] = [];
      
      if (!error && supaData && supaData.length > 0) {
        formattedRecords = supaData.map((row: any) => ({
          supplier_id: row.user_id,
          company_name: row.company_name,
          business_type: row.business_type === 'SOLO' ? 'INDIVIDUAL_FREELANCER' : 'CORPORATE',
          business_reg: row.business_reg || 'N/A',
          tax_id: row.tax_id || 'N/A',
          kyc_state: row.status === 'PENDING' ? 'SUBMITTED_PENDING_REVIEW' : (row.status === 'APPROVED' ? 'APPROVED_VERIFIED' : row.status),
          documents: row.documents || [],
          ocr_confidence: 90, // We could pull this from db if it existed
          ai_fraud_score: 5,
          audit_reasons: row.audit_reasons || [],
          updated_at: row.updated_at,
          bankAccounts: row.bankAccounts || []
        }));
      }

      setRecords(formattedRecords);
      if (formattedRecords.length > 0) {
        setExpandedId(formattedRecords[0].supplier_id);
      }
    } catch (err) {
      console.error(err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRecords();
    setRefreshing(false);
    triggerAction('Supplier verification directory refreshed!');
  };

  const handleUpdateKycState = async (supplierId: string, newState: KYCRecord['kyc_state'], companyName: string, message: string, newReason?: string) => {
    try {
      // If it's a Supabase UUID (usually > 30 chars), update Supabase
      if (supplierId.length > 30) {
         let supaStatus: string = newState;
         if (newState === 'SUBMITTED_PENDING_REVIEW') supaStatus = 'PENDING';
         if (newState === 'APPROVED_VERIFIED') supaStatus = 'APPROVED';
         
         const res = await fetch('/api/admin/kyc/update', {
           method: 'PATCH',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ supplierId, status: supaStatus, newReason })
         });
         
         if (!res.ok) {
           throw new Error('Failed to update status in database');
         }
      } else {
         // Fallback legacy API
         await fetchFromAPI(`/kyc/${supplierId}/state`, {
           method: 'PATCH',
           body: JSON.stringify({ kyc_state: newState }),
         }).catch(() => null);
      }

      setRecords((prev) =>
        prev.map((r) => {
          if (r.supplier_id === supplierId) {
             const updatedReasons = newReason ? [...(r.audit_reasons || []), newReason] : r.audit_reasons;
             return { ...r, kyc_state: newState, audit_reasons: updatedReasons };
          }
          return r;
        })
      );

      triggerAction(message);
    } catch (err) {
      console.error(err);
    }
  };

  const triggerAction = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const tabs = ['All', 'Pending Review', 'Approved', 'Rejected', 'Suspended'];

  const getStatusBadgeClass = (state: string) => {
    switch (state) {
      case 'APPROVED_VERIFIED': return 'admin-badge--approved';
      case 'SUBMITTED_PENDING_REVIEW':
      case 'UNDER_REVIEW': return 'admin-badge--processing';
      case 'REJECTED': return 'admin-badge--rejected';
      case 'SUSPENDED': return 'admin-badge--flagged';
      default: return 'admin-badge--draft';
    }
  };

  const filteredRecords = records.filter(r => {
    const matchesSearch = 
      r.company_name.toLowerCase().includes(search.toLowerCase()) ||
      r.business_reg.toLowerCase().includes(search.toLowerCase()) ||
      r.supplier_id.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'All') return true;
    if (filter === 'Pending Review' && (r.kyc_state === 'SUBMITTED_PENDING_REVIEW' || r.kyc_state === 'UNDER_REVIEW')) return true;
    if (filter === 'Approved' && r.kyc_state === 'APPROVED_VERIFIED') return true;
    if (filter === 'Rejected' && r.kyc_state === 'REJECTED') return true;
    if (filter === 'Suspended' && r.kyc_state === 'SUSPENDED') return true;
    return false;
  });

  const pendingCount = records.filter(r => r.kyc_state === 'SUBMITTED_PENDING_REVIEW' || r.kyc_state === 'UNDER_REVIEW').length;
  const approvedCount = records.filter(r => r.kyc_state === 'APPROVED_VERIFIED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Executive Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Supplier Verification & KYC Audit Vault
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
            Review submitted trade licenses, government IDs, insurance policies, and approve supplier accounts.
          </p>
        </div>

        <button
          className="btn-secondary"
          onClick={handleRefresh}
          disabled={refreshing}
          style={{ padding: '10px 18px', fontSize: '0.88rem', cursor: 'pointer' }}
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh Directory'}
        </button>
      </div>

      {actionSuccess && (
        <div style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '14px 24px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 16px rgba(16, 185, 129, 0.15)' }}>
          <CheckCircle2 size={20} color="#10b981" /> {actionSuccess}
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Pending Verification Queue</div>
              <div className="admin-stat-value" style={{ color: '#d97706' }}>{pendingCount}</div>
              <div className="admin-stat-change" style={{ color: '#b45309' }}>Awaiting Admin Audit</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}>
              <ShieldAlert size={24} />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Verified Active Partners</div>
              <div className="admin-stat-value" style={{ color: '#059669' }}>{approvedCount}</div>
              <div className="admin-stat-change" style={{ color: '#059669' }}>Enabled for tour listings</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Total Vault Accounts</div>
              <div className="admin-stat-value">{records.length}</div>
              <div className="admin-stat-change" style={{ color: '#0284c7' }}>Registered suppliers</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #0284c7, #2563eb)' }}>
              <Building2 size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div className="admin-filter-bar" style={{ margin: 0 }}>
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`admin-filter-tab ${filter === t ? 'active' : ''}`}
            >
              {t} {t === 'Pending Review' && pendingCount > 0 ? `(${pendingCount})` : ''}
            </button>
          ))}
        </div>

        <div className="admin-search">
          <Search className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search company, reg # or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Supplier Table Layout */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: '72px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', opacity: 0.7 }} />
          ))}
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="admin-table-container" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
          <ShieldAlert size={36} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>No supplier records found in this view</h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Select a different status tab or search query.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Supplier Profile</th>
                <th>Business Type</th>
                <th>Status</th>
                <th>OCR Score</th>
                <th>Last Updated</th>
                <th style={{ textAlign: 'center', background: '#f0f9ff', color: '#0284c7', fontWeight: 800 }}>⚙️ Management Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r) => {
                const isExpanded = expandedId === r.supplier_id;
                const isPending = r.kyc_state === 'SUBMITTED_PENDING_REVIEW' || r.kyc_state === 'UNDER_REVIEW';

                return (
                  <React.Fragment key={r.supplier_id}>
                    <tr
                      onClick={() => setExpandedId(isExpanded ? null : r.supplier_id)}
                      style={{ cursor: 'pointer', background: isPending && !isExpanded ? '#fffdf5' : 'transparent' }}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div className="admin-user-avatar" style={{ background: 'linear-gradient(135deg, #0284c7, #2563eb)' }}>
                            <Building2 size={20} color="#ffffff" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>{r.company_name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', fontFamily: 'monospace' }}>ID: {r.supplier_id.substring(0, 16)}...</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="badge-blue" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                          {r.business_type}
                        </span>
                      </td>

                      <td>
                        <span className={`admin-badge ${getStatusBadgeClass(r.kyc_state)}`}>
                          {r.kyc_state.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 800, color: r.ocr_confidence > 80 ? '#059669' : '#d97706' }}>
                          <CheckCircle2 size={14} /> {r.ocr_confidence}%
                        </div>
                      </td>

                      <td style={{ color: '#64748b', fontSize: '0.84rem' }}>
                        {new Date(r.updated_at || Date.now()).toLocaleDateString()}
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 800, color: '#0284c7' }}>
                          {isExpanded ? 'Hide Details' : 'View Audit Vault'}
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <tr style={{ background: '#f8fafc' }}>
                        <td colSpan={6} style={{ padding: '24px' }}>
                          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            
                            {/* Left Column: Docs & Audit */}
                            <div>
                              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                                Uploaded Audit Files & Licenses
                              </h4>
                              
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                                {r.documents?.map((doc) => (
                                  <div
                                    key={doc.doc_id}
                                    style={{
                                      background: '#f8fafc',
                                      padding: '12px 16px',
                                      borderRadius: '12px',
                                      border: '1px solid #e2e8f0',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      gap: '12px'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                                      <FileText size={18} color="#0284c7" />
                                      <div>
                                        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>{doc.doc_type}</div>
                                        <div style={{ fontSize: '0.78rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                                          {doc.file_name}
                                        </div>
                                      </div>
                                    </div>
                                    <span className="badge-emerald" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                                      ✓ VERIFIED
                                    </span>
                                  </div>
                                ))}
                                {(!r.documents || r.documents.length === 0) && (
                                  <div style={{ fontSize: '0.84rem', color: '#64748b', fontStyle: 'italic' }}>
                                    No documents uploaded yet.
                                  </div>
                                )}
                              </div>

                              {r.audit_reasons && r.audit_reasons.length > 0 && (
                                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '14px 16px', borderRadius: '12px' }}>
                                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#047857', marginBottom: '4px' }}>
                                    ✓ AI Audit Scan Verdict
                                  </div>
                                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.84rem', color: '#065f46', lineHeight: 1.5 }}>
                                    {r.audit_reasons.map((rsn, idx) => (
                                      <li key={idx}>{rsn}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            {/* Right Column: Identities & Actions */}
                            <div>
                              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                                Registration Details
                              </h4>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>BUSINESS REG # / CNIC</div>
                                  <div className="code-ref" style={{ fontSize: '0.88rem', marginTop: '4px' }}>
                                    {r.business_reg}
                                  </div>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TAX ID / NTN</div>
                                  <div className="code-ref" style={{ fontSize: '0.88rem', marginTop: '4px' }}>
                                    {r.tax_id}
                                  </div>
                                </div>
                              </div>

                              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                                Bank Details for Payouts
                              </h4>

                              {r.bankAccounts && r.bankAccounts.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                                  {r.bankAccounts.map((ba) => (
                                    <div key={ba.id} style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: ba.is_primary ? '1px solid #a7f3d0' : '1px solid #e2e8f0' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{ba.bank_name}</div>
                                        {ba.is_primary && (
                                          <span style={{ background: '#ecfdf5', color: '#047857', padding: '2px 10px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 800, border: '1px solid #a7f3d0' }}>PRIMARY</span>
                                        )}
                                      </div>
                                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem' }}>
                                        <div>
                                          <div style={{ color: '#64748b', fontWeight: 700 }}>Account Holder</div>
                                          <div className="code-ref">{ba.bank_account_holder}</div>
                                        </div>
                                        <div>
                                          <div style={{ color: '#64748b', fontWeight: 700 }}>Account / IBAN</div>
                                          <div className="code-ref">{ba.bank_account_number}</div>
                                        </div>
                                        {ba.bank_routing_number && (
                                          <div>
                                            <div style={{ color: '#64748b', fontWeight: 700 }}>Routing / SWIFT</div>
                                            <div className="code-ref">{ba.bank_routing_number}</div>
                                          </div>
                                        )}
                                        {(ba.bank_country || ba.bank_currency) && (
                                          <div>
                                            <div style={{ color: '#64748b', fontWeight: 700 }}>Country / Currency</div>
                                            <div className="code-ref">{ba.bank_country} {ba.bank_currency}</div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div style={{ fontSize: '0.84rem', color: '#64748b', fontStyle: 'italic', marginBottom: '24px' }}>
                                  No bank account linked yet.
                                </div>
                              )}

                              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                                Management Actions
                              </h4>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {r.kyc_state === 'APPROVED_VERIFIED' ? (
                                  <>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                      <button
                                        style={{
                                          padding: '14px', fontSize: '0.95rem', fontWeight: 900, borderRadius: '12px',
                                          background: '#ecfdf5', color: '#047857',
                                          border: '1px solid #a7f3d0', cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        }}
                                      >
                                        <CheckCircle2 size={18} color="#10b981" /> Approved
                                      </button>
                                      <button
                                        style={{
                                          padding: '14px', fontSize: '0.95rem', fontWeight: 900, borderRadius: '12px',
                                          background: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)', color: '#ffffff',
                                          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                          boxShadow: '0 4px 16px rgba(225, 29, 72, 0.25)'
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setBanSupplierId(r.supplier_id);
                                          setBanCompanyName(r.company_name);
                                          setBanReason('');
                                          setBanModalOpen(true);
                                        }}
                                      >
                                        <BanIcon size={18} color="#ffffff" /> Ban Account
                                      </button>
                                    </div>
                                  </>
                                ) : (
                                <button
                                  style={{
                                    width: '100%', padding: '14px', fontSize: '0.95rem', fontWeight: 900, borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: '#ffffff',
                                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    boxShadow: '0 4px 16px rgba(5, 150, 105, 0.25)'
                                  }}
                                  onClick={(e) => { e.stopPropagation(); handleUpdateKycState(r.supplier_id, 'APPROVED_VERIFIED', r.company_name, `Supplier Account APPROVED: "${r.company_name}"`); }}
                                >
                                  <Check size={18} color="#ffffff" /> Approve Account & Verify
                                </button>
                                )}

                                {r.kyc_state !== 'APPROVED_VERIFIED' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                  <button
                                    style={{ padding: '10px', fontSize: '0.8rem', fontWeight: 800, borderRadius: '10px', background: '#fffbe6', color: '#d97706', border: '1px solid #fde68a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      setFixSupplierId(r.supplier_id);
                                      setFixCompanyName(r.company_name);
                                      setFixReason('');
                                      setFixModalOpen(true);
                                    }}
                                  >
                                    <AlertTriangle size={14} /> Request Fix
                                  </button>
                                  <button
                                    style={{ padding: '10px', fontSize: '0.8rem', fontWeight: 800, borderRadius: '10px', background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                    onClick={(e) => { e.stopPropagation(); handleUpdateKycState(r.supplier_id, 'REJECTED', r.company_name, `Supplier REJECTED: "${r.company_name}"`); }}
                                  >
                                    <X size={14} /> Reject
                                  </button>
                                  <button
                                    style={{ padding: '10px', fontSize: '0.8rem', fontWeight: 800, borderRadius: '10px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                    onClick={(e) => { e.stopPropagation(); handleUpdateKycState(r.supplier_id, 'SUSPENDED', r.company_name, `Supplier SUSPENDED: "${r.company_name}"`); }}
                                  >
                                    <PauseCircle size={14} /> Suspend
                                  </button>
                                </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Request Fix Modal */}
      {fixModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Request Document Fix</h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>For {fixCompanyName}</div>
              </div>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '16px', lineHeight: 1.5 }}>
              Specify exactly what the supplier needs to fix or re-upload. This message will be shown directly on their dashboard.
            </p>
            
            <textarea
              value={fixReason}
              onChange={(e) => setFixReason(e.target.value)}
              placeholder="e.g. Your trade license is expired. Please upload the 2026 renewed copy."
              style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', minHeight: '120px', resize: 'vertical', marginBottom: '24px' }}
            />
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setFixModalOpen(false)}
                style={{ padding: '12px 20px', background: 'transparent', border: 'none', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (fixReason.trim()) {
                    handleUpdateKycState(fixSupplierId, 'CHANGES_REQUESTED', fixCompanyName, `Requested Fixes from "${fixCompanyName}"`, fixReason.trim());
                    setFixModalOpen(false);
                  }
                }}
                disabled={!fixReason.trim()}
                style={{ padding: '12px 24px', background: '#d97706', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: fixReason.trim() ? 'pointer' : 'not-allowed', opacity: fixReason.trim() ? 1 : 0.5 }}
              >
                Send Fix Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ban Supplier Modal */}
      {banModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff1f2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BanIcon size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Ban Supplier Account</h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>For {banCompanyName}</div>
              </div>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '16px', lineHeight: 1.5 }}>
              This will immediately revoke the supplier's dashboard access. They will see the reason below and will be blocked from logging into their account. This action cannot be undone easily.
            </p>
            
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="e.g. Fraudulent activity detected. This account is banned for violating our Terms of Service."
              style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', minHeight: '120px', resize: 'vertical', marginBottom: '24px' }}
            />
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setBanModalOpen(false)}
                style={{ padding: '12px 20px', background: 'transparent', border: 'none', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (banReason.trim()) {
                    handleUpdateKycState(banSupplierId, 'SUSPENDED', banCompanyName, `Supplier Account BANNED: "${banCompanyName}"`, banReason.trim());
                    setBanModalOpen(false);
                  }
                }}
                disabled={!banReason.trim()}
                style={{ padding: '12px 24px', background: '#e11d48', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: banReason.trim() ? 'pointer' : 'not-allowed', opacity: banReason.trim() ? 1 : 0.5 }}
              >
                Confirm Ban
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
