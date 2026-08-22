import { Plus_Jakarta_Sans, Outfit, Noto_Sans_JP, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Sparkles } from 'lucide-react';
import HeaderClient from '@/components/HeaderClient';
import FooterClient from '@/components/FooterClient';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { AuthProvider } from '@/context/AuthContext';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

const notoJP = Noto_Sans_JP({ 
  subsets: ['latin'], 
  display: 'swap',
  variable: '--font-noto-jp',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata = {
  title: 'Vaitour - Global Tours, Activities & Experiences Marketplace',
  description: 'Book top-rated tours, sunset cruises, food walks, and experiences worldwide with real-time availability and AI trip planning.',
};

import { headers } from 'next/headers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers();
  const locale = headersList.get('x-locale') || 'en';
  const rtlLocales = ['ur', 'ar'];
  const dir = rtlLocales.includes(locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={`${jakarta.variable} ${outfit.variable} ${notoJP.variable} ${jetbrainsMono.variable}`}>
      <body>
        <CurrencyProvider>
          <AuthProvider>
            <div style={{ display: 'flex', flexDirection: 'column', /* minHeight: '100vh', */ background: '#ffffff' }}>
              {/* FUNCTIONAL NAVBAR WITH LOGIN/SIGNUP & CURRENCY/LANGUAGE SWITCHER */}
              <HeaderClient />
        
        {/* MAIN CONTENT */}
        <main style={{ flex: 1 }}>{children}</main>
        
        {/* Footer Client */}
              <FooterClient />
            </div>
          </AuthProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
