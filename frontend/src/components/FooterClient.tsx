'use client';
import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

export default function FooterClient() {
  const pathname = usePathname();
  // Hide footer on login and signup pages
  
  const cleanPath = pathname?.replace(/^\/[a-z]{2}(?=\/|$)/, '').replace(/\/$/, '') || '';
  const isAuthPage = cleanPath === '/login' || cleanPath === '/signup' || cleanPath === '/supplier/login' || cleanPath === '/admin/login' || cleanPath === '/supplier/signup';
  
  
  if (isAuthPage) return null;
  return <Footer />;
}
