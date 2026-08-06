'use client';

import { useState } from 'react';
import { X, Globe, DollarSign, Check } from 'lucide-react';
import { useCurrency, SUPPORTED_CURRENCIES, SUPPORTED_LANGUAGES } from '@/context/CurrencyContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CurrencyLanguageModal({ isOpen, onClose }: Props) {
  const { currency, setCurrencyCode, language, setLanguageCode } = useCurrency();
  const [activeTab, setActiveTab] = useState<'CURRENCY' | 'LANGUAGE'>('CURRENCY');

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          maxWidth: '520px',
          width: '100%',
          padding: '32px',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b',
          }}
        >
          <X size={18} />
        </button>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
          Select Currency & Language
        </h3>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('CURRENCY')}
            style={{
              padding: '10px 20px',
              fontSize: '0.95rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'CURRENCY' ? '3px solid var(--brand-primary)' : 'none',
              color: activeTab === 'CURRENCY' ? 'var(--brand-primary)' : '#64748b',
              cursor: 'pointer',
            }}
          >
            Currency ({currency.code} {currency.symbol})
          </button>

          <button
            onClick={() => setActiveTab('LANGUAGE')}
            style={{
              padding: '10px 20px',
              fontSize: '0.95rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'LANGUAGE' ? '3px solid var(--brand-primary)' : 'none',
              color: activeTab === 'LANGUAGE' ? 'var(--brand-primary)' : '#64748b',
              cursor: 'pointer',
            }}
          >
            Language ({language.flag} {language.name.split(' ')[0]})
          </button>
        </div>

        {/* CURRENCY LIST */}
        {activeTab === 'CURRENCY' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', maxHeight: '320px', overflowY: 'auto' }}>
            {Object.values(SUPPORTED_CURRENCIES).map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setCurrencyCode(c.code);
                  onClose();
                }}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: currency.code === c.code ? '2px solid var(--brand-primary)' : '1px solid #cbd5e1',
                  background: currency.code === c.code ? '#f0f9ff' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                    {c.code} ({c.symbol})
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{c.name}</span>
                </div>
                {currency.code === c.code && <Check size={18} color="var(--brand-primary)" />}
              </button>
            ))}
          </div>
        ) : (
          /* LANGUAGE LIST */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', maxHeight: '320px', overflowY: 'auto' }}>
            {Object.values(SUPPORTED_LANGUAGES).map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLanguageCode(l.code);
                  onClose();
                }}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: language.code === l.code ? '2px solid var(--brand-primary)' : '1px solid #cbd5e1',
                  background: language.code === l.code ? '#f0f9ff' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.4rem' }}>{l.flag}</span>
                  <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{l.name}</span>
                </div>
                {language.code === l.code && <Check size={18} color="var(--brand-primary)" />}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
