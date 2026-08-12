'use client';

import React, { useState } from 'react';
import {
  Settings, Shield, Bell, CreditCard, Lock, Save, Globe,
  CheckCircle2, Cpu, Server
} from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [platformName, setPlatformName] = useState('TravelNest Marketplace');
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

    </div>
  );
}
