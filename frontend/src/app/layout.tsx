import './globals.css';
import { Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'TravelNest - Global Tours, Activities & Experiences Marketplace',
  description: 'Book top-rated tours, sunset cruises, food walks, and experiences worldwide with real-time availability and AI trip planning.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CurrencyProvider>
          <AuthProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#ffffff' }}>
              {/* TOP ANNOUNCEMENT BAR */}
              <div style={{ background: 'var(--brand-gradient)', color: '#ffffff', padding: '6px 24px', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <Sparkles size={14} /> ⚡ Flash Sale: Get 15% off Bali & Tokyo Experiences with code <strong>TRAVELNEST2026</strong>
              </div>

              {/* FUNCTIONAL NAVBAR WITH LOGIN/SIGNUP & CURRENCY/LANGUAGE SWITCHER */}
              <Header />

              {/* MAIN CONTENT */}
              <main style={{ flex: 1 }}>{children}</main>

              {/* ENTERPRISE FOOTER */}
              <Footer />
            </div>
          </AuthProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
