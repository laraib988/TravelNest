'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from './translations';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: Record<string, Currency> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
  PKR: { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee', rate: 278.50 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 155.20 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.50 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 1.35 },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rate: 3.67 },
};

export const SUPPORTED_LANGUAGES: Record<string, Language> = {
  en: { code: 'en', name: 'English (US)', flag: '🇺🇸' },
  ur: { code: 'ur', name: 'Urdu (PK)', flag: '🇵🇰' },
  ja: { code: 'ja', name: 'Japanese (JP)', flag: '🇯🇵' },
  fr: { code: 'fr', name: 'French (FR)', flag: '🇫🇷' },
  ar: { code: 'ar', name: 'Arabic (AE)', flag: '🇦🇪' },
};

interface CurrencyContextType {
  currency: Currency;
  setCurrencyCode: (code: string) => void;
  language: Language;
  setLanguageCode: (code: string) => void;
  formatPrice: (amountInUSD: number) => string;
  t: (key: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(SUPPORTED_CURRENCIES.USD);
  const [language, setLanguage] = useState<Language>(SUPPORTED_LANGUAGES.en);
  const [liveRates, setLiveRates] = useState<Record<string, number>>({});

  useEffect(() => {
    const savedCurr = localStorage.getItem('travelnest_currency');
    const savedLang = localStorage.getItem('travelnest_language');
    if (savedCurr && SUPPORTED_CURRENCIES[savedCurr]) {
      setCurrency(SUPPORTED_CURRENCIES[savedCurr]);
    }
    if (savedLang && SUPPORTED_LANGUAGES[savedLang]) {
      setLanguage(SUPPORTED_LANGUAGES[savedLang]);
    }
  }, []);

  // Fetch live exchange rates from Frankfurter (ECB) so prices are accurate
  useEffect(() => {
    const codes = Object.keys(SUPPORTED_CURRENCIES).join(',');
    fetch(`https://api.frankfurter.app/latest?from=USD&to=${codes}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          setLiveRates({ ...data.rates, USD: 1 });
        }
      })
      .catch(() => {
        // Fall back to the built-in rates if the network call fails
      });
  }, []);

  // Apply a live rate when available (fall back to the built-in static rate)
  const resolvedRate = (code: string): number => {
    if (liveRates[code] && liveRates[code] > 0) return liveRates[code];
    return SUPPORTED_CURRENCIES[code]?.rate ?? 1;
  };

  const setCurrencyCode = (code: string) => {
    if (SUPPORTED_CURRENCIES[code]) {
      setCurrency({
        ...SUPPORTED_CURRENCIES[code],
        rate: resolvedRate(code),
      });
      localStorage.setItem('travelnest_currency', code);
    }
  };

  const setLanguageCode = (code: string) => {
    if (SUPPORTED_LANGUAGES[code]) {
      setLanguage(SUPPORTED_LANGUAGES[code]);
      localStorage.setItem('travelnest_language', code);
      // Auto-toggle RTL for Arabic & Urdu
      if (code === 'ar' || code === 'ur') {
        document.documentElement.setAttribute('dir', 'rtl');
      } else {
        document.documentElement.setAttribute('dir', 'ltr');
      }
    }
  };

  const formatPrice = (amountInUSD: number) => {
    const rate = resolvedRate(currency.code);
    const converted = amountInUSD * rate;
    if (currency.code === 'JPY' || currency.code === 'PKR' || currency.code === 'INR') {
      return `${currency.symbol} ${Math.round(converted).toLocaleString()}`;
    }
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language.code] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrencyCode, language, setLanguageCode, formatPrice, t }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    return {
      currency: SUPPORTED_CURRENCIES.USD,
      setCurrencyCode: () => {},
      language: SUPPORTED_LANGUAGES.en,
      setLanguageCode: () => {},
      formatPrice: (amt: number) => `$${amt.toFixed(2)}`,
      t: (key: string) => key,
    };
  }
  return context;
}
