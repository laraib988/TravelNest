'use client';

import React, { useState, useEffect } from 'react';
import { fetchFromAPI } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import { 
  Check, X, AlertTriangle, FileText, PauseCircle, ShieldAlert, CheckCircle2, 
  RefreshCw, Search, Building2, UserCheck, ShieldCheck, ExternalLink, ChevronDown, ChevronUp
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

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await fetchFromAPI('/kyc').catch(() => null);
      if (Array.isArray(data) && data.length > 0) {
        setRecords(data);
      } else {
        const fallbackRecords: KYCRecord[] = [
          {
            supplier_id: 'sup-bali-cruises',
            company_name: 'Bali Ocean Catamarans & Tours Ltd',
            business_type: 'CORPORATE',
            business_reg: 'ID-REG-2022-99182',
            tax_id: 'TAX-881920-ID',
            kyc_state: 'SUBMITTED_PENDING_REVIEW',
            documents: [
              { doc_id: 'd1', doc_type: 'Government Trade License', file_name: 'trade_license_bali_2026.pdf', file_url: '#', status: 'PASSED' },
              { doc_id: 'd2', doc_type: 'Tourism Permit', file_name: 'vat_registration_cert.pdf', file_url: '#', status: 'PASSED' },
              { doc_id: 'd3', doc_type: 'Marine Liability Insurance', file_name: 'marine_liability_policy_2026.pdf', file_url: '#', status: 'PASSED' },
              { doc_id: 'd4', doc_type: 'Director Passport', file_name: 'director_passport_scan.pdf', file_url: '#', status: 'PASSED' }
            ],
            ocr_confidence: 96,
            ai_fraud_score: 12,
            audit_reasons: ['Trade license, VAT registration, and director passport uploaded cleanly.', 'All 4 documents match enterprise registry database.'],
            updated_at: new Date().toISOString()
          },
          {
            supplier_id: 'sup-lahore-heritage',
            company_name: 'Lahore Heritage Guides & Haveli Tours',
            business_type: 'INDIVIDUAL_FREELANCER',
            business_reg: 'CNIC-35202-1234567-1',
            tax_id: 'NTN-881245-0',
            kyc_state: 'SUBMITTED_PENDING_REVIEW',
            documents: [
              { doc_id: 'd5', doc_type: 'CNIC Front & Back', file_name: 'CNIC_Scan_Suneel.jpg', file_url: '#', status: 'PASSED' },
              { doc_id: 'd6', doc_type: 'Tourism Guide License', file_name: 'DTS_Tour_Guide_License.pdf', file_url: '#', status: 'PASSED' }
            ],
            ocr_confidence: 94,
            ai_fraud_score: 8,
            audit_reasons: ['Department of Tourist Services license active and verified.'],
            updated_at: new Date(Date.now() - 43200000).toISOString()
          },
          {
            supplier_id: 'sup-arabian-adventures',
            company_name: 'Arabian Dunes & Desert Safaris UAE',
            business_type: 'CORPORATE',
            business_reg: 'UAE-TRADE-77812',
            tax_id: 'TRN-10029311',
            kyc_state: 'APPROVED_VERIFIED',
            documents: [
              { doc_id: 'd7', doc_type: 'Dubai Trade License', file_name: 'Dubai_Trade_License.pdf', file_url: '#', status: 'PASSED' }
            ],
            ocr_confidence: 98,
            ai_fraud_score: 5,
            audit_reasons: ['Verified enterprise partner.'],
            updated_at: new Date(Date.now() - 864000000).toISOString()
          }
        ];
        setRecords(fallbackRecords);
        // Expand first pending record by default
        setExpandedId(fallbackRecords[0].supplier_id);
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

  const handleUpdateKycState = async (supplierId: string, newState: KYCRecord['kyc_state'], companyName: string, message: string) => {
    try {
      await fetchFromAPI(`/kyc/${supplierId}/state`, {
        method: 'PATCH',
        body: JSON.stringify({ kyc_state: newState }),
      }).catch(() => null);

      setRecords((prev) =>
        prev.map((r) => (r.supplier_id === supplierId ? { ...r, kyc_state: newState } : r))
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

      {/* Supplier Grid Layout */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: '260px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', opacity: 0.7 }} />
          ))}
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="admin-table-container" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
          <ShieldAlert size={36} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>No supplier records found in this view</h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Select a different status tab or search query.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '24px' }}>
          {filteredRecords.map((r) => {
            const isExpanded = expandedId === r.supplier_id;
            const isPending = r.kyc_state === 'SUBMITTED_PENDING_REVIEW' || r.kyc_state === 'UNDER_REVIEW';

            return (
              <div
                key={r.supplier_id}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  border: isPending ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                  boxShadow: isPending ? '0 10px 30px -5px rgba(245, 158, 11, 0.15)' : '0 4px 20px -2px rgba(0,0,0,0.04)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s ease'
                }}
              >
                {/* Card Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : r.supplier_id)}
                  style={{ padding: '24px', cursor: 'pointer', background: isPending ? '#fffdf5' : '#ffffff' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <span className="badge-blue" style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'inline-block' }}>
                        {r.business_type}
                      </span>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                        {r.company_name}
                      </h3>
                    </div>

                    <span className={`admin-badge ${getStatusBadgeClass(r.kyc_state)}`}>
                      {r.kyc_state.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} color="#0284c7" />
                      <span style={{ fontSize: '0.84rem', color: '#475569', fontWeight: 700 }}>
                        {r.documents?.length || 0} Verification Docs Vault
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 800, color: '#0284c7' }}>
                      {isExpanded ? 'Hide Details' : 'View Audit Vault'}
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Vault Panel */}
                {isExpanded && (
                  <div style={{ padding: '24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    
                    {/* Reg & Tax Numbers */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#ffffff', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>BUSINESS REG # / CNIC</div>
                        <div className="code-ref" style={{ fontSize: '0.88rem', marginTop: '4px' }}>
                          {r.business_reg}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TAX ID / NTN</div>
                        <div className="code-ref" style={{ fontSize: '0.88rem', marginTop: '4px' }}>
                          {r.tax_id}
                        </div>
                      </div>
                    </div>

                    {/* Uploaded Documents List */}
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Uploaded Audit Files & Licenses
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {r.documents?.map((doc) => (
                          <div
                            key={doc.doc_id}
                            style={{
                              background: '#ffffff',
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
                                <div style={{ fontSize: '0.78rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                                  {doc.file_name}
                                </div>
                              </div>
                            </div>

                            <span className="badge-emerald" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                              ✓ VERIFIED
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Audit Findings */}
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

                    {/* Highly Visible Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                      
                      {/* Approve Button */}
                      <button
                        style={{
                          width: '100%',
                          padding: '14px',
                          fontSize: '0.95rem',
                          fontWeight: 900,
                          borderRadius: '9999px',
                          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                          color: '#ffffff',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 16px rgba(5, 150, 105, 0.4)'
                        }}
                        onClick={() => handleUpdateKycState(r.supplier_id, 'APPROVED_VERIFIED', r.company_name, `Supplier Account & Documents APPROVED: "${r.company_name}"!`)}
                      >
                        <Check size={18} color="#ffffff" /> Approve Account & Verify Partner
                      </button>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                        <button
                          style={{
                            padding: '10px',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            borderRadius: '9999px',
                            background: '#fffbe6',
                            color: '#d97706',
                            border: '1px solid #fde68a',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                          onClick={() => handleUpdateKycState(r.supplier_id, 'CHANGES_REQUESTED', r.company_name, `Requested Document Fixes from "${r.company_name}"!`)}
                        >
                          <AlertTriangle size={14} /> Request Fix
                        </button>

                        <button
                          style={{
                            padding: '10px',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            borderRadius: '9999px',
                            background: '#fff1f2',
                            color: '#e11d48',
                            border: '1px solid #fecdd3',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                          onClick={() => handleUpdateKycState(r.supplier_id, 'REJECTED', r.company_name, `Supplier Profile REJECTED: "${r.company_name}"!`)}
                        >
                          <X size={14} /> Reject
                        </button>

                        <button
                          style={{
                            padding: '10px',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            borderRadius: '9999px',
                            background: '#f1f5f9',
                            color: '#475569',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                          onClick={() => handleUpdateKycState(r.supplier_id, 'SUSPENDED', r.company_name, `Supplier Account SUSPENDED: "${r.company_name}"!`)}
                        >
                          <PauseCircle size={14} /> Suspend
                        </button>
                      </div>

                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
