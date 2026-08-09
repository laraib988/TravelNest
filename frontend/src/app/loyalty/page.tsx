'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Award, 
  Gift, 
  Copy, 
  Share2, 
  ChevronRight, 
  Crown, 
  Zap, 
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react';
import Link from 'next/link';

export default function LoyaltyPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  
  const referralLink = `https://travelnest.com/ref/${user?.id?.substring(0, 8) || 'AYESHA2026'}`.toUpperCase();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const points = 1450;
  const value = (points / 100).toFixed(2);
  
  const tiers = [
    { name: 'Bronze', threshold: 0, current: false },
    { name: 'Silver', threshold: 1000, current: true },
    { name: 'Gold', threshold: 5000, current: false }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '40px 24px 80px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* HERO BANNER */}
        <div style={{ marginBottom: '32px' }}>
          <div className="badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <Award size={14} /> TravelNest Rewards & Loyalty Program
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
            Nest Rewards & Tier Perks
          </h1>
          <p style={{ color: '#475569', fontSize: '1.05rem', marginTop: '6px', maxWidth: '640px' }}>
            Earn points on every experience booking, unlock exclusive Silver & Gold membership perks, and invite travel companions.
          </p>
        </div>

        {/* TOP SECTION: POINTS BALANCE & TIER PROGRESS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '28px', marginBottom: '36px' }}>
          
          {/* POINTS BALANCE CARD */}
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
{/* This is sample */}
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Available Rewards Balance
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '10px 0 4px' }}>
                <span style={{ fontSize: '3.2rem', fontWeight: 800, color: '#92400e', lineHeight: 1 }}>
                  {points.toLocaleString()}
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#b45309' }}>NestPoints</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669', marginBottom: '24px' }}>
                ≈ ${value} USD Checkout Discount Value
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}>
              Redeem Points at Checkout
            </button>
          </div>

          {/* TIER PROGRESS CARD */}
          <div className="card-panel" style={{ padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Crown size={20} color="#d97706" />
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Current Status: <span style={{ color: '#d97706' }}>Silver Tier</span>
                    </h2>
                  </div>
                  <span style={{ fontSize: '0.88rem', color: '#64748b' }}>3,550 points needed to unlock Gold Status</span>
                </div>
                <span className="badge-emerald">Active Tier</span>
              </div>

              {/* PROGRESS BAR */}
              <div style={{ position: 'relative', margin: '30px 0 20px' }}>
                <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: '35%', height: '100%', background: 'var(--brand-gradient)', borderRadius: '5px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                  {tiers.map((tier) => (
                    <div key={tier.name} style={{ textAlign: 'center' }}>
                      <div style={{ 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        background: points >= tier.threshold ? '#0284c7' : '#cbd5e1', 
                        color: '#ffffff',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        margin: '0 auto 6px',
                        fontSize: '0.75rem',
                        fontWeight: 800
                      }}>
                        {points >= tier.threshold ? '✓' : ''}
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: tier.current ? 800 : 600, color: tier.current ? 'var(--brand-primary)' : '#64748b' }}>
                        {tier.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{tier.threshold} pts</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* UNLOCKED PERKS ROW */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '14px' }}>
                <Zap size={18} color="#d97706" style={{ marginBottom: '6px' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>1.5x Points Boost</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Earn extra points on tours</div>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '14px' }}>
                <Clock size={18} color="#0284c7" style={{ marginBottom: '6px' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Priority Support</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>24/7 dedicated assistance</div>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '14px' }}>
                <Gift size={18} color="#7c3aed" style={{ marginBottom: '6px' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Annual Reward</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>500 bonus points gift</div>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM SECTION: REFERRAL LINK GENERATOR & POINTS TIMELINE */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
          
          {/* REFERRAL LINK CARD */}
          <div className="card-panel" style={{ padding: '32px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '12px', color: '#059669' }}>
                <Share2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Invite Friends & Earn</h3>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Earn 1,000 NestPoints ($10) for every friend who books</span>
              </div>
            </div>

            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Share your unique referral link with travel buddies. They get a $10 discount on their first experience, and you receive 1,000 points upon completion.
            </p>

            {/* LINK COPY BOX */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <code style={{ flex: 1, fontSize: '0.88rem', fontWeight: 700, color: 'var(--brand-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {referralLink}
              </code>
              <button 
                onClick={copyToClipboard}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <Copy size={14} /> {copied ? 'Copied Link!' : 'Copy Link'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>3</div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Friends Invited</div>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669' }}>3,000</div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Points Earned</div>
              </div>
            </div>
          </div>

          {/* POINTS HISTORY TIMELINE */}
          <div className="card-panel" style={{ padding: '32px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Recent Points History</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { title: 'Booking: Luxury Bali Catamaran', date: 'Aug 01, 2026', pts: '+450 pts', type: 'earn' },
                { title: 'Redeemed for Lahore Tour', date: 'Jul 15, 2026', pts: '-1,000 pts', type: 'spend' },
                { title: 'Referral Bonus (David C.)', date: 'Jul 02, 2026', pts: '+1,000 pts', type: 'earn' },
                { title: 'Account Registration Welcome Bonus', date: 'Jun 20, 2026', pts: '+500 pts', type: 'earn' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: i < 3 ? '14px' : '0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: item.type === 'earn' ? '#ecfdf5' : '#f1f5f9', color: item.type === 'earn' ? '#059669' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.type === 'earn' ? <ArrowUpRight size={18} /> : <Clock size={18} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>{item.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{item.date}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: item.type === 'earn' ? '#059669' : '#0f172a' }}>
                    {item.pts}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
