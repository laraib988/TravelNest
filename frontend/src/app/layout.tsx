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
