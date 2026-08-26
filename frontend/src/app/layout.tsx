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
  metadataBase: new URL('https://www.vaitour.com'),
  title: {
    default: 'Vaitour - Book Authentic Local Tours & Travel Experiences',
    template: '%s | Vaitour'
  },
  description: 'Book authentic, top-rated local tours, sunset cruises, food walks, and travel experiences worldwide. Connect with verified local guides and plan your perfect trip.',
  verification: {
    google: 'E5I3y-OC4eYmBFKcLBcSTLLke3DNZEKzD05x3wOfyzE',
  },
  openGraph: {
    title: 'Vaitour - Book Authentic Local Tours & Travel Experiences',
    description: 'Book authentic, top-rated local tours, sunset cruises, food walks, and travel experiences worldwide. Connect with verified local guides and plan your perfect trip.',
    url: 'https://www.vaitour.com',
    siteName: 'Vaitour',
    images: [
      {
        url: 'https://www.vaitour.com/og-image.jpg', // Placeholder for your actual OG image
        width: 1200,
        height: 630,
        alt: 'Vaitour - Global Travel Experiences',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vaitour - Book Authentic Local Tours & Travel Experiences',
    description: 'Book authentic, top-rated local tours, sunset cruises, food walks, and travel experiences worldwide. Connect with verified local guides and plan your perfect trip.',
    images: ['https://www.vaitour.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
