'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useCurrency, SUPPORTED_CURRENCIES, SUPPORTED_LANGUAGES } from '@/context/CurrencyContext';

export default function CurrencyLanguageDropdown() {
  const { currency, setCurrencyCode, language, setLanguageCode } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'LANGUAGES' | 'CURRENCY'>('CURRENCY');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currenciesList = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee' },
    { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  ];

  const languagesList = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'ja', label: 'JA', name: 'Japanese' },
    { code: 'ur', label: 'UR', name: 'Urdu' },
    { code: 'fr', label: 'FR', name: 'French' },
    { code: 'ar', label: 'AR', name: 'Arabic' },
  ];

  const currentLangLabel = languagesList.find((l) => l.code === language.code)?.label || 'EN';

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      
      {/* HEADER TRIGGER BUTTON MATCHING SCREENSHOT: 🌐 EN | USD ˅ */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-secondary"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.88rem',
          fontWeight: 700,
          cursor: 'pointer',
          padding: '8px 16px',
          height: '38px',
          borderRadius: 'var(--radius-pill)',
        }}
      >
        <Globe size={16} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
        <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{currentLangLabel} | {currency.code}</span>
        <ChevronDown size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
      </button>

      {/* DROPDOWN POPUP CARD EXACTLY MATCHING SCREENSHOT */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '260px',
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.18)',
            border: '1px solid #e2e8f0',
            zIndex: 99999,
            overflow: 'hidden',
            fontFamily: 'inherit',
          }}
        >
          {/* TABS AT TOP: Languages | Currency */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
            <button
              onClick={() => setActiveTab('LANGUAGES')}
              style={{
                flex: 1,
                padding: '10px 0',
                fontSize: '0.85rem',
                fontWeight: activeTab === 'LANGUAGES' ? 700 : 500,
                color: activeTab === 'LANGUAGES' ? '#0f172a' : '#64748b',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'LANGUAGES' ? '2px solid #0f172a' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              Languages
            </button>
            <button
              onClick={() => setActiveTab('CURRENCY')}
              style={{
                flex: 1,
                padding: '10px 0',
                fontSize: '0.85rem',
                fontWeight: activeTab === 'CURRENCY' ? 700 : 500,
                color: activeTab === 'CURRENCY' ? '#0f172a' : '#64748b',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'CURRENCY' ? '2px solid #0f172a' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              Currency
            </button>
          </div>

          {/* LIST ITEMS MATCHING SCREENSHOT FORMAT */}
          <div style={{ maxHeight: '260px', overflowY: 'auto', padding: '6px 0' }}>
            {activeTab === 'CURRENCY' ? (
              currenciesList.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setCurrencyCode(c.code);
                    setIsOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontSize: '0.88rem',
                    fontWeight: currency.code === c.code ? 700 : 500,
                    color: currency.code === c.code ? 'var(--brand-primary)' : '#1e293b',
                    background: currency.code === c.code ? '#f0f9ff' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ minWidth: '45px' }}>{c.symbol} {c.code}</span>
                  <span style={{ color: '#64748b' }}>— {c.name}</span>
                </button>
              ))
            ) : (
              languagesList.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguageCode(l.code);
                    setIsOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontSize: '0.88rem',
                    fontWeight: language.code === l.code ? 700 : 500,
                    color: language.code === l.code ? 'var(--brand-primary)' : '#1e293b',
                    background: language.code === l.code ? '#f0f9ff' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ minWidth: '35px', fontWeight: 700 }}>{l.label}</span>
                  <span style={{ color: '#64748b' }}>— {l.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
