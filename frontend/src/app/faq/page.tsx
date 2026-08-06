'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How do I receive my booking voucher?',
      answer: 'Instant confirmation products issue an electronic QR voucher immediately after payment under My Bookings and via email. Present this QR code on your mobile device at the venue.'
    },
    {
      question: 'Can I cancel or reschedule my activity?',
      answer: 'Yes! Most tours feature a FREE 24-hour cancellation policy. You can cancel or request a date reschedule directly from My Bookings up to 24 hours before your start time.'
    },
    {
      question: 'Are local tour guides verified?',
      answer: 'Absolutely. Every supplier on TravelNest undergoes strict document-based KYC verification, trade license validation, and public liability insurance pre-screening.'
    },
    {
      question: 'What payment methods are supported?',
      answer: 'We accept major international credit/debit cards (Visa, Mastercard, AMEX), Apple Pay, Google Pay, PayPal, as well as local payment rails including JazzCash and Easypaisa.'
    },
    {
      question: 'How does the AI Trip Planner work?',
      answer: 'Type your vacation duration, budget, and travel preferences in natural language. Our AI planner queries live database inventory to build a day-by-day itinerary with 1-click cart checkout.'
    }
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 24px 80px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#0f172a', fontWeight: 800, marginBottom: '12px' }}>
          Frequently Asked Questions (FAQ)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          Got questions? We have answers. Everything you need to know about booking, e-vouchers, and AI itinerary planning.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {faqs.map((faq, idx) => (
          <div key={idx} className="card-panel" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              style={{
                width: '100%',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{faq.question}</span>
              {openIdx === idx ? <ChevronUp size={20} color="var(--brand-primary)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
            </button>

            {openIdx === idx && (
              <div style={{ padding: '0 24px 20px', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, borderTop: '1px solid #f1f5f9' }}>
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
