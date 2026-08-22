'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Compass, Search, MapPin, ArrowRight } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <div style={{ background: '#ffffff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', maxWidth: '600px', width: '100%' }}>
        <Compass size={64} color="var(--brand-primary, #6366f1)" style={{ margin: '0 auto 20px' }} />
        
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#334155', margin: '0 0 20px' }}>
          Page Not Found
        </h2>
        
        <p style={{ color: 'var(--text-secondary, #64748b)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '30px' }}>
          Looks like you've wandered off the map. The tour or destination you're looking for might have been moved, expired, or doesn't exist.
        </p>

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Where do you want to go?" 
              style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  router.push(`/tours?search=${e.currentTarget.value}`);
                }
              }}
            />
          </div>
          <button 
            style={{ background: 'var(--brand-primary, #6366f1)', color: '#fff', padding: '0 24px', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling?.querySelector('input');
              if (input && input.value) {
                router.push(`/tours?search=${input.value}`);
              }
            }}
          >
            Search
          </button>
        </div>

        {/* Popular Destinations */}
        <div style={{ textAlign: 'left', borderTop: '1px solid #e2e8f0', paddingTop: '30px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="var(--brand-primary, #6366f1)" />
            Popular Destinations
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {['tokyo', 'dubai', 'paris', 'new-york'].map((dest) => (
              <Link key={dest} href={`/destinations/${dest}`} style={{ color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f1f5f9', borderRadius: '8px', fontWeight: 500, textTransform: 'capitalize' }}>
                {dest.replace('-', ' ')}
                <ArrowRight size={16} color="#94a3b8" />
              </Link>
            ))}
          </div>
        </div>

        {/* Auto Redirect Info */}
        <div style={{ marginTop: '40px', fontSize: '0.9rem', color: '#94a3b8' }}>
          Navigating back to the homepage in <strong>{countdown}</strong> seconds...
        </div>
      </div>
    </div>
  );
}
