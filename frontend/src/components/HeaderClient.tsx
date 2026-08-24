'use client';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';

export default function HeaderClient() {
  const pathname = usePathname();
  // Hide header on login and signup pages
  
  const cleanPath = pathname?.replace(/^\/[a-z]{2}(?=\/|$)/, '').replace(/\/$/, '') || '';
  const isAuthPage = cleanPath === '/login' || cleanPath === '/signup' || cleanPath === '/supplier/login' || cleanPath === '/admin-portal/login' || cleanPath === '/supplier/signup';
  
  
  if (isAuthPage) return null;
  return <Header />;
}
