'use client';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';

export default function HeaderClient() {
  const pathname = usePathname();
  // Hide header on login and signup pages
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  
  if (isAuthPage) return null;
  return <Header />;
}
