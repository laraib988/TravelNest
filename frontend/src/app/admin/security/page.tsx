'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Lock, Database, Activity, Bot, Code, FileText, Globe, CheckCircle2 } from 'lucide-react';

interface AuditLog {
  id: string;
  actor_id: string;
  actor_role: string;
  action: string;
  entity_type: string;
  ip_address: string;
  created_at: string;
  details: any;
}

export default function SecurityDashboardPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/audit-logs')
      .then(res => res.json())
      .then(data => {
        if (data.data) setLogs(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const features = [
    { icon: <Lock size={20} color="#059669" />, title: 'Multi-Factor Auth (MFA)', desc: 'Admin accounts secured with TOTP', status: 'Active' },
    { icon: <Database size={20} color="#059669" />, title: 'Row Level Security (RLS)', desc: 'Database kernel-level data isolation', status: 'Active' },
    { icon: <Activity size={20} color="#059669" />, title: 'API Rate Limiting', desc: 'Edge middleware DDoS protection', status: 'Active' },
    { icon: <Bot size={20} color="#059669" />, title: 'Bot Protection', desc: 'Cloudflare Turnstile on auth forms', status: 'Active' },
    { icon: <Code size={20} color="#059669" />, title: 'Strict Input Validation', desc: 'Zod XSS & SQL Injection filters', status: 'Active' },
    { icon: <Globe size={20} color="#059669" />, title: 'Content Security Policy', desc: 'Strict HTTP Headers (CSP, HSTS)', status: 'Active' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '32px', borderRadius: '24px', color: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px' }}>
          <ShieldCheck size={40} color="#10b981" />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            Security & Audit Center
            <span style={{ fontSize: '0.8rem', background: '#10b981', color: '#064e3b', padding: '4px 10px', borderRadius: '999px', fontWeight: 700 }}>BANK-GRADE</span>
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#cbd5e1', marginTop: '6px' }}>
            Monitor your platform's 7-layer defense system and real-time audit logs.
          </p>
        </div>
      </div>

      {/* 7-Layer Defense System Cards */}
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} color="#6366f1" /> Active Defense Systems
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '12px' }}>
                {f.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>{f.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 8px 0' }}>{f.desc}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#d1fae5', padding: '4px 8px', borderRadius: '6px' }}>
                  <CheckCircle2 size={12} /> {f.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#6366f1" /> System Audit Logs
          </h2>
          <div style={{ fontSize: '0.85rem', color: '#64748b', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            Live Monitoring Active
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#475569', fontSize: '0.85rem' }}>
                <th style={{ padding: '16px 24px', fontWeight: 700 }}>TIMESTAMP</th>
                <th style={{ padding: '16px 24px', fontWeight: 700 }}>ACTION</th>
                <th style={{ padding: '16px 24px', fontWeight: 700 }}>ACTOR ROLE</th>
                <th style={{ padding: '16px 24px', fontWeight: 700 }}>IP ADDRESS</th>
                <th style={{ padding: '16px 24px', fontWeight: 700 }}>DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading secure logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No audit logs recorded yet. Perform an action to see it here!</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem', color: '#334155' }}>
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '4px 8px', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem' }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: 600 }}>{log.actor_role}</td>
                    <td style={{ padding: '16px 24px', fontFamily: 'monospace' }}>{log.ip_address}</td>
                    <td style={{ padding: '16px 24px', color: '#64748b', fontSize: '0.85rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
