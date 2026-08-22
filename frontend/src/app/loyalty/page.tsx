'use client';

import React from 'react';
import { 
  Award, 
  Gift, 
  Share2, 
  Crown, 
  Zap, 
  Clock,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function LoyaltyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '40px 24px 80px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* HERO BANNER */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <Award size={14} /> Vaitour Rewards & Loyalty Program
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
              Vaitour Explorer
            </h1>
            <p style={{ color: '#475569', fontSize: '1.05rem', marginTop: '6px', maxWidth: '640px' }}>
              Earn points on every experience booking, unlock exclusive Silver & Gold membership perks, and invite travel companions.
            </p>
          </div>
        </div>

        {/* TOP SECTION: INFORMATIONAL POINTS BALANCE & TIER BENEFITS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '28px', marginBottom: '36px' }}>
          
          {/* POINTS EXPLANATION CARD */}
          <div 
            style={{ 
              background: 'linear-gradient(135deg, #fffbe6 0%, #fef3c7 100%)', 
              border: '1px solid #fde68a', 
              borderRadius: '24px', 
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: '#b45309' }}>
              <Award size={140} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                How Points Work
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '10px 0 4px' }}>
                <span style={{ fontSize: '3.2rem', fontWeight: 800, color: '#92400e', lineHeight: 1 }}>
                  100
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#b45309' }}>NestPoints</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669', marginBottom: '24px' }}>
                = $0.50 USD Checkout Discount
              </div>
            </div>
            <div style={{ background: '#f59e0b', color: '#fff', textAlign: 'center', padding: '14px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700 }}>
              Redeemable at Checkout
            </div>
          </div>

          {/* TIER BENEFITS CARD */}
          <div className="card-panel" style={{ padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Crown size={20} color="#0f172a" />
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Tier Benefits Breakdown
                    </h2>
                  </div>
                  <span style={{ fontSize: '0.88rem', color: '#64748b' }}>Move through tiers to unlock exclusive perks</span>
                </div>
              </div>

              {/* UNLOCKED PERKS ROW */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '14px' }}>
                  <CheckCircle2 size={18} color="#64748b" style={{ marginBottom: '6px' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Bronze (0 - 999 pts)</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Standard introductory benefits and point earning capabilities.</div>
                </div>
                
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '14px' }}>
                  <Zap size={18} color="#0284c7" style={{ marginBottom: '6px' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Silver (1,000+ pts)</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Added perks, seasonal discounts, and priority on popular tours.</div>
                </div>
                
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '14px', borderRadius: '14px' }}>
                  <Gift size={18} color="#d97706" style={{ marginBottom: '6px' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Gold (5,000+ pts)</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Fast-track support, 100 extra points per booking, $0.01 per referral.</div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: INVITE EXPLANATION */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '28px' }}>
          
          {/* INVITE CARD */}
          <div className="card-panel" style={{ padding: '32px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '12px', color: '#059669' }}>
                <Share2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Invite & Earn</h3>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Help your friends discover the world</span>
              </div>
            </div>

            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px', maxWidth: '800px' }}>
              Share Vaitour with your travel companions. When you invite a friend, and they successfully complete a tour booking, you will automatically earn <strong>50 Reward Points</strong> added to your account balance. There is no limit to how many friends you can invite!
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
