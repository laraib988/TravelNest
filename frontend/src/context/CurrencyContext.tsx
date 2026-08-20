'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation } from '@/lib/i18n';

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
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  cart: any[];
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(SUPPORTED_CURRENCIES.USD);
  const [language, setLanguage] = useState<Language>(SUPPORTED_LANGUAGES.en);
  const [liveRates, setLiveRates] = useState<Record<string, number>>({});

  // Sync language with local storage and current URL path
  useEffect(() => {
    const savedCurr = localStorage.getItem('travelnest_currency');
    const savedLang = localStorage.getItem('travelnest_language');
    if (savedCurr && SUPPORTED_CURRENCIES[savedCurr]) {
      setCurrency(SUPPORTED_CURRENCIES[savedCurr]);
    }

    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/');
      const pathLocale = parts[1];
      if (pathLocale && SUPPORTED_LANGUAGES[pathLocale]) {
        setLanguage(SUPPORTED_LANGUAGES[pathLocale]);
        localStorage.setItem('travelnest_language', pathLocale);
        if (pathLocale === 'ar' || pathLocale === 'ur') {
          document.documentElement.setAttribute('dir', 'rtl');
        } else {
          document.documentElement.setAttribute('dir', 'ltr');
        }
      } else if (savedLang && SUPPORTED_LANGUAGES[savedLang]) {
        setLanguage(SUPPORTED_LANGUAGES[savedLang]);
      }
    }
  }, []);

  // Listen to popstate to keep React state in sync with back/forward navigation locale changes
  useEffect(() => {
    const handleUrlChange = () => {
      const parts = window.location.pathname.split('/');
      const pathLocale = parts[1];
      if (pathLocale && SUPPORTED_LANGUAGES[pathLocale]) {
        setLanguage(SUPPORTED_LANGUAGES[pathLocale]);
        if (pathLocale === 'ar' || pathLocale === 'ur') {
          document.documentElement.setAttribute('dir', 'rtl');
        } else {
          document.documentElement.setAttribute('dir', 'ltr');
        }
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Fetch live exchange rates from Frankfurter (ECB)
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
        // Fall back to default static rates
      });
  }, []);

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
      
      if (code === 'ar' || code === 'ur') {
        document.documentElement.setAttribute('dir', 'rtl');
      } else {
        document.documentElement.setAttribute('dir', 'ltr');
      }

      // Update URL subpath without full page reload
      if (typeof window !== 'undefined') {
        const parts = window.location.pathname.split('/');
        const currentLocale = parts[1];
        if (SUPPORTED_LANGUAGES[currentLocale]) {
          parts[1] = code;
          const newPath = parts.join('/') + window.location.search;
          window.history.pushState(null, '', newPath);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
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
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/admin') || pathname.startsWith('/supplier')) {
        return getTranslation('en', key);
      }
    }
    return getTranslation(language.code, key);
  };

  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  // Load wishlist and cart from localStorage
  useEffect(() => {
    try {
      const savedWish = localStorage.getItem('travelnest_wishlist');
      if (savedWish) setWishlist(JSON.parse(savedWish));
      const savedCart = localStorage.getItem('travelnest_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) {
      console.error('Error loading wishlist/cart:', e);
    }
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const updated = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem('travelnest_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const addToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      let updated;
      if (existing) {
        updated = prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i));
      } else {
        updated = [...prev, { ...item, quantity: item.quantity || 1 }];
      }
      localStorage.setItem('travelnest_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      localStorage.setItem('travelnest_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateCartQuantity = (id: string, qty: number) => {
    setCart((prev) => {
      const updated = prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));
      localStorage.setItem('travelnest_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('travelnest_cart');
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrencyCode, 
      language, 
      setLanguageCode, 
      formatPrice, 
      t,
      wishlist,
      toggleWishlist,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart
    }}>
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
      formatPrice: (amt: number) => `${amt.toFixed(2)}`,
      t: (key: string) => key,
      wishlist: [],
      toggleWishlist: () => {},
      cart: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateCartQuantity: () => {},
      clearCart: () => {}
    };
  }
  return context;
}

export const useTranslation = () => {
  const { t, language } = useCurrency();
  return { t, locale: language.code };
};
