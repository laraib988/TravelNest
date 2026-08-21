'use client';
import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

export default function FooterClient() {
  const pathname = usePathname();
  // Hide footer on login and signup pages
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  
  if (isAuthPage) return null;
  return <Footer />;
}
