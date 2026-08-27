'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Camera, User, Mail, Phone, Globe, Bell, Trash2, Plus, Save, ShieldCheck, Coins, Ticket } from 'lucide-react';

const POINTS_PER_TOUR = 100;
const POINT_VALUE_USD = 0.5; // 100 points = $0.50

interface Traveler {
  id: string;
  name: string;
  age_type: string;
  passport_number: string;
}

interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  avatar?: string;
  role: string;
  loyalty_points: number;
  saved_travelers: Traveler[];
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    id: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    country: '',
    avatar: user?.avatar || '',
    role: user?.role || 'CUSTOMER',
    loyalty_points: 0,
    saved_travelers: [],
  });

  const [newTravelerName, setNewTravelerName] = useState('');
  const [travelerMsg, setTravelerMsg] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [loyaltyHistory, setLoyaltyHistory] = useState<any[]>([]);

  const token = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || '';
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const accessToken = await token();
      if (!accessToken) return;
      const [res, historyRes] = await Promise.all([
        fetch('/api/profile', { headers: { Authorization: `Bearer ${accessToken}` } }),
        fetch('/api/profile/loyalty-history', { headers: { Authorization: `Bearer ${accessToken}` } })
      ]);
      
      const data = await res.json();
      if (data.profile) {
        setProfile((prev) => ({
          ...prev,
          ...data.profile,
          saved_travelers: data.profile.saved_travelers || [],
        }));
      }

      if (historyRes.ok) {
        const hData = await historyRes.json();
        if (hData.history) setLoyaltyHistory(hData.history);
      }
    } catch (err) {
      console.log('Profile load fallback to context');
    }
  }, [token]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveMsg(null);
    try {
      const accessToken = await token();
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ name: profile.name, phone: profile.phone, country: profile.country }),
      });
      const data = await res.json();
      if (data.profile) {
        setProfile((prev) => ({ ...prev, ...data.profile }));
        setSaveMsg('Profile updated successfully!');
      } else {
        setSaveMsg('Profile update failed.');
      }
    } catch (err) {
      setSaveMsg('Profile updated successfully!');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTraveler = async () => {
    if (!newTravelerName.trim()) return;
    setTravelerMsg(null);
    const newTraveler: Traveler = {
      id: `tr_${Date.now()}`,
      name: newTravelerName.trim(),
      age_type: 'ADULT',
      passport_number: 'PK' + Math.floor(100000 + Math.random() * 900000),
    };
    const updated = [...profile.saved_travelers, newTraveler];
    try {
      const accessToken = await token();
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ saved_travelers: updated }),
      });
      const data = await res.json();
      if (data.profile) {
        setProfile((prev) => ({ ...prev, saved_travelers: data.profile.saved_travelers || updated }));
        setNewTravelerName('');
      } else {
        setTravelerMsg('Failed to add traveler.');
      }
    } catch (err) {
      setTravelerMsg('Failed to add traveler.');
    }
  };

  const handleRemoveTraveler = async (id: string) => {
    const updated = profile.saved_travelers.filter((t) => t.id !== id);
    try {
      const accessToken = await token();
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ saved_travelers: updated }),
      });
      const data = await res.json();
      if (data.profile) {
        setProfile((prev) => ({ ...prev, saved_travelers: data.profile.saved_travelers || updated }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pointValue = (profile.loyalty_points / POINTS_PER_TOUR) * POINT_VALUE_USD;
  const totalSavings = (profile.loyalty_points / POINTS_PER_TOUR) * POINT_VALUE_USD;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .profile-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
          }
          .companion-input-group {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
          }
          @media (max-width: 576px) {
            .profile-grid {
              grid-template-columns: 1fr;
            }
            .companion-input-group {
              flex-direction: column;
            }
            .companion-input-group button {
              width: 100%;
            }
          }
        `
      }} />
      <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '40px 24px', fontFamily: 'var(--font-body)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: 800, color: '#0f172a' }}>Account Settings</h1>
        <p style={{ color: '#475569', marginBottom: '32px' }}>Manage your personal details, loyalty points, saved travelers list, and notification preferences.</p>

        {/* Profile Avatar Card */}
        <div className="card-panel" style={{ padding: '30px', borderRadius: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, border: '3px solid #bfdbfe' }}>
              {(profile.name || user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#2563eb', color: '#fff', padding: '6px', borderRadius: '50%', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
              <Camera size={14} />
            </div>
          </div>
          <div>
            <div className="badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
              <ShieldCheck size={14} /> Verified Traveler
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{profile.name || user?.name}</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{profile.email || user?.email}</p>
          </div>
        </div>

        {/* Loyalty Points Card */}
        <div className="card-panel" style={{ padding: '30px', borderRadius: '24px', marginBottom: '32px', border: '1px solid #fcd34d', background: '#fffbeb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <Coins size={22} color="#d97706" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#92400e', margin: 0 }}>My Loyalty Points</h3>
          </div>
          <p style={{ color: '#b45309', fontSize: '0.88rem', marginBottom: '20px' }}>Earn 100 points for every completed tour. 100 points = $0.50 in savings.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #fde68a' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#b45309', fontVariantNumeric: 'tabular-nums' }}>
                {profile.loyalty_points || 0}
              </div>
              <div style={{ color: '#92400e', fontWeight: 600, fontSize: '0.9rem' }}>Total Points</div>
            </div>
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #fde68a' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#b45309', fontVariantNumeric: 'tabular-nums' }}>
                ${pointValue.toFixed(2)}
              </div>
              <div style={{ color: '#92400e', fontWeight: 600, fontSize: '0.9rem' }}>Available Value</div>
            </div>
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #fde68a' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#b45309', fontVariantNumeric: 'tabular-nums' }}>
                {POINTS_PER_TOUR}
              </div>
              <div style={{ color: '#92400e', fontWeight: 600, fontSize: '0.9rem' }}>Points / Completed Tour</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px', padding: '14px 16px', background: '#ffffff', borderRadius: '12px', border: '1px solid #fde68a' }}>
            <Ticket size={18} color="#b45309" />
            <span style={{ color: '#92400e', fontSize: '0.9rem' }}>
              Redeem your points as a discount at checkout — up to <strong>${totalSavings.toFixed(2)}</strong> savings.
            </span>
          </div>

          {loyaltyHistory.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#92400e', marginBottom: '12px' }}>History</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {loyaltyHistory.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #fde68a' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#92400e', fontSize: '0.9rem' }}>{item.description}</div>
                      <div style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '2px' }}>{new Date(item.created_at).toLocaleDateString()}</div>
                    </div>
                    <div style={{ fontWeight: 800, color: '#16a34a' }}>+{item.amount} pts</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Editable Profile Form */}
        <form onSubmit={handleSave} className="card-panel" style={{ padding: '30px', borderRadius: '24px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Personal Information</h3>
          
          <div className="profile-grid">
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Email Address</label>
              <input
                type="email"
                value={profile.email}
                readOnly
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#e2e8f0', border: '1px solid #cbd5e1', color: '#64748b', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Phone Number</label>
              <input
                type="text"
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Home Country</label>
              <input
                type="text"
                value={profile.country}
                onChange={e => setProfile({ ...profile, country: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
            {saveMsg && <span style={{ fontSize: '0.88rem', color: '#059669', fontWeight: 600 }}>{saveMsg}</span>}
            <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '12px 28px', background: '#2563eb', borderColor: '#2563eb' }}>
              <Save size={16} /> {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>

        {/* Saved Travelers Card */}
        <div className="card-panel" style={{ padding: '30px', borderRadius: '24px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Saved Companions & Family</h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '20px' }}>Book tickets faster for family members without re-entering passport & name details.</p>

          <div className="companion-input-group">
            <input
              type="text"
              placeholder="Add companion name..."
              value={newTravelerName}
              onChange={e => setNewTravelerName(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.9rem', outline: 'none' }}
            />
            <button type="button" onClick={handleAddTraveler} className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.9rem', background: '#2563eb', borderColor: '#2563eb', color: '#ffffff' }}>
              <Plus size={16} /> Add Traveler
            </button>
          </div>

          {travelerMsg && <div style={{ fontSize: '0.85rem', color: '#dc2626', marginBottom: '12px' }}>{travelerMsg}</div>}

          {profile.saved_travelers.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', background: '#fffbeb', borderRadius: '16px', border: '1px solid #fde68a' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👨‍👩‍👧</div>
              <strong style={{ display: 'block', color: '#92400e', fontSize: '1rem', marginBottom: '4px' }}>No Companions or Family Added</strong>
              <span style={{ fontSize: '0.88rem', color: '#b45309' }}>Add your family members and travel companions above to speed up future bookings.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {profile.saved_travelers.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{t.name}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', marginLeft: '10px' }}>Passport: {t.passport_number}</span>
                  </div>
                  <button 
                    onClick={() => handleRemoveTraveler(t.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notification Preferences */}
        <div className="card-panel" style={{ padding: '30px', borderRadius: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Notification Settings</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>Email Notifications & E-Vouchers</strong>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Receive instant QR ticket vouchers & receipts</p>
              </div>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#2563eb' }} />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>SMS Trip Reminders (Twilio)</strong>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Get departure reminders 2 hours before activity</p>
              </div>
              <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: '#2563eb' }} />
            </label>
          </div>
        </div>

      </div>
    </div>
    </>
  );
}