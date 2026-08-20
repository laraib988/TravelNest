'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Clock, Star, ArrowRight, Loader2, Compass, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Tour {
  id: string;
  slug: string;
  title: string;
  images: { url: string; alt: string }[];
  price: number;
  duration: string;
  cached_rating_avg: number;
  cached_review_count: number;
  category_name: string;
  pickup_location: string;
  merchandising_badges: string[];
}

export default function AllExperiencesPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTours() {
      try {
        const res = await fetch('/api/public/listings');
        if (!res.ok) throw new Error('Failed to load experiences');
        const data = await res.json();
        setTours(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching experiences.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchTours();
  }, []);

  return (
    <>
      <Header />
      <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '80px', paddingTop: '10px' }}>
        
        {/* HERO SECTION */}
        <div style={{ 
          background: 'linear-gradient(to right, #0f172a, #1e293b)', 
          padding: '80px 24px', 
          textAlign: 'center', 
          color: '#fff',
          marginBottom: '60px',
          borderRadius: '0 0 24px 24px'
        }}>
          <Compass size={48} color="#38bdf8" style={{ margin: '0 auto 16px' }} />
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-1px' }}>Global Experiences</h1>
          <p style={{ fontSize: '1.15rem', color: '#cbd5e1', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
            Discover and book authentic, real-time tours hosted by passionate locals worldwide. From hidden alleyways to extreme adventures, your next journey starts here.
          </p>
        </div>

        {/* MAIN CONTENT AREA */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              All Available Tours <span style={{ color: '#64748b', fontSize: '1.2rem', fontWeight: 500 }}>({tours.length})</span>
            </h2>
          </div>

          {/* LOADING STATE */}
          {isLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
              <Loader2 size={48} className="animate-spin" color="#0284c7" />
              <p style={{ marginTop: '16px', fontSize: '1.1rem', color: '#64748b', fontWeight: 500 }}>Loading real-time experiences...</p>
            </div>
          )}

          {/* ERROR STATE */}
          {!isLoading && error && (
            <div style={{ background: '#fef2f2', border: '1px solid #f87171', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
              <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.4rem', color: '#b91c1c', marginBottom: '8px', fontWeight: 700 }}>Unable to load tours</h3>
              <p style={{ color: '#7f1d1d' }}>{error}</p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!isLoading && !error && tours.length === 0 && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '60px 24px', textAlign: 'center' }}>
              <Compass size={56} color="#cbd5e1" style={{ margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '12px', fontWeight: 800 }}>No active tours found</h3>
              <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 24px' }}>
                There are currently no published experiences available in the database. Please check back later or contact support.
              </p>
            </div>
          )}

          {/* TOUR GRID */}
          {!isLoading && !error && tours.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
              {tours.map((tour) => (
                <Link href={`/tours/${tour.slug}`} key={tour.id} style={{ textDecoration: 'none' }}>
                  <div style={{ 
                    background: '#fff', 
                    borderRadius: '16px', 
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}>
                    {/* IMAGE SECTION */}
                    <div style={{ position: 'relative', height: '220px', backgroundColor: '#f1f5f9' }}>
                      <img 
                        src={tour.images[0]?.url || 'https://placehold.co/600x400?text=No+Image'} 
                        alt={tour.images[0]?.alt || tour.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {tour.merchandising_badges && tour.merchandising_badges.length > 0 && (
                        <div style={{ position: 'absolute', top: '16px', left: '16px', background: '#fff', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {tour.merchandising_badges[0]}
                        </div>
                      )}
                      <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={14} color="#f59e0b" fill="#f59e0b" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                          {tour.cached_rating_avg.toFixed(1)} <span style={{ color: '#64748b', fontWeight: 500 }}>({tour.cached_review_count})</span>
                        </span>
                      </div>
                    </div>

                    {/* CONTENT SECTION */}
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                        <MapPin size={14} color="#0284c7" /> {tour.pickup_location || 'Global'}
                      </div>
                      
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', lineHeight: 1.4 }}>
                        {tour.title}
                      </h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#475569', fontSize: '0.9rem', marginBottom: '24px', flexGrow: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={16} /> {tour.duration}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Compass size={16} /> {tour.category_name}
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: 'auto' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>From</p>
                          <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0284c7' }}>${tour.price}</p>
                        </div>
                        <div style={{ background: '#f0f9ff', padding: '10px', borderRadius: '50%', color: '#0284c7' }}>
                          <ArrowRight size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}
