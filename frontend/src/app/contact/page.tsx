'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px 80px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#0f172a', fontWeight: 800, marginBottom: '12px' }}>
          Contact Vaitour Support
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
          Have a question about your booking, rescheduling, or supplier partnership? Our global support team is available 24/7.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
        
        {/* CONTACT FORM */}
        <div className="card-panel" style={{ padding: '36px', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 700, marginBottom: '20px' }}>
            Send Us a Message
          </h2>

          {submitted ? (
            <div style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#047857', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <CheckCircle size={36} style={{ marginBottom: '10px' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Thank You!</h3>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>Your message has been received. Our team will respond within 2 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Booking inquiry / Refund / Partnership"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '14px 24px', fontSize: '0.95rem', justifyContent: 'center' }}>
                <Send size={16} /> Send Message
              </button>
            </form>
          )}
        </div>

        {/* DIRECT CONTACT INFO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
              <div style={{ background: '#e0f2fe', padding: '12px', borderRadius: '12px', color: '#0284c7' }}><Mail size={22} /></div>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: '#0f172a', margin: 0 }}>Customer Care Email</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>support@vaitour.com</p>
              </div>
            </div>
          </div>

          <div className="card-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
              <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '12px', color: '#059669' }}><Phone size={22} /></div>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: '#0f172a', margin: 0 }}>Global Support Phone</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>+81 80-8357-2662</p>
              </div>
            </div>
          </div>

          <div className="card-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '12px', color: '#d97706' }}><MapPin size={22} /></div>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '4px' }}>Japan Headquarters</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Sotoike Shukugo Building,<br />
                  Utsunomiya City, Tochigi.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
