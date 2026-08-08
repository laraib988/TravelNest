'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, ChevronRight, Lock, Check, Zap, DollarSign, Clock } from 'lucide-react';

export default function AvailabilityCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<number | null>(15);
  const [isBlocked, setIsBlocked] = useState(false);
  const [surgePrice, setSurgePrice] = useState(89);

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '40px 24px 80px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* BREADCRUMB NAV */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.88rem', color: '#64748b' }}>
          <Link href="/supplier" style={{ textDecoration: 'none', color: '#64748b' }}>Supplier Portal</Link>
          <ChevronRight size={14} color="#94a3b8" />
          <span style={{ color: '#0f172a', fontWeight: 700 }}>Availability & Pricing Calendar</span>
        </div>

        {/* HEADING */}
        <div style={{ marginBottom: '32px' }}>
          <div className="badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <CalendarIcon size={14} /> Inventory & Dynamic Price Overrides
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
            Interactive Slots & Seasonal Pricing Calendar
          </h1>
          <p style={{ color: '#475569', marginTop: '6px', fontSize: '1rem' }}>
            Block dates, adjust capacity caps, or apply surge price overrides for peak tourist weekends.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
          
          {/* CALENDAR MONTH GRID */}
          <div className="card-panel" style={{ padding: '28px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>August 2026</h2>
              <span className="badge-emerald">Active Listing: Luxury Bali Sunset Catamaran</span>
            </div>

            {/* DAYS OF WEEK */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center', fontWeight: 700, fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>
              <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
            </div>

            {/* MONTH DAYS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
              {daysInMonth.map((day) => {
                const isSelected = selectedDate === day;
                const isPeak = day >= 14 && day <= 18;
                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    style={{
                      height: '70px',
                      borderRadius: '14px',
                      padding: '8px',
                      border: isSelected ? '2px solid var(--brand-primary)' : '1px solid #e2e8f0',
                      background: isSelected ? '#f0f9ff' : isPeak ? '#fffbe6' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 800, color: isSelected ? 'var(--brand-primary)' : '#0f172a' }}>
                      <span>{day}</span>
                      {isPeak && <Zap size={12} color="#d97706" />}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isPeak ? '#b45309' : '#059669' }}>
                      ${isPeak ? '99' : '89'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DATE SETTINGS CONTROL SIDEBAR */}
          <div className="card-panel" style={{ padding: '28px', borderRadius: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              Date Settings: Aug {selectedDate}, 2026
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Price Override ($ USD)</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="number" 
                    value={surgePrice} 
                    onChange={e => setSurgePrice(parseFloat(e.target.value))}
                    style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 700, color: '#0f172a' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Slot Capacity Cap</label>
                <input 
                  type="number" 
                  defaultValue={25} 
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 700, color: '#0f172a' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Block Date for Bookings</span>
                <input 
                  type="checkbox" 
                  checked={isBlocked} 
                  onChange={e => setIsBlocked(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>
            </div>

            <button 
              onClick={() => alert(`Saved inventory settings for Aug ${selectedDate}, 2026!`)}
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.92rem' }}
            >
              Save Date Overrides
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
