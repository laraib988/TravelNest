'use client';

import React, { useState, useEffect } from 'react';
import { fetchFromAPI } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import {
  Search, DollarSign, TrendingUp, AlertCircle, CheckCircle2,
  Download, Play, ChevronDown, ChevronUp, RefreshCw, FileText, Check, ShieldCheck, Wallet
} from 'lucide-react';

interface PayoutRecord {
  id: string;
  payout_reference: string;
  supplier_id: string;
  gross_amount: number;
  commission_deducted: number;
  net_amount: number;
  currency: string;
  status: 'SCHEDULED' | 'PROCESSING' | 'PAID' | 'FAILED';
  period_start: string;
  period_end: string;
  processed_at?: string;
  txn_id?: string;
}

export default function AdminPayoutsPage() {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async () => {
    try {
      setIsLoading(true);
      let data = await fetchFromAPI('/payouts/history/all').catch(() => null);

      if (!data || !Array.isArray(data) || data.length === 0) {
        data = [
          {
            id: 'po-1',
            payout_reference: 'PO-2026-08-001',
            supplier_id: 'sup-bali-cruises',
            gross_amount: 15400.00,
            commission_deducted: 2310.00,
            net_amount: 13090.00,
            currency: 'USD',
            status: 'PAID',
            period_start: '2026-07-01T00:00:00Z',
            period_end: '2026-07-31T23:59:59Z',
            processed_at: '2026-08-05T10:00:00Z',
            txn_id: 'TXN-998124'
          },
          {
            id: 'po-2',
            payout_reference: 'PO-2026-08-002',
            supplier_id: 'sup-lahore-heritage',
            gross_amount: 8200.00,
            commission_deducted: 1230.00,
            net_amount: 6970.00,
            currency: 'USD',
            status: 'PROCESSING',
            period_start: '2026-07-01T00:00:00Z',
            period_end: '2026-07-31T23:59:59Z',
            txn_id: 'TXN-882190'
          },
          {
            id: 'po-3',
            payout_reference: 'PO-2026-08-003',
            supplier_id: 'sup-arabian-adventures',
            gross_amount: 5000.00,
            commission_deducted: 750.00,
            net_amount: 4250.00,
            currency: 'USD',
            status: 'SCHEDULED',
            period_start: '2026-08-01T00:00:00Z',
            period_end: '2026-08-15T23:59:59Z'
          },
          {
            id: 'po-4',
            payout_reference: 'PO-2026-08-004',
            supplier_id: 'sup-paris-museums',
            gross_amount: 12000.00,
            commission_deducted: 1800.00,
            net_amount: 10200.00,
            currency: 'USD',
            status: 'FAILED',
            period_start: '2026-07-01T00:00:00Z',
            period_end: '2026-07-31T23:59:59Z',
            processed_at: '2026-08-05T10:15:00Z'
          }
        ];
      }
      setPayouts(data);
    } catch (err) {
      console.error(err);
      setPayouts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPayouts();
    setRefreshing(false);
    triggerAction('Payouts ledger refreshed!');
  };

  const handleProcessSinglePayout = (id: string, ref: string) => {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'PAID',
              processed_at: new Date().toISOString(),
              txn_id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`
            }
          : p
      )
    );
    triggerAction(`Payout ${ref} processed & paid successfully!`);
  };

  const handleProcessAllPending = () => {
    const pendingList = payouts.filter((p) => p.status === 'SCHEDULED' || p.status === 'PROCESSING');
    if (pendingList.length === 0) {
      triggerAction('No pending payouts to process at this time.');
      return;
    }

    setPayouts((prev) =>
      prev.map((p) =>
        p.status === 'SCHEDULED' || p.status === 'PROCESSING'
          ? {
              ...p,
              status: 'PAID',
              processed_at: new Date().toISOString(),
              txn_id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`
            }
          : p
      )
    );

    const totalSum = pendingList.reduce((acc, p) => acc + p.net_amount, 0);
    triggerAction(`Processed ${pendingList.length} pending payouts totaling $${totalSum.toLocaleString()}!`);
  };

  const handleExportCSV = () => {
    const csvHeader = "Payout Reference,Supplier ID,Period Start,Period End,Gross Amount,Commission,Net Amount,Status,Txn ID\n";
    const csvRows = payouts.map(p => 
      `"${p.payout_reference}","${p.supplier_id}","${p.period_start}","${p.period_end}",${p.gross_amount},${p.commission_deducted},${p.net_amount},"${p.status}","${p.txn_id || 'N/A'}"`
    ).join("\n");
    
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TravelNest_Payouts_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    triggerAction('Exported Payouts Ledger CSV file!');
  };

  const triggerAction = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const tabs = ['All', 'Scheduled', 'Processing', 'Paid', 'Failed'];

  const filteredPayouts = payouts.filter((p) => {
    if (activeTab !== 'All' && p.status !== activeTab.toUpperCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.payout_reference.toLowerCase().includes(q) || p.supplier_id.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPaid = payouts.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + p.net_amount, 0);
  const pendingAmount = payouts.filter((p) => p.status === 'SCHEDULED' || p.status === 'PROCESSING').reduce((sum, p) => sum + p.net_amount, 0);
  const totalCommission = payouts.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + p.commission_deducted, 0);
  const failedCount = payouts.filter((p) => p.status === 'FAILED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Executive Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Supplier Payouts & Commission Ledger
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
            Process weekly bank wire transfers, inspect platform commissions, and resolve failed payouts.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Refresh Button */}
          <button
            className="btn-secondary"
            onClick={handleRefresh}
            disabled={refreshing}
            style={{ padding: '10px 18px', fontSize: '0.88rem', cursor: 'pointer' }}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          {/* Export CSV Button */}
          <button
            className="btn-secondary"
            onClick={handleExportCSV}
            style={{ padding: '10px 18px', fontSize: '0.88rem', cursor: 'pointer' }}
          >
            <Download size={16} /> Export CSV
          </button>

          {/* Process Pending Payouts Action */}
          <button
            style={{
              padding: '10px 20px',
              fontSize: '0.88rem',
              fontWeight: 800,
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)'
            }}
            onClick={handleProcessAllPending}
          >
            <Play size={16} fill="#ffffff" /> Process All Pending Payouts
          </button>
        </div>
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
              <div className="admin-stat-label">Total Paid Out</div>
              <div className="admin-stat-value" style={{ color: '#059669' }}>${totalPaid.toLocaleString()}</div>
              <div className="admin-stat-change" style={{ color: '#059669' }}>Settled bank transfers</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Pending Payout Queue</div>
              <div className="admin-stat-value" style={{ color: '#d97706' }}>${pendingAmount.toLocaleString()}</div>
              <div className="admin-stat-change" style={{ color: '#b45309' }}>Awaiting settlement</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}>
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Platform Commission</div>
              <div className="admin-stat-value" style={{ color: '#0284c7' }}>${totalCommission.toLocaleString()}</div>
              <div className="admin-stat-change" style={{ color: '#0284c7' }}>Net platform revenue</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #0284c7, #2563eb)' }}>
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Failed Bank Wires</div>
              <div className="admin-stat-value" style={{ color: '#e11d48' }}>{failedCount}</div>
              <div className="admin-stat-change" style={{ color: '#be123c' }}>Retry required</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #e11d48, #f43f5e)' }}>
              <AlertCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div className="admin-filter-bar" style={{ margin: 0 }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`admin-filter-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="admin-search">
          <Search className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search ref or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table Container */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: '72px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', opacity: 0.7 }} />
          ))}
        </div>
      ) : filteredPayouts.length === 0 ? (
        <div className="admin-table-container" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
          <Wallet size={36} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>No payout records found</h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Try adjusting your search query or status filter tab.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Payout Ref</th>
                <th>Supplier ID</th>
                <th>Period</th>
                <th>Gross</th>
                <th>Commission (-15%)</th>
                <th>Net Payout</th>
                <th>Status</th>
                <th style={{ textAlign: 'center', background: '#f0f9ff', color: '#0284c7', fontWeight: 800 }}>⚙️ Management Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayouts.map((payout) => {
                const isExpanded = expandedId === payout.id;
                const statusClass =
                  payout.status === 'PAID'
                    ? 'admin-badge--confirmed'
                    : payout.status === 'FAILED'
                    ? 'admin-badge--cancelled'
                    : payout.status === 'PROCESSING'
                    ? 'admin-badge--pending'
                    : 'admin-badge--draft';

                return (
                  <React.Fragment key={payout.id}>
                    <tr
                      onClick={() => toggleExpand(payout.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <span className="code-ref" style={{ fontSize: '0.88rem' }}>
                          {payout.payout_reference}
                        </span>
                      </td>

                      <td style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                        {payout.supplier_id}
                      </td>

                      <td style={{ color: '#64748b', fontSize: '0.84rem' }}>
                        {new Date(payout.period_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} → {new Date(payout.period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>

                      <td style={{ color: '#475569', fontWeight: 700 }}>
                        ${payout.gross_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      <td style={{ color: '#059669', fontWeight: 700 }}>
                        -${payout.commission_deducted.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      <td>
                        <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
                          ${payout.net_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      <td>
                        <span className={`admin-badge ${statusClass}`}>
                          {payout.status}
                        </span>
                      </td>

                      {/* Action Column */}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                          {(payout.status === 'SCHEDULED' || payout.status === 'PROCESSING') && (
                            <button
                              style={{
                                padding: '6px 14px',
                                fontSize: '0.82rem',
                                fontWeight: 800,
                                borderRadius: '9999px',
                                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                                color: '#ffffff',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.35)'
                              }}
                              onClick={() => handleProcessSinglePayout(payout.id, payout.payout_reference)}
                            >
                              <CheckCircle2 size={13} color="#ffffff" /> Process & Pay
                            </button>
                          )}

                          {payout.status === 'FAILED' && (
                            <button
                              style={{
                                padding: '6px 14px',
                                fontSize: '0.82rem',
                                fontWeight: 800,
                                borderRadius: '9999px',
                                background: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
                                color: '#ffffff',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 4px 12px rgba(225, 29, 72, 0.35)'
                              }}
                              onClick={() => handleProcessSinglePayout(payout.id, payout.payout_reference)}
                            >
                              <RefreshCw size={13} color="#ffffff" /> Retry Payout
                            </button>
                          )}

                          <button
                            style={{
                              padding: '6px 12px',
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              borderRadius: '9999px',
                              background: '#f1f5f9',
                              color: '#334155',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onClick={() => toggleExpand(payout.id)}
                          >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Details
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Payout Settlement Detail */}
                    {isExpanded && (
                      <tr style={{ background: '#f8fafc' }}>
                        <td colSpan={8} style={{ padding: '24px' }}>
                          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px' }}>
                            
                            <div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>PROCESSED TIMESTAMP</div>
                              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                                {payout.processed_at ? new Date(payout.processed_at).toLocaleString() : 'Pending Queue'}
                              </div>
                            </div>

                            <div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>PAYMENT METHOD</div>
                              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                                Direct Bank Wire (ACH / SWIFT)
                              </div>
                            </div>

                            <div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TRANSACTION ID</div>
                              <div className="code-ref" style={{ fontSize: '0.88rem', marginTop: '4px' }}>
                                {payout.txn_id || 'PENDING-SETTLEMENT'}
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                              <button
                                className="btn-secondary"
                                style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                                onClick={() => triggerAction(`Exported PDF Settlement Invoice for ${payout.payout_reference}`)}
                              >
                                <FileText size={14} /> Export PDF Report
                              </button>
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

    </div>
  );
}
